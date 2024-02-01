import { useGetWalletBalanceQuery } from '@codegreen-labs/api-react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoaderData, useNavigate } from 'react-router-dom'

import TabForm from '@/components/TabForm'
import TokenDetail from '@/components/Token/TokenDetail'
import TokenHistory from '@/components/Token/TokenHistory'
import { WalletBgColor } from '@/constants/themeConfig'
import { IClimateToken } from '@/hooks/chia'
import useClimateWarehouseData from '@/hooks/useClimateWarehouseData'
import { mojoToDisplayBalance } from '@/utils/CoinConverter'

const WalletDetail = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const state = useLoaderData() as IClimateToken

  const {
    projectData,
    unitData,
    isLoading: isClimateWarehouseDataLoading,
  } = useClimateWarehouseData(state)
  const { data: balance, isLoading: isBalanceLoading } =
    useGetWalletBalanceQuery({ walletId: state.walletId })
  const isLoading = isClimateWarehouseDataLoading || isBalanceLoading
  const [tab, setTab] = useState('0')

  if (!state || isLoading) {
    return <Box>{!state ? t('empty') : t('loading')}</Box>
  }

  const tabs = [
    {
      label: 'rule:data.project-details',
      value: '0',
      children: <TokenDetail projectData={projectData} unitData={unitData} />,
    },
    {
      label: 'wallet:transaction-history',
      value: '1',
      children: <TokenHistory {...state} />,
    },
  ]

  return (
    <Stack height="100%">
      <Box height={200} sx={{ bgcolor: WalletBgColor, p: 3 }}>
        <Typography gutterBottom variant="h6" sx={{ mb: 3 }}>
          {projectData?.projectName}
        </Typography>
        <Typography color="grey" gutterBottom>
          {t('wallet:quantity-held')}
        </Typography>
        <Stack direction="row" alignItems="flex-end" sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ mr: 1 }} color="rgba(0,0,0,0.87)">
            {mojoToDisplayBalance(
              balance?.confirmedWalletBalance || 0,
              state.assetId
            )}
          </Typography>
          <Typography color="grey">tCO2e</Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-center">
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 180, mr: 2 }}
            onClick={() => navigate(`/wallet/send/${state.assetId}`)}
          >
            {t('common:action.send')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 180 }}
            onClick={() => navigate(`/wallet/retire/${state.assetId}`)}
          >
            {t('common:action.retire')}
          </Button>
        </Stack>
      </Box>
      <Box height="100%" id="wallet-details" p={3}>
        <TabForm curTab={tab} setCurTab={setTab} tabs={tabs} />
      </Box>
    </Stack>
  )
}

export default WalletDetail
