import { ArrowDownwardOutlined } from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  Grid,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import {
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  TableOptions,
  TableState,
  useReactTable,
} from '@tanstack/react-table'
import React, { ComponentType, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import Tooltips from '@/components/Tooltips'
import theme from '@/constants/themeConfig'
import { ColumnDef } from '@/types/crudTableTypes'
import { capitalize } from '@/utils/textFormatter'

import TablePaginationActions from './TablePaginationActions'

const defaultColumn = {
  enableSorting: false,
}

const lastColumnStyle: SxProps = {
  position: 'sticky',
  right: 0,

  backgroundColor: 'white',
  boxShadow: `inset 4px 0px 0px 0px ${theme.palette.divider} `,
}

const tableRowStyles: SxProps = {
  p: 0,
  '&:hover': {
    backgroundColor: theme.palette.table?.row?.hover,
    transition: 'background-color 0.3s ease',
  },
}

export interface ILocalTable {
  data: any[]
  columns: ColumnDef<any, any>[]
  tableOptions?: Omit<
    TableOptions<any>,
    'data' | 'columns' | 'getCoreRowModel'
  > & { total: number }
  state?: Pick<TableState, 'pagination'>
  isLoading?: boolean
  emptyTitle?: string
  emptyText?: string
  lastColumnFixed?: boolean
  ExpendComponent?: ComponentType<{ row: Row<any> }>
  containerSx?: SxProps
  tableSx?: SxProps
  withPagination?: boolean
  cellSx?: SxProps
  headerCellSx?: SxProps
  zebraRows?: boolean
  defaultSorting?: ColumnSort
  handleSorting?: (state: ColumnSort) => void
}

export default function LocalTable({
  data,
  columns,
  tableOptions,
  isLoading,
  emptyTitle = 'empty',
  lastColumnFixed = false,
  ExpendComponent,
  state,
  containerSx,
  tableSx,
  withPagination = true,
  cellSx = {},
  headerCellSx = {},
  zebraRows = false,
  defaultSorting,
  handleSorting,
}: ILocalTable) {
  const tableCellStyles: SxProps = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...cellSx,
  }
  const headerCellStyles: SxProps = {
    whiteSpace: 'nowrap',
    ...headerCellSx,
  }
  const [sorting, setSorting] = React.useState<ColumnSort | any>(
    defaultSorting || {}
  )

  // alert(JSON.stringify(defaultSorting[0]))
  const { t } = useTranslation('common')

  const table = useReactTable({
    data,
    columns: columns.map((column) => ({
      ...defaultColumn,
      ...column,

      header: () => {
        const header = capitalize(t(column.header as string))
        return (
          <Tooltips title={column?.tooltip}>
            <>{header}</>
          </Tooltips>
        )
      },
    })) as ColumnDef<any, any>[],
    state: {
      ...(state ?? {}),
    },
    // Pipeline

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...tableOptions,
    // status
    debugTable: true,
  })

  const { pageSize, pageIndex } = table.getState().pagination

  return (
    <>
      <TableContainer
        sx={{
          width: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          ...containerSx,
        }}
      >
        <Box
          sx={{
            width: '100%',
            overflow: 'auto',
            position: 'relative',
            ...tableSx,
          }}
        >
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, columnIndex, headers) => {
                    const isLastColumn = columnIndex === headers.length - 1
                    const tableCellProps =
                      isLastColumn && lastColumnFixed
                        ? {
                            sx: lastColumnStyle,
                          }
                        : {}
                    const column = header.column.columnDef as ColumnDef<
                      any,
                      any
                    >
                    return (
                      <TableCell
                        key={header.id}
                        id={`header-${header.id}`}
                        colSpan={header.colSpan}
                        sx={headerCellStyles}
                        {...tableCellProps}
                      >
                        {header.isPlaceholder ? null : (
                          <Grid
                            {...{
                              sx: header.column.getCanSort()
                                ? {
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                  }
                                : null,
                              onClick: () => {
                                const id = column?.accessorKey

                                const desc =
                                  sorting.id === id ? !sorting.desc : true
                                // only one sort is allowed
                                const newSorting = {
                                  id,
                                  desc,
                                }
                                if (handleSorting) handleSorting(newSorting)
                                else header.column.getToggleSortingHandler()
                                setSorting(() => newSorting)
                              },
                            }}
                          >
                            {flexRender(column.header, header.getContext())}

                            {header.column.getCanSort() && (
                              <ArrowDownwardOutlined
                                sx={{
                                  height: 16,
                                  alignSelf: 'center',
                                  opacity:
                                    column.accessorKey === sorting?.id
                                      ? 1
                                      : 0.3,
                                  transform:
                                    column?.accessorKey === sorting?.id
                                      ? sorting?.desc
                                        ? 'rotate(0)'
                                        : 'rotate(-180deg)'
                                      : 'rotate(0)',
                                  transition: 'all 0.5s ease',
                                }} // Correct way to apply rotation
                              />
                            )}
                          </Grid>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row, rowIndex) => {
                const cells = row.getVisibleCells()
                return (
                  <Fragment key={row.id}>
                    <TableRow sx={tableRowStyles}>
                      {cells.map((cell, index) => {
                        const isLastCell = index === cells.length - 1
                        const tableCellProps =
                          isLastCell && lastColumnFixed
                            ? {
                                sx: lastColumnStyle,
                              }
                            : {}
                        const zebraStyles: SxProps = zebraRows
                          ? {
                              backgroundColor:
                                rowIndex % 2 === 0
                                  ? theme.palette.table?.row?.even
                                  : theme.palette.table?.row?.odd,
                            }
                          : {}
                        return (
                          <TableCell
                            key={cell.id}
                            id={cell.id}
                            sx={{ ...zebraStyles, ...tableCellStyles }}
                            {...tableCellProps}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    {row.getIsExpanded() && ExpendComponent && (
                      <TableRow>
                        <TableCell colSpan={cells.length} sx={{ p: 0 }}>
                          <ExpendComponent row={row} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
            </TableBody>
          </Table>
        </Box>

        {/* empty data */}
        {table.getRowModel().rows.length === 0 && (
          <Grid
            sx={{ padding: 4, width: '100%' }}
            justifyContent="center"
            alignItems="center"
            container
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Typography variant="h6">{t(emptyTitle)}</Typography>
            )}
          </Grid>
        )}
        {withPagination && (
          <TablePagination
            labelRowsPerPage={
              <Typography variant="caption" color="text.secondary">
                {t('pagination.rows-per-page')}
              </Typography>
            }
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${t('pagination.of')} ${count}`
            }
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={
              tableOptions?.manualPagination
                ? tableOptions.total
                : table.getFilteredRowModel().rows.length
            }
            rowsPerPage={pageSize}
            page={pageIndex}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
            onRowsPerPageChange={(e) => {
              const size = e.target.value ? Number(e.target.value) : 10
              table.setPageSize(size)
            }}
            ActionsComponent={TablePaginationActions}
          />
        )}
      </TableContainer>
    </>
  )
}
