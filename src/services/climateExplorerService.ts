import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_CALL_TIMEOUT } from '@/constants/api'
import type {
  ActivityRequest,
  ActivityResponse,
} from '@/types/climateExplorerTypes'

export const climateExplorerApi = createApi({
  reducerPath: 'climateExplorerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_CLIMATE_EXPLORER_CHIA_URL,
    timeout: API_CALL_TIMEOUT,
  }),
  endpoints: (builder) => ({
    getActivities: builder.query<ActivityResponse, ActivityRequest>({
      query: ({
        search,
        search_by,
        minHeight,
        sort = 'desc',
        page = 1,
        size = 10,
      }) => ({
        url: '/activities/',
        method: 'GET',
        params: { search, search_by, minHeight, sort, page, size },
      }),
    }),
  }),
})

export const { useGetActivitiesQuery } = climateExplorerApi
