import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid } from '@mui/material'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormRowGroup } from '@/types/formTypes'
import { getErrorMessage } from '@/utils/form'
import { flattenObject } from '@/utils/tableData'

import { ViewMoreBtn } from '../Button'
import Loading from '../Loading'
import FormItem from './FormItem'

interface Props<T, K> {
  onCommit?: (data: any) => void
  onSubmit?: (data: any, dirtyFields: any) => void
  onCancel?: (isDirty: boolean) => void
  onChange?: (
    data: any,
    isDirty: boolean,
    dirtyFields: Record<string, boolean>
  ) => void
  submitBtnText?: string
  submitBtnDisabled?: boolean
  commitBtnDisabled?: boolean
  withCommitButton?: boolean
  withActionButtons?: boolean
  rowGroups: FormRowGroup<T, K>[]
  defaultValue?: any
  warpFormComponent?: any
  submitIsLoading?: boolean
  isLoading?: boolean
}

type Action = 'commit' | 'submit' | 'cancel'

const Form = ({
  onCommit,
  onSubmit,
  onCancel,
  onChange,
  rowGroups,
  submitBtnText = 'SAVE & PROCESS',
  withCommitButton = false,
  commitBtnDisabled = false,
  withActionButtons = true,
  children,
  defaultValue,
  submitBtnDisabled = false,
  submitIsLoading = false,
  isLoading = false,
}: PropsWithChildren<Props<any, any>>) => {
  const {
    control,
    getValues,
    setValue,
    watch,
    resetField,
    formState: { errors, isDirty, dirtyFields, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultValue,
  })

  const { t } = useTranslation()
  const handleActions = async (action: Action) => {
    switch (action) {
      case 'commit':
        if (onCommit) onCommit(getValues())

        break
      case 'submit':
        if (onSubmit) onSubmit(getValues(), dirtyFields)
        break
      default:
        break
    }
  }

  const watchedFields = watch() // Watch all form fields

  useEffect(() => {
    if (onChange) onChange(getValues(), isDirty, dirtyFields)
  }, [watchedFields])

  // handle extension rows
  const [extensionToggles, setExtensionToggles] = useState<
    Record<string, boolean>
  >({})

  const handleToggleExtension = (accessorKey: string) => {
    setExtensionToggles((prevState) => ({
      ...prevState,
      [accessorKey]: !prevState[accessorKey],
    }))
  }

  const adjustedRowGroups: FormRowGroup<any, any>[] = useMemo(
    () =>
      rowGroups.map((group) => {
        const newRows = []
        for (const row of group.rows) {
          newRows.push(row)
          for (const column of row) {
            if (column.extensionRows && column.accessorKey) {
              if (extensionToggles[column.accessorKey] === undefined) {
                extensionToggles[column.accessorKey] = false
              }
              const isExtended = extensionToggles[column.accessorKey]
              if (isExtended) {
                newRows.push(...column.extensionRows)
              }
              newRows.push([
                {
                  type: 'customize',
                  cell: () => (
                    <Box
                      flex={1}
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                    >
                      <ViewMoreBtn
                        toggle={isExtended}
                        handleOnClick={() =>
                          handleToggleExtension(column.accessorKey)
                        }
                      />
                    </Box>
                  ),
                },
              ])
            }
          }
        }
        return {
          ...group,
          rows: newRows,
        }
      }) as FormRowGroup<any, any>[],
    [extensionToggles, rowGroups]
  )
  return (
    <Grid container flex={1} flexDirection="column">
      <Loading isLoading={isLoading} />
      <form>
        {adjustedRowGroups.map((group, groupIndex) => {
          return group.warpComponent(
            <Grid container direction="column" key={`row-group-${groupIndex}`}>
              {group.rows.map((row, rowIndex) => (
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  key={`row-${rowIndex}`}
                >
                  {row.map(
                    (
                      {
                        type,
                        accessorKey,
                        header,
                        rules,
                        rowSx,

                        ...Props
                      },
                      colIndex
                    ) => {
                      const flattenedDefaultValue = flattenObject(
                        [],
                        defaultValue
                      )
                      const flattenedErrors = flattenObject(
                        [accessorKey],
                        errors
                      )
                      const flattenedDirtyFields = flattenObject(
                        [],
                        dirtyFields
                      )

                      const errorMessage = getErrorMessage(accessorKey, errors)

                      const errorForAccessor = accessorKey
                        ? flattenedErrors[accessorKey] || errors[accessorKey]
                        : false

                      const defaultValForAccessor = accessorKey
                        ? flattenedDefaultValue?.[accessorKey]
                        : undefined

                      return (
                        <Grid
                          item
                          key={`${type}-${header}-${accessorKey}`}
                          flex={1}
                          sx={rowSx}
                        >
                          <Controller
                            render={({ field }) => (
                              <Grid item>
                                <FormItem
                                  key={accessorKey}
                                  rules={rules}
                                  type={type}
                                  field={field as ControllerRenderProps}
                                  error={errorForAccessor}
                                  errorMessage={errorMessage as string}
                                  header={header}
                                  accessorKey={accessorKey}
                                  defaultValue={defaultValForAccessor}
                                  setValue={setValue}
                                  dirtyFields={flattenedDirtyFields}
                                  resetField={resetField}
                                  {...Props}
                                />
                              </Grid>
                            )}
                            name={
                              (accessorKey ||
                                `${rowIndex}-${colIndex}`) as keyof Object
                            }
                            control={control}
                            rules={rules || {}}
                          />
                        </Grid>
                      )
                    }
                  )}
                </Grid>
              ))}
            </Grid>
          )
        })}
        <Grid item>{children}</Grid>
      </form>

      {withActionButtons && (
        <Grid container item>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            mt={5}
          >
            <Grid item>
              <Button
                variant="text"
                color="primary"
                disabled={submitIsLoading}
                id="form-cancel-button"
                onClick={() => {
                  if (onCancel) onCancel(isDirty)
                }}
              >
                {t('common:action.cancel')}
              </Button>
            </Grid>

            <Grid item display="flex" flexDirection="row" gap={2}>
              {withCommitButton && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleActions('commit')}
                  disabled={commitBtnDisabled}
                >
                  COMMIT NOW
                </Button>
              )}
              <LoadingButton
                disabled={
                  Object.keys(errors).length > 0 ||
                  submitBtnDisabled ||
                  !isDirty ||
                  !isValid
                }
                id="form-submit-button"
                onClick={() => handleActions('submit')}
                variant="contained"
                color="primary"
                loading={submitIsLoading}
              >
                {t(submitBtnText)}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}
export default Form
