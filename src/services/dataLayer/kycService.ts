import {
  CreateOrUpdateByList,
  CreateOrUpdateByListRes,
  DataWithCount,
  KycCredential,
  KycLevel,
  ResponseWithData,
} from '@/types/dataLayerTypes'
import { CreateKycCredential, UpdateKycCredential } from '@/types/kycApiTypes'
import type { KycCredentialList, KycCredentialListItem } from '@/types/kycTypes'
import { extractStagingData } from '@/utils/dataLayler'
import { addKycStatusToCredentials } from '@/utils/tableData'

import { dataLayerApi } from './dataLayerService'

export const kycApi = dataLayerApi.injectEndpoints({
  endpoints: (builder) => ({
    getKycRule: builder.query<any, any>({
      query: () => ({
        url: 'Kyc',
        method: 'GET',
      }),
    }),
    getKycLevelList: builder.query<KycLevel[], void>({
      query: () => ({
        url: 'credential-levels',
        method: 'GET',
      }),
    }),
    getCredentialByAddress: builder.query<KycCredentialListItem, string>({
      query: (address) => ({
        url: `credentials/${address}`,
        method: 'GET',
      }),
      providesTags: (result) => [
        { type: 'KYC', id: result?.walletUser?.public_key },
      ],
      transformResponse: (res: ResponseWithData<KycCredential>) => {
        const data = res.data ? extractStagingData([res.data]) : null

        const result = data
          ? addKycStatusToCredentials(data as unknown as KycCredentialList)
          : []
        return result[0]
      },
    }),
    getCredentialList: builder.query<DataWithCount<KycCredentialList>, string>({
      query: (queryString) => ({
        url: `credentials${queryString}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map(({ walletUser }) => ({
                type: 'KYC' as const,
                id: walletUser?.public_key,
              })),
              { type: 'KYC', id: 'List' },
            ]
          : [{ type: 'KYC', id: 'List' }],
      transformResponse: (
        res: ResponseWithData<DataWithCount<KycCredentialList>>
      ) => {
        const rows = res.data.rows ? extractStagingData(res.data.rows) : []

        const result = addKycStatusToCredentials(rows as KycCredentialList)
        return {
          ...res.data,
          rows: result,
        }
      },
    }),
    createCredential: builder.mutation<
      ResponseWithData<CreateKycCredential>,
      CreateKycCredential
    >({
      query: (data) => ({
        url: `credentials`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'KYC', id: 'List' }, { type: 'STAGING' }],
    }),
    updateCredential: builder.mutation<
      ResponseWithData<UpdateKycCredential>,
      UpdateKycCredential
    >({
      query: (data) => ({
        url: `credentials`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: () => ['KYC', 'STAGING'],
    }),
    deleteCredential: builder.mutation<{ code: number; msg: string }, string>({
      query: (address) => ({
        url: `wallets/${address}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'KYC', id: 'List' }],
    }),
    createCredentialByList: builder.mutation<
      CreateOrUpdateByListRes,
      CreateOrUpdateByList<KycCredential>
    >({
      query: (data) => ({
        url: `wallets`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'KYC', id: 'List' }],
    }),
    updateCredentialByList: builder.mutation<
      CreateOrUpdateByListRes,
      CreateOrUpdateByList<KycCredential>
    >({
      query: (data) => ({
        url: `wallets`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'KYC', id: 'List' }],
    }),
  }),
})

export const {
  useGetKycRuleQuery,
  useGetKycLevelListQuery,
  useGetCredentialByAddressQuery,
  useGetCredentialListQuery,
  useCreateCredentialMutation,
  useUpdateCredentialMutation,
  useDeleteCredentialMutation,
  useCreateCredentialByListMutation,
  useUpdateCredentialByListMutation,
} = kycApi
