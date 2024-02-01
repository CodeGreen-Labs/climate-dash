import {
  CommitParams,
  GetStagingResponse,
  Response,
} from '@/types/dataLayerTypes'

import { dataLayerApi } from './dataLayerService'

export const stagingApi = dataLayerApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaging: builder.query<GetStagingResponse[], string>({
      query: (table) => ({
        url: table.length > 0 ? `staging?table=${table}` : `staging`,
        method: 'GET',
      }),
      providesTags: ['STAGING', 'KYC', 'Rule'],
    }),
    postCommit: builder.mutation<Response, CommitParams>({
      query: ({ table, ...body }) => ({
        url: `staging/commit?table=${table}`,
        method: 'POST',
        data: body,
      }),
      invalidatesTags: () => ['STAGING', 'KYC', 'Rule'],
    }),
  }),
})

export const { usePostCommitMutation, useGetStagingQuery } = stagingApi
