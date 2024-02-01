import {
  useGetWalletBalancesQuery,
  useSpendCATMutation,
} from '@codegreen-labs/api-react'
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import debounce from 'lodash/debounce'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'

import {
  TransactionBasicInfo,
  TransactionCommitAlert,
  TransactionProcess,
  TransactionResult,
  TransactionReviewList,
} from '@/components/Transactions'
import { useChiaWallet } from '@/hooks/chia'
import { IClimateToken } from '@/hooks/chia/useClimateTokens'
import useClimateWarehouseData from '@/hooks/useClimateWarehouseData'
import {
  useGetCredentialByAddressQuery,
  useGetRuleByTokenIdQuery,
} from '@/services'
import { WalletBalances } from '@/types/chiaApi'
import { SendType } from '@/types/TransactionType'
import { prefix0x } from '@/utils/chia'
import {
  catToMojo,
  mojoToDisplayBalance,
  xchToMojo,
} from '@/utils/CoinConverter'
import { displayToast } from '@/utils/toast'
import { handleOnCheckKyc } from '@/utils/transaction'

import SendInput from './SendInput'

export enum SendStep {
  Input = 'wallet:transaction.info',
  Review = 'common:review',
  Result = 'wallet:transaction.result.title',
}
const stepList: Array<SendStep> = [
  SendStep.Input,
  SendStep.Review,
  SendStep.Result,
]

const Send = () => {
  const { t } = useTranslation()
  const state = useLoaderData() as IClimateToken
  const { assetId, walletId } = state
  const { unitData, projectData } = useClimateWarehouseData(state)

  const [checked, setChecked] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string>('')

  const { status, address } = useChiaWallet()
  const { data } = useGetWalletBalancesQuery(
    {
      walletIds: [1, walletId],
    },
    {
      skip: status !== 'synced',
    }
  )

  const {
    walletBalances: { 1: xchBalance, [walletId]: balance },
  } = (data ?? { walletBalances: {} }) as { walletBalances: WalletBalances }

  const [spendCAT, { isLoading }] = useSpendCATMutation()

  const methods = useForm<SendType>({
    defaultValues: {
      fee: '0.00000001',
    },
    mode: 'onChange',
  })

  const [watchToAddress, setWatchedToAddress] = useState<string>('')

  const debouncedUpdateAddress = useMemo(
    () =>
      debounce((address: string) => {
        setWatchedToAddress(address)
      }, 300),
    []
  )

  const { data: receiverKyc, error } = useGetCredentialByAddressQuery(
    watchToAddress,
    {
      skip: !watchToAddress,
    }
  )

  const { data: senderKyc, error: senderKycError } =
    useGetCredentialByAddressQuery(address || '', {
      skip: !address,
    })

  const { data: assetRule } = useGetRuleByTokenIdQuery(assetId || '', {
    skip: !assetId,
  })

  const reviewInfo = useMemo(
    () => [
      {
        title: 'wallet:transaction-information',
        list: [
          {
            title: 'wallet:sending.transfer-from',
            field: address,
          },
          {
            title: 'wallet:sending.destination-address',
            field: methods.getValues().address,
          },

          {
            title: 'wallet:sending.send-quantity',
            field: methods.getValues().amount,
          },
          {
            title: 'wallet:sending.transaction-fee',
            field: methods.getValues().fee,
          },
          {
            title: 'wallet:sending.memo',
            field: methods.getValues().memo,
          },
        ],
      },
    ],
    [methods.getValues()]
  )

  const handleChangeCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const onSend = async () => {
    try {
      const data = methods.getValues()
      const response = await spendCAT({
        walletId,
        address: data.address,
        // !chia/api-react has a wrong type definition for amount and fee,
        // @ts-ignore
        amount: catToMojo(data.amount).toNumber(),
        // @ts-ignore
        fee: xchToMojo(data.fee).toNumber(),
        reuse_puzhash: true,
        memos: [data.memo],
      }).unwrap()
      setTransactionId(prefix0x(response.transactionId))

      return true
    } catch (e: any) {
      displayToast(400, e?.message || JSON.stringify(e))
      return false
    }
  }

  useEffect(() => {
    debouncedUpdateAddress(methods.watch('address'))
    return () => {
      debouncedUpdateAddress.cancel()
    }
  }, [methods.watch('address'), debouncedUpdateAddress])

  const tabs = [
    {
      label: 'Send',
      value: SendStep.Input,
      children: (
        <Grid container flexDirection="column" gap={3} width="100%">
          <Paper>
            <Box p={2} pl={3} pr={3}>
              <Typography>{t('wallet:asset-information')}</Typography>
            </Box>
            <Divider />
            <Box p={3}>
              <TransactionBasicInfo
                projectName={projectData?.projectName}
                unitVintageYear={unitData?.vintageYear}
                currentRegistry={projectData?.currentRegistry}
              />
            </Box>
          </Paper>
          <Paper>
            <Box p={2} pl={3} pr={3}>
              <Typography>{t('wallet:sending.transfer-from')}</Typography>
            </Box>
            <Divider />
            <Box p={3}>
              <TextField
                value={`My Wallet(${address})`}
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': {
                    backgroundColor: (theme) => theme.palette.grey[300],
                    color: (theme) => theme.palette.grey[600],
                  },
                  '& .MuiFormHelperText-root': {
                    color: (theme) => theme.palette.grey[600],
                  },
                }}
                helperText={`${t(
                  'wallet:quantity-held'
                )}:${mojoToDisplayBalance(
                  balance?.spendableBalance ?? 0,
                  assetId
                )} tCO2e`}
              />
            </Box>
          </Paper>
          <Paper>
            <Box p={2} pl={3} pr={3}>
              <Stack direction="row" alignItems="flex-end">
                <Typography sx={{ mr: 1 }}>
                  {t('wallet:sending.transfer-to')}
                </Typography>
                <Typography variant="caption">
                  {t('wallet:required-information')}
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <Box p={3}>
              <SendInput
                xchBalance={xchBalance?.spendableBalance ?? 0}
                catBalance={balance?.spendableBalance ?? 0}
              />
            </Box>
          </Paper>
        </Grid>
      ),
    },
    {
      label: 'review',
      value: SendStep.Review,
      children: (
        <Grid>
          <Paper sx={{ mb: 3 }}>
            <Box p={3}>
              <TransactionReviewList
                projectName={projectData?.projectName}
                unitVintageYear={unitData?.vintageYear}
                currentRegistry={projectData?.currentRegistry}
                infos={reviewInfo}
              />
            </Box>
          </Paper>

          <TransactionCommitAlert />
          <Stack sx={{ m: 1 }}>
            <FormControlLabel
              control={
                <Checkbox checked={checked} onChange={handleChangeCheck} />
              }
              label={t('commit:alert.commit.confirmed')}
            />
          </Stack>
        </Grid>
      ),
    },
    {
      label: 'wallet:transaction.result.title',
      value: SendStep.Result,
      children: (
        <TransactionResult transactionId={transactionId}>
          <Paper sx={{ mb: 3 }}>
            <Box p={3}>
              <TransactionReviewList
                projectName={projectData?.projectName}
                unitVintageYear={unitData?.vintageYear}
                currentRegistry={projectData?.currentRegistry}
                infos={reviewInfo}
              />
            </Box>
          </Paper>
        </TransactionResult>
      ),
    },
  ]

  return (
    <FormProvider {...methods}>
      <TransactionProcess
        steps={stepList}
        pageTitle="common:action.send"
        tabs={tabs}
        isLoading={isLoading}
        checked={checked}
        onBeforeCheck={() =>
          handleOnCheckKyc(
            error ? undefined : receiverKyc,
            watchToAddress,
            senderKycError ? undefined : senderKyc,
            address as string,
            assetRule || undefined,
            assetId as string,
            'receiving'
          )
        }
        onSend={onSend}
      />
    </FormProvider>
  )
}

export default Send
