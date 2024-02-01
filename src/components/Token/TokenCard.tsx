import { useGetWalletBalanceQuery } from '@codegreen-labs/api-react'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'

import { WalletBgColor } from '@/constants/themeConfig'
import { IClimateToken } from '@/hooks/chia'
import useClimateWarehouseData from '@/hooks/useClimateWarehouseData'
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

const TokenCardSkeleton = () => (
  <StyledTokenCardContainer>
    <Stack sx={{ width: 266, padding: '10px 12px' }} justifyContent="center">
      <Skeleton width="90%" height={24} />
      <Skeleton width="10%" height={16} />
      <Skeleton width={110} height={24} />
    </Stack>
    <Stack flexGrow={1} justifyContent="center">
      <Stack
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="flex-end"
        sx={{ width: '100%' }}
      >
        <Skeleton width="70%" height={24} sx={{ mr: 1 }} />
      </Stack>
    </Stack>
  </StyledTokenCardContainer>
)

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
  const isLoading = isClimateWarehouseDataLoading || isBalanceLoading

  if (isLoading) {
    return <TokenCardSkeleton />
  }

  return (
    <>
      <StyledTokenCardContainer
        onClick={() => {
          navigate(`/wallet/detail/${props.assetId}`)
        }}
        selected={assetId === props.assetId}
      >
        <Stack
          sx={{ width: 266, padding: '10px 12px' }}
          justifyContent="center"
        >
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
    </>
  )
}

export default TokenCard
