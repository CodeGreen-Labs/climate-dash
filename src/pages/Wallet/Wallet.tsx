import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'

import TokenHeader from '@/components/Token/TokenHeader'
import TokenList from '@/components/Token/TokenList'
import { useChiaWallet } from '@/hooks/chia'

const Wallet = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { status, isNoFingerprint } = useChiaWallet()

  return (
    <Stack sx={{ height: '100%', overflow: 'hidden' }}>
      {!isNoFingerprint && <TokenHeader />}
      {status === 'synced' && (
        <Stack flexDirection="row" sx={{ height: 'calc( 100% - 118px )' }}>
          <TokenList />
          <Box
            sx={{
              overflow: 'auto',
              flexGrow: 1,
              bgcolor: (theme) => theme.palette.common.white,
            }}
          >
            <Outlet />
          </Box>
        </Stack>
      )}
      {(status === 'syncing' || status === 'init') && !isNoFingerprint && (
        <Stack
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%' }}
        >
          <Typography variant="h3">{t('common:loading')}</Typography>
        </Stack>
      )}
      {isNoFingerprint && (
        <Grid
          container
          flexDirection="column"
          gap={2}
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h5">{t('wallet:welcome')}</Typography>
          </Grid>
          <Grid item width="45%" textAlign="center">
            <Typography variant="body2">
              {t('wallet:create-or-import')}
            </Typography>
          </Grid>
          <Grid container flexDirection="row" gap={2} justifyContent="center">
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate('/wallet/create-mnemonic')
                }}
              >
                {t('common:action.create')}
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  navigate('/wallet/import-mnemonic')
                }}
              >
                {t('common:action.import')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Stack>
  )
}
export default Wallet
