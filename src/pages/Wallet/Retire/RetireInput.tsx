import { Help as HelpIcon } from '@mui/icons-material'
import {
  Alert,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  TransactionCATInput,
  TransactionFeeInput,
} from '@/components/Transactions'
import { chain } from '@/constants/network'
import { useKeysQuery } from '@/services'
import { RetireType } from '@/types/TransactionType'
import { validateWalletAddress } from '@/utils/tableData'
interface Props {
  xchBalance: number
  catBalance: number
}
const RetireInput = ({ xchBalance, catBalance }: Props) => {
  const { t } = useTranslation()

  const { data: keys } = useKeysQuery({ prefix: chain.prefix })

  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<RetireType>()

  const handleGetRetireKeys = async () => {
    if (keys) {
      setValue('publicKey', keys.bech32m ?? '', {
        shouldValidate: true,
      })
    }
  }

  const theme = useTheme()

  return (
    <Grid container spacing={3}>
      <Grid xs={12} item>
        <Alert severity="info">{t('wallet:retirement.description')}</Alert>
      </Grid>
      <Grid xs={12} item>
        <Stack direction={'row'}>
          <TextField
            label={t('wallet:retirement.beneficiary-wallet-address')}
            fullWidth
            {...register('publicKey', {
              required: true,
              validate: (value) => validateWalletAddress(value),
            })}
            error={!!errors.publicKey}
            helperText={
              errors.publicKey && t('common:validation.invalid-wallet-address')
            }
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip
                    title={t(
                      'wallet:retirement.beneficiary-wallet-address-description'
                    )}
                    arrow
                  >
                    <HelpIcon
                      color="disabled"
                      sx={{
                        color: theme.palette.text.secondary,
                        width: '24px',
                        height: '24px',
                        mr: 1,
                      }}
                    />
                  </Tooltip>
                  <Button
                    variant="contained"
                    sx={{
                      px: '20px',
                    }}
                    onClick={handleGetRetireKeys}
                  >
                    {t('wallet:retirement.my-address')}
                  </Button>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: Boolean(getValues().publicKey),
            }}
          />
        </Stack>
      </Grid>
      <Grid xs={12} item>
        <TextField
          label={`${t('wallet:retirement.beneficiary-name')}(${t('optional')})`}
          fullWidth
          helperText={t('wallet:retirement.beneficiary-name-description')}
          {...register('beneficiary', {})}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title={t('wallet:retirement.beneficiary-description')}
                  arrow
                >
                  <HelpIcon
                    color="disabled"
                    sx={{
                      color: theme.palette.text.secondary,
                      width: '24px',
                      height: '24px',
                      mr: 1,
                    }}
                  />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <TransactionCATInput balance={catBalance} />
      </Grid>
      <Grid xs={6} item>
        <TransactionFeeInput balance={xchBalance} />
      </Grid>
    </Grid>
  )
}

export default RetireInput
