import { useGetWalletBalancesQuery } from '@codegreen-labs/api-react'
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
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
import useRetire from '@/hooks/useRetire'
import {
  useGetCredentialByAddressQuery,
  useGetRuleByTokenIdQuery,
  useParseKeysQuery,
} from '@/services'
import { WalletBalances } from '@/types/chiaApi'
import { RetireType, TransactionStep } from '@/types/TransactionType'
import { prefix0x } from '@/utils/chia'
import { catToMojo, xchToMojo } from '@/utils/CoinConverter'
import { displayToast } from '@/utils/toast'
import { handleOnCheckKyc } from '@/utils/transaction'

import RetireInput from './RetireInput'

const stepList: Array<TransactionStep> = [
  TransactionStep.Input,
  TransactionStep.Review,
  TransactionStep.Result,
]

const Retire = () => {
  const { t } = useTranslation()

  const state = useLoaderData() as IClimateToken
  const { assetId, walletId } = state
  const { unitData, projectData } = useClimateWarehouseData(state)
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

  const { retire, isLoading } = useRetire(state)

  const [checked, setChecked] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string>('')

  const [watchBeneficiaryAddress, setWatchedBeneficiaryAddress] =
    useState<string>('')

  const debouncedUpdateBeneficiaryAddress = useMemo(
    () =>
      debounce((address: string) => {
        setWatchedBeneficiaryAddress(address)
      }, 250),
    []
  )

  const { data: senderKyc, error: senderKycError } =
    useGetCredentialByAddressQuery(address || '', {
      skip: !address,
    })
  const methods = useForm<RetireType>({
    defaultValues: {
      fee: '0.00000001',
    },
    mode: 'onChange',
  })

  const { data: parsedKeys } = useParseKeysQuery(watchBeneficiaryAddress)

  const { data: beneficiaryKyc, error } = useGetCredentialByAddressQuery(
    watchBeneficiaryAddress,
    { skip: !watchBeneficiaryAddress }
  )

  const { data: assetRule } = useGetRuleByTokenIdQuery(assetId || '', {
    skip: !assetId,
  })

  const reviewInfo = [
    {
      title: 'wallet:transaction-information',
      list: [
        {
          title: t('wallet:retirement.beneficiary-name'),
          field: methods.getValues().beneficiary,
        },
        {
          title: t('wallet:retirement.beneficiary-wallet-address'),
          field: methods.getValues().publicKey,
        },
        {
          title: t('wallet:retirement.quantity'),
          field: methods.getValues().amount,
        },
        {
          title: t('wallet:transaction.input.fee'),
          field: methods.getValues().fee,
        },
      ],
    },
  ]

  const handleChangeCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const onSend = async () => {
    try {
      const data = methods.getValues()

      if (!parsedKeys) {
        return false
      }

      const txId = await retire({
        amount: catToMojo(data.amount).toNumber(),
        fee: xchToMojo(data.fee).toNumber(),
        beneficiary: parsedKeys?.hex,
        address: data.publicKey,
      })

      setTransactionId(prefix0x(txId))
      return true
    } catch (e: any) {
      displayToast(400, e?.message || JSON.stringify(e))
      return false
    }
  }

  useEffect(() => {
    debouncedUpdateBeneficiaryAddress(methods.watch('publicKey'))
    return () => {
      debouncedUpdateBeneficiaryAddress.cancel()
    }
  }, [methods.watch('publicKey'), debouncedUpdateBeneficiaryAddress])

  const tabs = useMemo(
    () => [
      {
        label: 'Retire',
        value: TransactionStep.Input,
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
                  assetId={assetId}
                  balance={balance?.spendableBalance}
                />
              </Box>
            </Paper>
            <Paper>
              <Box p={2} pl={3} pr={3}>
                <Stack direction="row" alignItems="flex-end">
                  <Typography sx={{ mr: 1 }}>
                    {t('wallet:transaction.info')}
                  </Typography>
                  <Typography variant="caption">
                    {t('wallet:required-information')}
                  </Typography>
                </Stack>
              </Box>
              <Divider />
              <Box p={3}>
                <RetireInput
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
        value: TransactionStep.Review,
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
        value: TransactionStep.Result,
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
    ],
    [methods.getValues(), balance]
  )
  return (
    <FormProvider {...methods}>
      <TransactionProcess
        steps={stepList}
        pageTitle="common:action.retire"
        tabs={tabs}
        isLoading={isLoading}
        checked={checked}
        onBeforeCheck={() =>
          handleOnCheckKyc(
            error ? undefined : beneficiaryKyc,
            watchBeneficiaryAddress,
            senderKycError ? undefined : senderKyc,
            address as string,
            assetRule || undefined,
            assetId as string,
            'retirement'
          )
        }
        onSend={onSend}
      />
    </FormProvider>
  )
}

export default Retire
