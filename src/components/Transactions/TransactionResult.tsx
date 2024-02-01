import { Box, Paper, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import TransactionID from './TransactionID'
interface Props {
  children?: ReactNode
  transactionId: string
}

const TransactionResult = ({ transactionId, children }: Props) => {
  const { t } = useTranslation('wallet', {
    keyPrefix: 'transaction',
  })

  return (
    <Stack>
      <Paper sx={{ mb: 3 }}>
        <Box p={3}>
          <Typography gutterBottom variant="h5">
            {t('result.completed')}
          </Typography>
          <Typography gutterBottom color={'gray'} variant={'body1'}>
            {t('result.completed-description')}
          </Typography>
          <TransactionID transactionId={transactionId} />
        </Box>
      </Paper>

      {children}
    </Stack>
  )
}

export default TransactionResult
