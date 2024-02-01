import { Alert, Grid, TextField } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  TransactionCATInput,
  TransactionFeeInput,
} from '@/components/Transactions'
import type { SendType } from '@/types/TransactionType'
import { validateWalletAddress } from '@/utils/tableData'

interface Props {
  xchBalance: number
  catBalance: number
}

const SendInput = ({ xchBalance, catBalance }: Props) => {
  const { t } = useTranslation()

  const {
    register,
    formState: { errors },
  } = useFormContext<SendType>()

  return (
    <Grid sx={{ mb: 5 }} container spacing={3}>
      <Grid xs={12} item>
        <TextField
          label={t('wallet:sending.destination-address')}
          fullWidth
          {...register('address', {
            required: true,
            validate: (value) => validateWalletAddress(value),
          })}
          required
          error={!!errors.address}
          helperText={
            errors.address && t('common:validation.invalid-wallet-address')
          }
        />
      </Grid>
      <Grid xs={6} item>
        <TransactionCATInput balance={catBalance} />
      </Grid>
      <Grid xs={6} item>
        <TransactionFeeInput balance={xchBalance} />
      </Grid>
      <Grid xs={12} item>
        <TextField
          label={`${t('wallet:sending.memo')}(${t('optional')})`}
          fullWidth
          {...register('memo')}
        />
        <Alert severity="info" sx={{ mt: 1 }}>
          {t('wallet:sending.memo-description')}
        </Alert>
      </Grid>
    </Grid>
  )
}

SendInput.propTypes = {}

export default SendInput
