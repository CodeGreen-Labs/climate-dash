import { InputAdornment, TextField, Typography } from '@mui/material'
import debounce from 'lodash/debounce'
import { memo, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { chain } from '@/constants/network'
import { XCH_FEE_REGEX } from '@/constants/regex'
import type { SendType } from '@/types/TransactionType'
import { mojoToXch, xchToMojo } from '@/utils/CoinConverter'
interface Props {
  balance?: number
}

const TransactionFeeInput = ({ balance = Infinity }: Props) => {
  const { t } = useTranslation('wallet', {
    keyPrefix: 'transaction.input',
  })
  const {
    register,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext<Pick<SendType, 'fee'>>()

  const [fee, setFee] = useState(getValues('fee'))

  useEffect(() => {
    const debouncedWatchFee = debounce((value: string) => {
      setFee(value || '0')
    }, 250)
    debouncedWatchFee(watch('fee'))
  }, [watch('fee')])

  return (
    <TextField
      label={t('fee')}
      fullWidth
      {...register('fee', {
        required: true,
        pattern: XCH_FEE_REGEX,
        max: balance === Infinity ? Infinity : Number(mojoToXch(balance)),
      })}
      sx={{
        '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
          {
            '-webkit-appearance': 'none',
            margin: 0,
          },
        '& input[type="number"]': {
          '-moz-appearance': 'textfield',
        },
      }}
      type="number"
      error={Boolean(errors.fee)}
      helperText={
        errors.fee
          ? xchToMojo(fee).toNumber() > balance
            ? t('insufficient-amount')
            : t('amount-format-error')
          : `${xchToMojo(fee).toString()} mojo`
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Typography color="textSecondary" variant="body1" fontWeight={400}>
              {chain.prefix.toUpperCase()}
            </Typography>
          </InputAdornment>
        ),
      }}
      required
    />
  )
}

export default memo(TransactionFeeInput)
