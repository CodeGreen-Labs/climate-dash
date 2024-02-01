import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { PaginationState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CopyBtn } from '@/components/Button'
import Search from '@/components/Search'
import Table from '@/components/Table'
import { ViolationExplorer } from '@/components/Violation'
import { useGetActivitiesQuery } from '@/services'
import { Activity } from '@/types/climateExplorerTypes'
import { CrudColumn } from '@/types/crudTableTypes'
import { removePrefix0x, shortenHash } from '@/utils/chia'
import { mojoToDisplayBalance } from '@/utils/CoinConverter'
import { formatTime } from '@/utils/datetime'

const ExplorerList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [searchString, setSearchString] = useState<string | undefined>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: activities, isLoading } = useGetActivitiesQuery({
    sort: 'desc',
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    search: searchString,
    search_by: searchString ? 'climate_warehouse' : undefined,
  })

  const columns = useMemo<CrudColumn<Activity, string>[]>(
    () => [
      {
        header: 'rule:data.project-name',
        accessorKey: 'projectName',
        cell: ({ row }) => (
          <Typography
            variant="body2"
            sx={{ width: 300, wordBreak: 'break-all', whiteSpace: 'normal' }}
          >
            {row.original.cw_project.projectName}
          </Typography>
        ),
      },
      {
        header: 'rule:data.unit-vintage-year',
        accessorKey: 'vintageYear',
        cell: ({ row }) => row.original.cw_unit.vintageYear,
      },
      {
        header: 'wallet:history.type',
        accessorKey: 'Type',
        cell: ({ row }) => t(`explorer:type.${row.original.mode}`),
      },
      {
        header: 'amount',
        accessorKey: 'amount',
        cell: ({ row }) =>
          mojoToDisplayBalance(
            row.original.amount,
            row.original.token.asset_id
          ),
      },
      {
        header: 'beneficiary',
        accessorKey: 'beneficiary_address',
        cell: ({ row }) => {
          if (!row.original.beneficiary_puzzle_hash) return '-'

          return (
            <Stack direction="column" justifyContent="center">
              <Stack direction="row" alignItems="center">
                <Typography variant="body2">
                  {shortenHash(row.original.beneficiary_puzzle_hash)}
                </Typography>
                <ViolationExplorer
                  publicKey={row.original.beneficiary_puzzle_hash}
                  assetId={removePrefix0x(row.original.token.asset_id)}
                />
                <CopyBtn
                  name="explorer:beneficiary-address"
                  value={row.original.beneficiary_puzzle_hash}
                  sx={{ ml: 1 }}
                  small
                />
              </Stack>
            </Stack>
          )
        },
      },
      {
        header: 'wallet:history.time',
        accessorKey: 'projectId',
        cell: ({ row }) => formatTime(row.original.timestamp * 1000),
      },
      {
        header: 'rule:data.current-registry',
        accessorKey: 'currentRegistry',
        cell: ({ row }) => row.original.cw_project.currentRegistry,
      },

      {
        header: 'rule:data.unit-vintage-year',
        accessorKey: 'vintageYear',
        cell: ({ row }) => row.original.cw_unit.vintageYear,
      },
      {
        accessorKey: 'cat_id',
        header: 'rule:data.cat-id',
        cell: ({ row }) =>
          shortenHash(removePrefix0x(row.original.token.asset_id)),
      },

      {
        header: 'actions',
        accessorKey: 'action',
        cell: ({ row }) => (
          <Grid container>
            <Button
              onClick={() => {
                navigate(
                  '/explorer/details/' +
                    row.original.cw_unit.marketplaceIdentifier,
                  {
                    state: {
                      warehouseUnitId:
                        row.original.cw_unit.marketplaceIdentifier,
                    },
                  }
                )
              }}
            >
              {t('common:action.view')}
            </Button>
          </Grid>
        ),
      },
    ],
    []
  )
  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `url(./explorer-banner.svg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          height: '108px',
          padding: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Search
          onSearch={(searchField: string) => setSearchString(searchField)}
          onClear={() => setSearchString(undefined)}
          placeHolder={'explorer:search'}
          sx={{ backgroundColor: 'white' }}
          buttonProps={{ variant: 'contained' }}
          buttonSx={{
            '&:disabled': { background: '#E0E0E0', color: 'rgb(0,0,0,0.38)' },
          }}
        />
      </Box>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Paper sx={{ borderRadius: '4px' }}>
          <Table
            data={activities?.activities || []}
            columns={columns}
            isLoading={isLoading}
            lastColumnFixed
            tableOptions={{
              onPaginationChange: setPagination,
              total: activities?.total ?? 0,
              manualPagination: true,
            }}
            state={{ pagination }}
          />
        </Paper>
      </Box>
    </Box>
  )
}

export default ExplorerList
