import { InputAdornment, TextField, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { TOKEN_AMOUNT_REGEX } from '@/constants/regex'
import { CARBON_TOKEN_UNIT } from '@/constants/unit'
import type { SendType } from '@/types/TransactionType'
import { mojoToCat } from '@/utils/CoinConverter'

interface Props {
  balance: number
}

const TransactionCATInput = ({ balance }: Props) => {
  const { t } = useTranslation('wallet', {
    keyPrefix: 'transaction.input',
  })

  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<Pick<SendType, 'amount'>>()
  return (
    <TextField
      label={t('quantity')}
      fullWidth
      {...register('amount', {
        required: true,
        pattern: TOKEN_AMOUNT_REGEX,
        max: Number(mojoToCat(balance)),
      })}
      error={Boolean(errors.amount)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Typography color="textSecondary" variant="body1" fontWeight={400}>
              {CARBON_TOKEN_UNIT}
            </Typography>
          </InputAdornment>
        ),
      }}
      helperText={
        Boolean(errors.amount) &&
        (Number(getValues('amount')) > Number(mojoToCat(balance))
          ? t('insufficient-amount')
          : t('amount-format-error'))
      }
      required
    />
  )
}

export default TransactionCATInput
