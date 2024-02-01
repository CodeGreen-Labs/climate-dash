import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_CALL_TIMEOUT } from '@/constants/api'

export const dataLayerEndPoint = import.meta.env.VITE_DATA_LAYER_END_POINT

export const dataLayerApi = createApi({
  reducerPath: 'dataLayerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: dataLayerEndPoint,
    timeout: API_CALL_TIMEOUT,
    prepareHeaders: (headers) => {
      // TODO: wait for cadt to be implemented
      const accessToken = ''
      if (accessToken) {
        headers.set('authorization', `Bearer ${accessToken}`)
      }
      return headers
    },
  }),
  tagTypes: ['KYC', 'Rule', 'STAGING'],
  endpoints: () => ({}),
})
