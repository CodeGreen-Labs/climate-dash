import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import theme from '@/constants/themeConfig'
import { useClimateTokens } from '@/hooks/chia'
import { useTypedSelector } from '@/store'
import { assetsSelectors } from '@/store/slices/walletSlices'

import TokenCard from './TokenCard'
import TokenListExport from './TokenListExport'
const TokenList = () => {
  const { t } = useTranslation()
  const { climateTokens, isLoading } = useClimateTokens()
  const { assetId } = useParams<{ assetId: string }>()
  const navigate = useNavigate()
  const assets = useTypedSelector(assetsSelectors)

  useEffect(() => {
    if (assets.length > 0 && !assetId) {
      const navigateAssetId = assets?.[0]?.assetId
      if (navigateAssetId) {
        navigate(`/wallet/detail/${navigateAssetId}`, {
          state: { asset: Object.values(assets)?.[0] },
        })
      }
    }
  }, [assets, assetId])

  return (
    <Box
      sx={{
        overflow: 'auto',
        width: 480,
        flex: '0 0 auto',
        height: '100%',
        background: (theme) => theme.palette.common.white,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" p={3}>
        <Typography variant="h6">{t('wallet:my-assets')}</Typography>
        <TokenListExport />
      </Stack>
      <Divider />

      {climateTokens.length === 0 && (
        <Stack
          direction="column"
          spacing={2}
          justifyContent="center"
          paddingTop={5}
          paddingX={3}
        >
          {isLoading && <CircularProgress />}
          {!isLoading && (
            <Typography variant="h6" color={theme.palette.text.secondary}>
              {t('wallet:empty')}
            </Typography>
          )}
        </Stack>
      )}
      <Stack direction="column">
        {climateTokens.map((token) => (
          <TokenCard key={token.assetId} {...token} />
        ))}
      </Stack>
    </Box>
  )
}

export default TokenList
