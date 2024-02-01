import { Grid, Typography } from '@mui/material'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BackBtn } from '@/components/Button'
import Form from '@/components/Form'
import { SubmitActionPopup } from '@/components/Popup'
import HorizontalLinearStepper from '@/components/Stepper'
import useCallbackPrompt from '@/hooks/useCallbackPrompt'
import { FormRowGroup } from '@/types/formTypes'
import { displayAPIErrorToast } from '@/utils/errorHandler'
import { flattenObject, getDirtyData } from '@/utils/tableData'
import { displayToast } from '@/utils/toast'

import Loading from '../Loading'

interface Data {
  [key: string]: any | undefined
}

interface DirtyField {
  [key: string]: boolean
}

enum SubmitAction {
  NEXT = 'common:action.next',
  SAVE = 'common:action.save',
}

enum Step {
  ENTER = 'common:step.enter',
  CONFIRM = 'common:step.confirm',
}

interface Props<T, K> {
  editAbleList: string[]
  isEdit?: boolean
  createFormTitle: string
  onSave: (data: Data) => Promise<any>
  onSaveSuccess?: (res: any, data: Data) => void
  onChange?: (data: any, isDirty: boolean) => void
  defaultValues?: Record<string, any>
  disableSubmitBtn?: boolean
  warpFormComponent?: any
  notDirtyFields?: Record<string, boolean>
  isLoading: boolean
  editRowGroups: FormRowGroup<T, K>[]
  reviewRowGroups: FormRowGroup<T, K>[]
}

const stepList: Array<Step> = [Step.ENTER, Step.CONFIRM]

const EditForm = <T, K>({
  defaultValues,
  editRowGroups,
  reviewRowGroups,
  editAbleList,
  isEdit = false,
  createFormTitle,
  onSave,
  onSaveSuccess,
  onChange,
  warpFormComponent,
  disableSubmitBtn = false,
  notDirtyFields,
  isLoading,
}: Props<T, K>) => {
  const [curData, setCurData] = useState<Data | undefined>(defaultValues)
  const [dirtyFields, setDirtyFields] = useState<DirtyField>({})
  const [submitAction, setSubmitAction] = useState<SubmitAction>(
    SubmitAction.NEXT
  )
  const [showCancelPopup, setShowCancelPopup] = useState(false)

  const [showNavigationPopup, setShowNavigationPopup] = useState(false)

  const [activeStep, setActiveStep] = useState(0)

  const [submitIsLoading, setSubmitIsLoading] = useState(false)

  const navigation = useNavigate()
  const { t } = useTranslation()

  const { showPrompt, processNavigation, cancelNavigation } = useCallbackPrompt(
    { when: showNavigationPopup }
  )

  const title = useMemo(() => {
    if (isEdit) {
      if (submitAction === SubmitAction.NEXT) return 'common:action.edit'
      else return 'common:review'
    } else {
      if (submitAction === SubmitAction.NEXT) return createFormTitle
      else return 'common:review'
    }
  }, [submitAction])

  const renderForm = useMemo(() => {
    if (isEdit) {
      return !!defaultValues
    } else {
      return true
    }
  }, [isEdit, defaultValues])

  const handleSaveData = async (showToast = true) => {
    try {
      if (curData) {
        setSubmitIsLoading(true)
        const formattedData = Object.assign({}, { ...curData })
        for (const key in formattedData) {
          if (formattedData?.[key] === undefined) {
            delete formattedData?.[key]
          }
        }

        let res
        if (isEdit) {
          res = await onSave({
            ...getDirtyData(formattedData, dirtyFields),
          })
        } else {
          res = await onSave(formattedData)
        }
        if (res) {
          if (res.data?.error || res?.error)
            displayAPIErrorToast(res.error, t('common:saved-failed'))
          else {
            processNavigation()
            if (onSaveSuccess) onSaveSuccess(res, formattedData)
            if (showToast) displayToast(200, t('common:saved'))
          }
        }
        setSubmitIsLoading(false)
      }
    } catch (error) {
      const { data: message } = error as any

      setSubmitIsLoading(false)
      displayToast(400, message?.message || t('common:saved-failed'))
    }
  }
  const handleOnChange = (
    data: any,
    isDirty: boolean,
    dirtyFields: Record<string, boolean>
  ) => {
    if (isDirty) {
      let shouldShowPrompt = true
      // unblock navigation if not dirty fields is in dirty fields
      const transformObject = flattenObject(['expired_date'], dirtyFields)
      for (const key in notDirtyFields) {
        if (transformObject[key]) {
          shouldShowPrompt = false
          break
        }
      }
      setShowNavigationPopup(shouldShowPrompt)
    }
    if (onChange) onChange(data, isDirty)
  }

  const handleOnSubmit = (submitData: Data, dirtyFields: DirtyField) => {
    setCurData(submitData)
    setDirtyFields(dirtyFields)
    if (submitAction === SubmitAction.NEXT) {
      setSubmitAction(SubmitAction.SAVE)
      setActiveStep((prev) => prev + 1)
    } else if (submitAction === SubmitAction.SAVE) {
      handleSaveData(true)
    }
  }

  const handleCancel = () => {
    setShowCancelPopup(false)
    processNavigation()
    navigation(-1)
  }

  const handleOnClickCancel = (isDirty: boolean) => {
    if (isDirty) setShowCancelPopup(true)
    else navigation(-1)
  }

  const handleOnClickBack = () => {
    setSubmitAction(SubmitAction.NEXT)
    setActiveStep((prev) => prev - 1)
  }
  const rowGroups = useMemo(
    () =>
      submitAction === SubmitAction.NEXT ? editRowGroups : reviewRowGroups,
    [submitAction, editRowGroups, reviewRowGroups]
  )

  const formattedRowGroups = useMemo<FormRowGroup<any, any>[]>(() => {
    const formatted = rowGroups.map((group) => {
      let curRows = _.cloneDeep(group.rows)

      // Filtering logic based on submitAction and isEdit
      curRows = curRows.map((row) => {
        let newRow = _.cloneDeep(row)

        if (isEdit) {
          newRow = newRow.map((column) => {
            if (
              column.accessorKey &&
              !editAbleList.includes(column.accessorKey as string)
            ) {
              return { ...column, editAble: false }
            }
            return column
          })
        }
        return newRow
      })

      // Injecting default values and changing type to tableRow for SubmitAction.SAVE
      if (curData) {
        const flattenData = flattenObject(['expired_date'], curData) as Data
        curRows = curRows.map((row) =>
          row.map((column) => {
            if (
              column.accessorKey &&
              flattenData[column.accessorKey as string]
            ) {
              return {
                ...column,
                defaultValue: flattenData[column.accessorKey as string],
              }
            }
            return column
          })
        )
      }

      // remove empty row
      curRows = curRows.filter((row) => row.length > 0)

      return {
        ...group,
        rows: curRows,
      }
    })
    // remove empty group
    return formatted.filter((group) => group.rows.length > 0)
  }, [curData, rowGroups])
  return (
    <Grid container flex={1} pb={3} direction="column" position="relative">
      <Grid
        container
        item
        direction="column"
        justifyContent="space-between"
        mb={2}
        gap={2}
        minHeight={100}
      >
        <Grid
          container
          flexDirection="row"
          width="100%"
          justifyContent="center"
        >
          <Grid>
            <HorizontalLinearStepper steps={stepList} activeStep={activeStep} />
          </Grid>
        </Grid>
        {submitAction === SubmitAction.SAVE && (
          <Grid>
            <BackBtn onClick={handleOnClickBack} disabled={submitIsLoading} />
          </Grid>
        )}
        <Grid>
          <Typography variant="h6">{t(title)}</Typography>
        </Grid>
      </Grid>
      <Grid item flex={1} position="relative">
        {renderForm && (
          <Form
            defaultValue={defaultValues}
            rowGroups={formattedRowGroups}
            onSubmit={handleOnSubmit}
            submitBtnText={submitAction}
            onCancel={handleOnClickCancel}
            onChange={handleOnChange}
            warpFormComponent={warpFormComponent}
            submitBtnDisabled={disableSubmitBtn}
            submitIsLoading={submitIsLoading}
          />
        )}
      </Grid>

      {/* cancel */}
      {(showCancelPopup || showPrompt) && (
        <SubmitActionPopup
          title="common:alert.unsaved-work.title"
          onSubmit={() =>
            showPrompt ? cancelNavigation() : setShowCancelPopup(false)
          }
          onCloseOverlay={() => setShowCancelPopup(false)}
          onClose={() => (showPrompt ? processNavigation() : handleCancel())}
          submitBtnText="common:action.continue-editing"
          closeBtnText="common:action.leave-editing"
        >
          <Typography variant="body1">
            {t('common:alert.unsaved-work.content')}
          </Typography>
        </SubmitActionPopup>
      )}
      <Loading isLoading={isLoading} />
    </Grid>
  )
}

export default EditForm
