import { useGetProjectByIdQuery, useGetUnitByIdQuery } from '@/services'

import { IClimateToken } from './chia/useClimateTokens'

const useClimateWarehouseData = ({ unitId, projectId }: IClimateToken) => {
  const { data: projectData, isLoading: isProjectLoading } =
    useGetProjectByIdQuery(projectId)
  const { data: unitData, isLoading: isUnitLoading } =
    useGetUnitByIdQuery(unitId)
  return {
    projectData,
    unitData,
    isProjectLoading,
    isUnitLoading,
    isLoading: isProjectLoading || isUnitLoading,
  }
}

export default useClimateWarehouseData
