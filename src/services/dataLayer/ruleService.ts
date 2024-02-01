import {
  DataWithCount,
  ResponseWithData,
  Rule,
  RuleList,
} from '@/types/dataLayerTypes'
import { CreateRule, UpdateRule } from '@/types/ruleApiTypes'
import { extractStagingData } from '@/utils/dataLayler'

import { dataLayerApi } from './dataLayerService'

export const ruleApi = dataLayerApi.injectEndpoints({
  endpoints: (builder) => ({
    getRuleByTokenId: builder.query<Rule | null, string>({
      query: (cat_id) => ({
        url: `rules/${cat_id}`,
        method: 'GET',
      }),
      providesTags: (result) => [{ type: 'Rule', id: result?.cat_id }],

      transformResponse: (res: ResponseWithData<Rule>) => {
        const data = res.data ? extractStagingData([res.data]) : null
        return data ? data[0] : null
      },
    }),
    getRuleList: builder.query<DataWithCount<RuleList>, string>({
      query: (queryString) => ({
        url: `rules${queryString}`,
        method: 'GET',
      }),
      providesTags: (result) => {
        return result?.rows
          ? [
              ...result.rows.map(({ cat_id }) => ({
                type: 'Rule' as const,
                id: cat_id,
              })),
              { type: 'Rule', id: 'List' },
            ]
          : [{ type: 'Rule', id: 'List' }]
      },
      transformResponse: (res: ResponseWithData<DataWithCount<RuleList>>) => {
        const rows = res.data.rows ? extractStagingData(res.data.rows) : []
        return {
          ...res.data,
          rows,
        }
      },
    }),
    addRule: builder.mutation<ResponseWithData<CreateRule>, CreateRule>({
      query: (data) => ({
        url: `rules`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Rule', id: 'List' }, { type: 'STAGING' }],
    }),
    updateRule: builder.mutation<ResponseWithData<UpdateRule>, UpdateRule>({
      query: (data) => ({
        url: `rules`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: () => ['STAGING', 'Rule'],
    }),
    deleteRule: builder.mutation<string, any>({
      query: (catId) => ({
        url: `rule`,
        method: 'DELETE',
        body: { cat_id: catId },
      }),
      invalidatesTags: [{ type: 'Rule', id: 'List' }],
    }),
  }),
})

export const {
  useGetRuleByTokenIdQuery,
  useGetRuleListQuery,
  useAddRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
} = ruleApi
