import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_CALL_TIMEOUT } from '@/constants/api'
import { getConfig } from '@/utils/yamlConfigLoader'

export const dataLayerEndPoint = getConfig().dataLayerEndPoint

export const dataLayerApi = createApi({
  reducerPath: 'dataLayerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: dataLayerEndPoint,
    timeout: API_CALL_TIMEOUT,
    prepareHeaders: (headers) => {
      const accessToken = getConfig().cadtApiKey
      if (accessToken) {
        headers.set('authorization', `Bearer ${accessToken}`)
      }
      return headers
    },
  }),
  tagTypes: ['KYC', 'Rule', 'STAGING'],
  endpoints: () => ({}),
})
