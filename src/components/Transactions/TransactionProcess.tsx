import { LoadingButton } from '@mui/lab'
import { Grid, Typography } from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SubmitActionPopup } from '@/components/Popup'
import HorizontalLinearStepper from '@/components/Stepper'
import TabForm from '@/components/TabForm'
import { TransactionButton } from '@/components/Transactions'
import type { TabInfo } from '@/types/tabFormTypes'
import { SendType } from '@/types/TransactionType'

interface Props {
  steps: string[]
  pageTitle: string
  tabs: TabInfo[]
  isLoading?: boolean
  checked?: boolean
  onBeforeCheck: () => { verify: boolean; message?: string }
  onSend: () => Promise<boolean>
}

interface Title {
  title: string
  submitBtn?: string
  cancelBtn: string
}

const TransactionProcess: FC<Props> = ({
  steps,
  pageTitle,
  isLoading,
  tabs,
  checked,
  onBeforeCheck,
  onSend,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const methods = useFormContext<SendType>()

  const [curTab, setCurTab] = useState(steps[0])

  const [showKYCConflictAlert, setShowKYCConflictAlert] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const submitDisabled = useMemo(() => {
    if (curTab === steps[0]) return !methods.formState.isValid
    return !checked
  }, [curTab, checked, methods.formState.isValid])

  const [title, setTitle] = useState<Title>({
    title: pageTitle,
    submitBtn: 'common:action.next',
    cancelBtn: 'common:action.cancel',
  })

  const onReview = () => {
    setCurTab(steps[1])

    setTitle({
      title: 'common:review',
      submitBtn: 'common:action.commit',
      cancelBtn: 'common:action.back',
    })
  }

  const handleOnSubmit = async () => {
    if (curTab === steps[0]) {
      const { verify, message } = onBeforeCheck()

      if (verify) {
        onReview()
      } else {
        setShowKYCConflictAlert(message ?? '')
      }
    } else if (curTab === steps[1]) {
      const TransactionResult = await onSend()
      if (TransactionResult) {
        setCurTab(steps[2])
        setTitle({
          title: 'wallet:transaction.result.title',
          cancelBtn: 'common:action.close',
        })
      }
    }
  }

  const handleOnCancel = () => {
    if (curTab === steps[0]) {
      if (Object.keys(methods.formState.dirtyFields).length > 0) {
        setShowAlert(true)
      } else {
        navigate(-1)
      }
    } else if (curTab === steps[1]) {
      setCurTab(steps[0])
      setTitle({
        title: 'common:action.send',
        submitBtn: 'common:action.next',
        cancelBtn: 'common:action.cancel',
      })
    } else if (curTab === steps[2]) {
      methods.reset()
      navigate(-1)
    }
  }

  return (
    <>
      <Grid container direction="column" gap={2}>
        <Grid
          container
          flexDirection="row"
          width="100%"
          justifyContent="flex-start"
        >
          <Grid item sx={{ mb: 3 }}>
            <HorizontalLinearStepper
              steps={steps}
              activeStep={steps.indexOf(curTab)}
            />
          </Grid>
          <Grid item width="100%">
            <Typography variant="h4">
              <Trans>{title.title}</Trans>
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
        >
          <Grid item sx={{ mb: 3 }}>
            <TabForm
              curTab={curTab}
              setCurTab={setCurTab}
              tabs={tabs}
              displayTabs={false}
            />
          </Grid>
          <Grid container justifyContent="flex-end" sx={{ mb: 3 }}>
            <TransactionButton
              color="primary"
              disabled={isLoading}
              onClick={() => handleOnCancel()}
            >
              <Trans>{title.cancelBtn}</Trans>
            </TransactionButton>

            {title.submitBtn && (
              <LoadingButton
                variant="contained"
                onClick={() => handleOnSubmit()}
                disabled={submitDisabled}
                loading={isLoading}
              >
                <Trans>{title.submitBtn}</Trans>
              </LoadingButton>
            )}
          </Grid>
        </Grid>
      </Grid>

      {showAlert && (
        <SubmitActionPopup
          title="common:alert.leave.title"
          onSubmit={() => setShowAlert(false)}
          onClose={() => {
            setShowAlert(false)
            navigate(-1)
          }}
          submitBtnText="common:action.continue-sending"
          closeBtnText="common:action.leave"
        />
      )}
      {showKYCConflictAlert && (
        <SubmitActionPopup
          title="wallet:alert.kyc-conflict.title"
          onSubmit={async () => {
            onReview()
            setShowKYCConflictAlert('')
          }}
          onClose={() => {
            setShowKYCConflictAlert('')
          }}
          submitBtnText="common:action.continue"
          closeBtnText="common:action.cancel"
        >
          <Typography variant="body1">{showKYCConflictAlert}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('wallet:alert.kyc-conflict.sub-content')}
          </Typography>
        </SubmitActionPopup>
      )}
    </>
  )
}

export default TransactionProcess
