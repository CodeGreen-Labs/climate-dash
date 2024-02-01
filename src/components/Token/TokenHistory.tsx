import {
  useGetTransactionsCountQuery,
  useGetTransactionsQuery,
} from '@codegreen-labs/api-react'
import { Box, Stack } from '@mui/material'
import { PaginationState, Row } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyBtn, ExportButton, TableExpendButton } from '@/components/Button'
import { TransactionInfo } from '@/components/Info'
import Table from '@/components/Table'
import { ITransaction, TransactionType, useChiaWallet } from '@/hooks/chia'
import { ColumnDef } from '@/types/crudTableTypes'
import { shortenHash } from '@/utils/chia'
import { mojoToDisplayBalance } from '@/utils/CoinConverter'
import { formatTime } from '@/utils/datetime'
import { makeHeaders } from '@/utils/exportData'

import { OnChain } from '../Violation'

interface IProps {
  walletId: number
  assetId: string
}

export enum TokenType {
  Default = 0,
  Send = 1,
  Receive = 0,
  Detokenize = 3,
  Retire = 2,
}

export interface IHistroy {
  type: 'retirement' | 'transaction'
  status: 'on-chain' | 'pending'
  transactionId: string
  quantity: string
  time: number
  violation: string
  from: string
  to: string
  memos: string[]
}

const TokenHistory = ({ walletId, assetId }: IProps) => {
  const { t } = useTranslation()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { address } = useChiaWallet()
  const { data: total } = useGetTransactionsCountQuery(
    {
      walletId,
    },
    { skip: !walletId }
  )
  const { data, isLoading } = useGetTransactionsQuery(
    {
      walletId,
      start: pagination.pageIndex * pagination.pageSize,
      end: (pagination.pageIndex + 1) * pagination.pageSize,
      sortKey: 'RELEVANCE',
    },
    { skip: !walletId }
  )

  const convertTransactionToHistory = (
    {
      name,
      amount,
      confirmed,
      createdAtTime,
      type: _type,
      toAddress,
      memos,
    }: ITransaction,
    assetId: string
  ): IHistroy => {
    const isOutgoing = [
      TransactionType.OUTGOING,
      TransactionType.OUTGOING_TRADE,
      TokenType.Detokenize,
      TokenType.Retire,
    ].includes(_type)

    const type: TokenType =
      _type === TokenType.Default
        ? isOutgoing
          ? TokenType.Send
          : TokenType.Receive
        : _type

    return {
      type: type === TokenType.Retire ? 'retirement' : 'transaction',
      status: confirmed ? 'on-chain' : 'pending',
      transactionId: name,
      quantity: `${mojoToDisplayBalance(amount ?? '0', assetId)} tCO2`,
      time: createdAtTime,
      violation: '-',
      from: type === TokenType.Send ? address || '' : toAddress,
      to: type === TokenType.Send ? toAddress : address || '',
      memos: Object.values(memos ?? {}),
    }
  }

  const transactions = useMemo(() => {
    if (!data || !assetId) return [] as IHistroy[]
    return (data as ITransaction[]).map((item) =>
      convertTransactionToHistory(item, assetId)
    )
  }, [data, assetId])

  const column = useMemo<ColumnDef<IHistroy, any>[]>(
    () => [
      {
        header: 'wallet:history.type',
        accessorKey: 'type',
        cell: ({ row }) => t(`wallet:history.type-is.${row.getValue('type')}`),
      },
      {
        header: 'wallet:history.status',
        accessorKey: 'violation',
        cell: ({ row }) => <OnChain row={row} />,
      },
      {
        header: 'wallet:history.transaction-id',
        accessorKey: 'transactionId',
        cell: ({ row }) => (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: 140 }}
          >
            {shortenHash(row.getValue('transactionId'))}{' '}
            <CopyBtn
              name="wallet:history.transaction-id"
              value={row.getValue('transactionId')}
              small
            />
          </Stack>
        ),
      },
      {
        header: 'wallet:history.quantity',
        accessorKey: 'quantity',
      },
      {
        header: 'wallet:history.time',
        accessorKey: 'time',
        cell: ({ row }) =>
          row.getValue('time')
            ? formatTime((row.getValue('time') as number) * 1000)
            : '-',
      },
      {
        header: '',
        accessorKey: 'Actions',
        cell: TableExpendButton,
      },
    ],
    [assetId]
  )

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <ExportButton
          data={transactions}
          headers={makeHeaders(
            column.filter((item) => item.accessorKey !== 'violation')
          )}
          filename={`${assetId}-history`}
        />
      </Stack>
      <Box
        sx={{
          paddingBottom: 3,
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          borderRadius: '6px',
        }}
      >
        <Table
          data={transactions}
          columns={column}
          ExpendComponent={({ row }: { row: Row<IHistroy> }) => (
            <TransactionInfo row={row} assetId={assetId} type="violation" />
          )}
          isLoading={isLoading}
          tableOptions={{
            onPaginationChange: setPagination,
            total: total ?? 0,
            manualPagination: true,
          }}
          state={{ pagination }}
        />
      </Box>
    </Box>
  )
}

export default TokenHistory
