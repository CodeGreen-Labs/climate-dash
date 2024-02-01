import { DashboardData } from '@/types/dataLayerTypes'

import { dataLayerApi } from './dataLayerService'

export const reportApi = dataLayerApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => ({
        url: 'reports/current',
        method: 'GET',
      }),
      providesTags: ['KYC', 'Rule'],
    }),
  }),
})

export const { useGetDashboardDataQuery } = reportApi
