import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_CALL_TIMEOUT } from '@/constants/api'

interface PermissionlessRetireParams {
  assetId: string
  metadata: object
  amount: number
  fee?: number
  beneficiary?: string
  address: string
}

interface PermissionlessRetireResponse {
  token: {
    org_uid: string
    warehouse_project_id: string
    vintage_year: number
    sequence_number: number
  }
  tx: {
    id: string
    record: object
  }
}
interface KeysResponse {
  hex: string
  bech32m: string
}

export const climateTokenDriverApi = createApi({
  reducerPath: 'climateTokenDriverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_CLIMATE_TOKEN_DRIVER_URL,
    timeout: API_CALL_TIMEOUT,
  }),
  endpoints: (builder) => ({
    permissionlessRetire: builder.mutation<string, PermissionlessRetireParams>({
      query: ({ assetId, metadata, fee, amount, beneficiary, address }) => ({
        url: `tokens/${assetId}/permissionless-retire`,
        method: 'PUT',
        body: {
          token: metadata,
          payment: {
            amount,
            fee: fee || 0,
            beneficiary_name: beneficiary || '',
            beneficiary_address: address,
          },
        },
      }),
      transformResponse: (response: PermissionlessRetireResponse) =>
        response.tx.id,
    }),
    keys: builder.query<KeysResponse, { prefix?: string }>({
      query: ({ prefix }) => ({
        url: `keys/`,
        method: 'GET',
        params: {
          derivation_index: 0,
          prefix: prefix || 'bls1238',
        },
      }),
    }),
    parseKeys: builder.query<KeysResponse, string>({
      query: (address) => ({
        url: `keys/parse`,
        method: 'GET',
        params: {
          address,
        },
      }),
    }),
  }),
})

export const {
  usePermissionlessRetireMutation,
  useKeysQuery,
  useParseKeysQuery,
} = climateTokenDriverApi
