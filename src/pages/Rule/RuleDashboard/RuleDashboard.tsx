import { Box, Stack } from '@mui/material'
import { useMemo } from 'react'

import { DashboardHeader } from '@/components/Dashboard'
import theme from '@/constants/themeConfig'
import { useGetDashboardDataQuery } from '@/services'
import { DashboardHeaderData } from '@/types/dashboardTypes'

// type TabType =
//   | 'wallet:history.type-is.transaction'
//   | 'wallet:history.type-is.retirement'

const RuleDashboard = () => {
  const { data: dashboardData } = useGetDashboardDataQuery()

  // const [curTab, setCurTab] = useState<TabType>(
  //   'wallet:history.type-is.transaction'
  // )

  const data = useMemo(
    (): DashboardHeaderData[] => [
      {
        accessorKey: 'total_rules',
        name: 'dashboard.rule.total',
        tooltip: 'dashboard.rule.tooltip.total',
        value: dashboardData?.rule_management?.total_cases || 0,
      },
      // {
      //   accessorKey: 'weekly_new_Rules',
      //   name: 'dashboard.rule.weekly-updates',
      //   tooltip: 'dashboard.rule.tooltip.weekly-updates',
      //   value: dashboardData?.rule_management?.weekly_updates || 0,
      // },
      {
        accessorKey: 'pending_Rules',
        name: 'dashboard.rule.pending',
        tooltip: 'dashboard.rule.tooltip.pending',
        value: dashboardData?.rule_management?.pending_cases || 0,
        color: theme.palette.info.main,
      },
      // {
      //   accessorKey: 'violating_Rules',
      //   name: 'dashboard.rule.violating',
      //   value: 10,
      //   color: '#D32F2F',
      // },
    ],
    [dashboardData]
  )
  // const transactionColumns = useMemo<
  //   CrudColumn<TransactionListItem, keyof TransactionListItem>[]
  // >(
  //   () => [
  //     {
  //       accessorKey: 'type',
  //       header: 'wallet:history.type',
  //       cell: () => t('wallet:history.type-is.transaction'),
  //     },
  //     {
  //       accessorKey: 'status',
  //       header: 'wallet:history.status',
  //       tooltip: t('wallet:history.status'),
  //       cell: () => (
  //         <Chip
  //           variant="filled"
  //           color="error"
  //           label={t('wallet:history.violation-status.violating')}
  //         />
  //       ),
  //     },
  //     {
  //       accessorKey: 'transaction_id',
  //       header: 'wallet:history.transaction-id',
  //     },
  //     {
  //       accessorKey: 'project_name',
  //       header: 'rule:data.project-name',
  //     },
  //     {
  //       accessorKey: 'project_name',
  //       header: 'rule:data.project-id',
  //     },
  //     {
  //       accessorKey: 'cat_id',
  //       header: 'rule:data.cat-id',
  //     },
  //     {
  //       accessorKey: 'quantity',
  //       header: 'wallet:history.quantity',
  //       cell: (info) => info.row.original.quantity + ' ' + 'tCo2e',
  //     },
  //     {
  //       type: 'date',
  //       accessorKey: 'last_modified_time',
  //       header: 'common:last-updated-time',
  //       cell: (info) => {
  //         return formatTime(info.row.original.last_modified_time)
  //       },
  //     },
  //   ],
  //   []
  // )
  // fake data for testing base on columns accessorKey
  // const transactionData = [
  //   {
  //     type: 'transaction',
  //     status: 'violation',
  //     transaction_id: '0x1234567890',
  //     project_name: 'test',
  //     project_id: 'abc123',
  //     cat_id: 'cat123',
  //     last_modified_time: '2021-10-10',
  //     quantity: 10,
  //   },

  //   {
  //     type: 'transaction',
  //     status: 'violation',
  //     transaction_id: '0x1234567891',
  //     project_name: 'test1',
  //     project_id: 'abc456',
  //     cat_id: 'cat456',
  //     last_modified_time: '2023-01-11',
  //     quantity: 20,
  //   },
  // ]
  // const retirementColumns = useMemo<
  //   CrudColumn<TransactionListItem, keyof TransactionListItem>[]
  // >(
  //   () => [
  //     {
  //       accessorKey: 'type',
  //       header: 'wallet:history.type',
  //       cell: () => t('wallet:history.type-is.retirement'),
  //     },
  //     {
  //       accessorKey: 'status',
  //       header: 'wallet:history.status',
  //       tooltip: t('wallet:history.status'),
  //       cell: () => (
  //         <Chip
  //           variant="filled"
  //           color="error"
  //           label={t('wallet:history.violation-status.violating')}
  //         />
  //       ),
  //     },
  //     {
  //       accessorKey: 'transaction_id',
  //       header: 'wallet:history.transaction-id',
  //     },
  //     {
  //       accessorKey: 'project_name',
  //       header: 'rule:data.project-name',
  //     },
  //     {
  //       accessorKey: 'project_name',
  //       header: 'rule:data.project-id',
  //     },
  //     {
  //       accessorKey: 'cat_id',
  //       header: 'rule:data.cat-id',
  //     },
  //     {
  //       accessorKey: 'quantity',
  //       header: 'wallet:history.quantity',
  //       cell: (info) => info.row.original.quantity + ' ' + 'tCo2e',
  //     },
  //     {
  //       type: 'date',
  //       accessorKey: 'last_modified_time',
  //       header: 'common:last-updated-time',
  //       cell: (info) => {
  //         return formatTime(info.row.original.last_modified_time)
  //       },
  //     },
  //   ],
  //   []
  // )
  // // fake data for testing base on columns accessorKey
  // const retirementData = [
  //   {
  //     type: 'retirement',
  //     status: 'violation',
  //     transaction_id: '0x1234567890',
  //     project_name: 'test2',
  //     project_id: 'abc789',
  //     cat_id: 'cat123',
  //     last_modified_time: '2021-10-10',
  //     quantity: 50,
  //   },
  // ]
  // comment out until data ready
  // const tabData = useMemo<TabInfo[]>(
  //   () => [
  //     {
  //       label: 'wallet:history.type-is.transaction',
  //       value: 'wallet:history.type-is.transaction',
  //       header: (
  //         <ContentHeader
  //           total={3}
  //           exportColumns={transactionColumns}
  //           exportFileName={'Violation-Incidents-Transaction'}
  //           exportData={transactionData}
  //         />
  //       ),
  //       children: (
  //         <Content
  //           countTitle="wallet:history.transaction-count"
  //           count={2}
  //           data={transactionData}
  //           columns={transactionColumns}
  //         />
  //       ),
  //     },
  //     {
  //       label: 'wallet:history.type-is.retirement',
  //       value: 'wallet:history.type-is.retirement',
  //       header: (
  //         <ContentHeader
  //           total={1}
  //           exportColumns={retirementColumns}
  //           exportFileName={'Violation-Incidents-Retirement'}
  //           exportData={retirementData}
  //         />
  //       ),
  //       children: (
  //         <Content
  //           countTitle="wallet.retirement.count"
  //           count={1}
  //           data={retirementData}
  //           columns={retirementColumns}
  //         />
  //       ),
  //     },
  //   ],
  //   []
  // )
  return (
    <Stack height="100%">
      <Box>
        <DashboardHeader data={data} />
      </Box>
      {/* hidden until data ready */}
      {/* <Box height="100%" component={Paper} overflow="auto">
        <TabForm curTab={curTab} setCurTab={setCurTab} tabs={tabData} />
      </Box> */}
    </Stack>
  )
}

export default RuleDashboard
