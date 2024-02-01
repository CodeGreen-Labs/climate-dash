import { Box, Divider, Stack, Typography } from '@mui/material'
import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { CopyBtn } from '@/components/Button'

import { IHistroy } from '../Token/TokenHistory'
import Violation, { OnChain } from '../Violation'
interface Props {
  row: Row<IHistroy>
  assetId?: string
  type?: 'violation' | 'onChain'
}

const TransactionInfo = ({ row, type = 'onChain' }: Props) => {
  const { t } = useTranslation()

  const isTransaction = row.original.type === 'transaction'

  return (
    <Box sx={{ p: 1, background: (theme) => theme.palette.grey[100] }}>
      {isTransaction && (
        <>
          <Stack direction="row" alignItems="center" sx={{ m: 2 }}>
            <Typography color="grey" sx={{ mr: 1 }}>
              {type === 'violation'
                ? t(`wallet:history.violation`)
                : t(`wallet:history.status`)}
              :
            </Typography>
            {type === 'violation' && <Violation {...row.original} />}
            {type === 'onChain' && <OnChain row={row} />}
          </Stack>
          <Divider />
        </>
      )}
      <Stack direction="row" alignItems="center" sx={{ m: 2 }}>
        <Typography color="grey" sx={{ mr: 1 }}>
          {t('wallet:history.transaction-id')}:
        </Typography>
        {row.getValue('transactionId')}
        <CopyBtn
          name="wallet:history.transaction-id"
          value={row.getValue('transactionId')}
          sx={{ ml: 1 }}
          small
        />
      </Stack>
      {isTransaction && (
        <>
          <Divider />
          <Stack direction="row" alignItems="center" sx={{ m: 2 }}>
            <Typography color="grey" sx={{ mr: 1 }}>
              {t('wallet:history.from-address-is')}
            </Typography>
            {row.original.from}
            <CopyBtn
              name="wallet:history.from-address"
              value={row.original.from}
              sx={{ ml: 1 }}
              small
            />
          </Stack>
          <Divider />
          <Stack direction="row" alignItems="center" sx={{ m: 2 }}>
            <Typography color="grey" sx={{ mr: 1 }}>
              {t('wallet:history.to-address-is')}
            </Typography>
            {row.original.to}
            <CopyBtn
              name="wallet:history.to-address"
              value={row.original.to}
              sx={{ ml: 1 }}
              small
            />
          </Stack>
        </>
      )}
    </Box>
  )
}

export default TransactionInfo
