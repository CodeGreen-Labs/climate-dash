import { useMemo } from 'react'

import { DashboardHeader } from '@/components/Dashboard'
import theme from '@/constants/themeConfig'
import { useGetDashboardDataQuery } from '@/services'
import { DashboardHeaderData } from '@/types/dashboardTypes'
const KycDashboard = () => {
  const { data: dashboardData } = useGetDashboardDataQuery()
  const data = useMemo(
    (): DashboardHeaderData[] => [
      {
        accessorKey: 'total_cases',
        name: 'dashboard.kyc.total',
        tooltip: 'dashboard.kyc.tooltip.total',
        value: dashboardData?.wallet?.total_cases || 0,
      },
      // disabled for now as we don't have the data
      // {
      //   accessorKey: 'weekly_new_cases',
      //   name: 'dashboard.kyc.weekly-updates',
      //   tooltip: 'dashboard.kyc.tooltip.weekly-updates',
      //   value: dashboardData?.wallet?.weekly_updates || 0,
      // },
      {
        accessorKey: 'pending_cases',
        name: 'dashboard.kyc.pending',
        tooltip: 'dashboard.kyc.tooltip.pending',
        value: dashboardData?.wallet?.pending_cases || 0,
        color: theme.palette.info.main,
      },
      {
        accessorKey: 'expired_cases',
        name: 'dashboard.kyc.expired',
        tooltip: 'dashboard.kyc.tooltip.expired',
        value: dashboardData?.wallet?.expired_cases || 0,
        color: theme.palette.error.dark,
      },
    ],
    [dashboardData]
  )
  return <DashboardHeader data={data} />
}

export default KycDashboard
