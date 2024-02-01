import { useMemo } from 'react'

import {
  useGetProjectByIdQuery,
  useGetRuleByTokenIdQuery,
  useGetUnitByIdQuery,
} from '@/services'

interface Props {
  assetId?: string
}

const useGetIssuanceInfoByAssetId = ({ assetId }: Props) => {
  const skipQuery = !assetId

  const { data: ruleData, isLoading: isRuleDataLoading } =
    useGetRuleByTokenIdQuery(assetId || '', { skip: skipQuery })

  const unitId = ruleData?.warehouse_unit_id || ''
  const projectId = ruleData?.warehouse_project_id || ''

  const { data: unit, isLoading: isUnitLoading } = useGetUnitByIdQuery(unitId, {
    skip: !unitId,
  })
  const { data: projectInfo, isLoading: isProjectInfoLoading } =
    useGetProjectByIdQuery(projectId, { skip: !projectId })

  const isLoading = isRuleDataLoading || isUnitLoading || isProjectInfoLoading

  const issuanceInfo = useMemo<any>(() => {
    if (projectInfo) {
      return {
        rule: ruleData,
        issuance: projectInfo.issuances.find(
          (i) => i.id === ruleData?.issuance_id
        ),
        unit,
        project: projectInfo,
      }
    }
    return {}
  }, [projectInfo, unit, ruleData])

  return { issuanceInfo, isLoading }
}

export default useGetIssuanceInfoByAssetId
