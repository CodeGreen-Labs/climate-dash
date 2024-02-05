import { useGetWalletBalanceQuery } from '@codegreen-labs/api-react'
import { Box, Chip, Stack, styled, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CopyBtn } from '@/components/Button'
import Tooltips from '@/components/Tooltips'
import { kycLevels } from '@/constants/kyc'
import { chain } from '@/constants/network'
import { useChiaWallet } from '@/hooks/chia'
import { useGetCredentialByAddressQuery } from '@/services'
import { shortenHash } from '@/utils/chia'
import { mojoToDisplayBalance } from '@/utils/CoinConverter'

import TokenViewDetailBtn from './TokenViewDetailBtn'

const SyncStatusChip = styled(Chip)`
  border-radius: 4px;
  height: 32px;
  padding: 0 16px;
  background-color: white;
  border: 1px solid #bdbdbd;
  gap: 8px;
  text-transform: uppercase;
  .MuiChip-label {
    padding: 0;
    font-weight: 500;
  }
  .MuiChip-icon {
    margin: 0;
  }
`
const TokenHeader = () => {
  const { t } = useTranslation()
  const { address, status } = useChiaWallet()
  const { data: balance } = useGetWalletBalanceQuery(
    {
      walletId: 1,
    },
    {
      skip: status !== 'synced',
    }
  )
  const { data: credential } = useGetCredentialByAddressQuery(address || '', {
    skip: !address,
    pollingInterval: 60000,
  })
  const kycLevel = String(credential?.credential_level ?? 0)
  const kycLabel = kycLevels[kycLevel]?.label

  return (
    <Stack
      justifyContent="space-between"
      direction="row"
      sx={{
        p: 3,
        background: (theme) => theme.palette.common.white,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        height: 118,
      }}
      alignItems="flex-end"
    >
      <Box>
        <Stack direction="row" alignItems="center" gap={2} paddingY={1}>
          <Typography variant="h5">{t('wallet:my-wallet')}</Typography>
          <SyncStatusChip
            label={t(
              status === 'synced' ? 'wallet:synced' : 'wallet:not-synced'
            )}
            icon={
              <Box
                sx={{
                  borderRadius: '100%',
                  backgroundColor: status === 'synced' ? '#40AB5C' : '#F37C22',
                  height: 10,
                  width: 10,
                }}
              />
            }
            variant="outlined"
          />
        </Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>
            {t('wallet:address-is', {
              address: shortenHash(address),
            })}
          </Typography>
          <CopyBtn name="wallet:address" value={address} />
          <TokenViewDetailBtn address={address || ''} />
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack direction="column" alignItems="center">
          <Tooltips title={'wallet:balance-description'} translated={false}>
            <Typography>{t('wallet:balance')}</Typography>
          </Tooltips>
          <Typography>
            {mojoToDisplayBalance(balance?.confirmedWalletBalance ?? 0)}{' '}
            {chain.prefix.toUpperCase()}
          </Typography>
        </Stack>
        <Stack direction="column" alignItems="center">
          <Tooltips title={t('kyc:description')} translated={true}>
            <Typography>{t('kyc:level')}</Typography>
          </Tooltips>

          <Typography> {t(kycLabel)}</Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TokenHeader
