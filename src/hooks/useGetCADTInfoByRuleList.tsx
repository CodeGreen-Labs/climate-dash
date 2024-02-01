import { useEffect, useState } from 'react'

import { climateWarehouseApi, useGetRuleListQuery } from '@/services'
import store from '@/store'
import { Rule } from '@/types/dataLayerTypes'
import { RuleListWithCADTInfo } from '@/types/ruleTypes'

type Props = {
  queryString: string
}

const useGetCADTInfoByRuleList = ({ queryString }: Props) => {
  const [data, setData] = useState<RuleListWithCADTInfo[]>([])
  const [loading, setLoading] = useState(true)
  const {
    data: queriedRuleList,
    refetch,
    isLoading,
  } = useGetRuleListQuery(queryString)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (!queriedRuleList) {
        setLoading(false)
        return []
      }
      const promises = queriedRuleList.rows?.map(async (rule: Rule) => {
        const { warehouse_unit_id, warehouse_project_id } = rule
        const unitInfo = await climateWarehouseApi.endpoints.getUnitById
          .initiate(warehouse_unit_id)(store.dispatch, store.getState, {})
          .unwrap()

        const projectInfo = await climateWarehouseApi.endpoints.getProjectById
          .initiate(warehouse_project_id)(store.dispatch, store.getState, {})
          .unwrap()

        return {
          ...rule,
          unit: unitInfo,
          project: projectInfo,
        }
      })

      const resolvedData = await Promise.all(promises)
      setData(resolvedData)
      setLoading(false)
    }

    fetchData()
  }, [queriedRuleList])

  return { data, isLoading: loading || isLoading, refetch }
}

export default useGetCADTInfoByRuleList
