import { TagDescription } from '@reduxjs/toolkit/dist/query/endpointDefinitions'

import { CommitParams, CommitTable } from '@/types/dataLayerTypes'
import { DataLayerQueryTabType } from '@/types/RTKQueryTypes'

import { dataLayerApi } from './dataLayerService'

export const tags: Record<
  CommitTable,
  TagDescription<DataLayerQueryTabType>[]
> = {
  [CommitTable.Wallet]: ['KYC'],
  [CommitTable.Rule]: ['Rule'],
}

export const commitApi = dataLayerApi.injectEndpoints({
  endpoints: (builder) => ({
    postCommit: builder.mutation<Response, CommitParams>({
      query: (params) => ({
        url: 'historys',
        method: 'POST',
        body: {
          ...params,
        },
      }),
      invalidatesTags: (result, error, arg) => tags[arg.table],
    }),
  }),
})

export const { usePostCommitMutation } = commitApi
