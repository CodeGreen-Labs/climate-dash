import { CircularProgress, Typography } from '@mui/material'

import { useGetUnitByIdQuery } from '@/services'
import { Unit } from '@/types/climateWarehouseTypes'
interface Props {
  warehouseUnitId: string
  paramKey: keyof Omit<Unit, 'labels' | 'issuance'>
}

const ProjectName = ({ warehouseUnitId, paramKey }: Props) => {
  const { data, isLoading } = useGetUnitByIdQuery(warehouseUnitId || '', {
    skip: !warehouseUnitId,
  })

  if (isLoading) {
    return <CircularProgress size={20} color="primary" />
  }

  return <Typography variant="body2">{data?.[paramKey]}</Typography>
}

export default ProjectName
