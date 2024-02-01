import { Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CopyBtn } from '../Button'
import { TransactionInfo } from './TransactionStyle'
interface Props {
  transactionId: string
}

const TransactionID = ({ transactionId }: Props) => {
  const { t } = useTranslation()
  return (
    <TransactionInfo sx={{ mt: 2 }}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Typography color={'gray'}>
            {t('wallet:history.transaction-id')}{' '}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ mr: 1 }}>{transactionId}</Typography>
            <CopyBtn
              name={'wallet:history.transaction-id'}
              value={transactionId}
              small
            />
          </Stack>
        </Grid>
      </Grid>
    </TransactionInfo>
  )
}

export default TransactionID
