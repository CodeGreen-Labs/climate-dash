import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { SubmitActionPopup } from '@/components/Popup'
import { xchToMojo } from '@/utils/CoinConverter'

interface ICommit {
  handleCommit: (fee: number) => void
  stagedCount: number
  lockWriteFunc?: boolean
}

interface CommitState {
  isVisible: boolean
  isChecked: boolean
}
function Commit({ handleCommit, stagedCount, lockWriteFunc }: ICommit) {
  const { t } = useTranslation()
  const methods = useForm<{ fee: string }>({
    defaultValues: {
      fee: '0',
    },
    mode: 'onChange',
  })

  const [commitState, setCommitState] = useState<CommitState>({
    isVisible: false,
    isChecked: false,
  })

  const onCommit = () => {
    const fee = xchToMojo(methods.getValues('fee')).toNumber()

    handleCommit(fee)
    setCommitState({
      isVisible: false,
      isChecked: false,
    })
  }

  return (
    <>
      <Grid container>
        <Button
          color="secondary"
          variant="contained"
          disabled={stagedCount === 0 || lockWriteFunc}
          startIcon={
            lockWriteFunc ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
          onClick={() =>
            setCommitState((prev) => ({ ...prev, isVisible: true }))
          }
        >
          {lockWriteFunc
            ? `${t('commit:commit-status-type.committing')}...`
            : t('common:action.commit')}
        </Button>
      </Grid>
      {commitState.isVisible && (
        <FormProvider {...methods}>
          <SubmitActionPopup
            title={t('commit:confirm-commit-information')}
            submitDisable={!commitState.isChecked}
            onClose={() =>
              setCommitState((prev) => ({ ...prev, isVisible: false }))
            }
            onSubmit={onCommit}
          >
            <Grid container spacing={2} width="360px">
              <Grid item xs={12} container flexDirection="row">
                <Typography variant="body1" color="text.secondary">
                  {t('kyc:commit-count')}:
                </Typography>
                <Typography fontWeight={500}>{stagedCount}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  <AlertTitle>{t(t('commit:alert.commit.title'))}</AlertTitle>
                  {t('commit:alert.commit.content')}
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={commitState.isChecked}
                      onChange={() =>
                        setCommitState((prev) => ({
                          ...prev,
                          isChecked: !commitState.isChecked,
                        }))
                      }
                    />
                  }
                  label={t('commit:alert.commit.confirmed')}
                />
              </Grid>
            </Grid>
          </SubmitActionPopup>
        </FormProvider>
      )}
    </>
  )
}

export default Commit
