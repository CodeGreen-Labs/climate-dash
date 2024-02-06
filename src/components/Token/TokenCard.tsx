import { useGetWalletBalanceQuery } from '@codegreen-labs/api-react'
import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { WalletBgColor } from '@/constants/themeConfig'
import { IClimateToken } from '@/hooks/chia'
import useClimateWarehouseData from '@/hooks/useClimateWarehouseData'
import { useAppDispatch } from '@/store'
import { updateExportAssets } from '@/store/slices/walletSlices'
import { mojoToDisplayBalance } from '@/utils/CoinConverter'

interface IProps extends IClimateToken {}

const StyledTokenCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  width: '100%',
  height: 128,
  overflow: 'hidden',

  cursor: 'pointer',
  flexShrink: 0,
  background: selected ? WalletBgColor : theme.palette.common.white,
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

const TokenCard = (props: IProps) => {
  const navigate = useNavigate()
  const { assetId } = useParams<{ assetId: string }>()
  const {
    projectData,
    unitData,
    isLoading: isClimateWarehouseDataLoading,
  } = useClimateWarehouseData(props)
  const { data: balance, isLoading: isBalanceLoading } =
    useGetWalletBalanceQuery({
      walletId: props.walletId,
    })
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isClimateWarehouseDataLoading && !isBalanceLoading) {
      dispatch(
        updateExportAssets({
          assetId: props.assetId,
          projectName: projectData?.projectName || '',
          warehouseProjectId: projectData?.warehouseProjectId || '',
          vintageYear: unitData?.vintageYear || 0,
          currentRegistry: projectData?.currentRegistry || '',
          balance: mojoToDisplayBalance(
            balance?.confirmedWalletBalance || 0,
            props.assetId
          ),
        })
      )
    }
  }, [isClimateWarehouseDataLoading, isBalanceLoading])

  return (
    <StyledTokenCardContainer
      onClick={() => navigate(`/wallet/detail/${props.assetId}`)}
      selected={assetId === props.assetId}
    >
      <Stack sx={{ width: 266, padding: '10px 12px' }} justifyContent="center">
        <Typography variant="body2">{projectData?.projectName}</Typography>
        <Typography variant="caption">{unitData?.vintageYear}</Typography>
        <Typography variant="caption">
          {projectData?.currentRegistry}
        </Typography>
      </Stack>
      <Stack flexGrow={1} justifyContent="center">
        <Stack
          flexDirection="row"
          alignItems="flex-end"
          justifyContent="flex-end"
          sx={{ width: '100%' }}
        >
          <Typography variant="h6" sx={{ mr: 1 }}>
            {mojoToDisplayBalance(
              balance?.confirmedWalletBalance || 0,
              props.assetId
            )}
          </Typography>
          <Typography variant="caption" color="grey" sx={{ mr: 2 }}>
            tCO2e
          </Typography>
        </Stack>
      </Stack>
    </StyledTokenCardContainer>
  )
}

export default TokenCard
