import { CircularProgress, Typography } from '@mui/material'

import { useGetProjectByIdQuery } from '@/services'
import { Project } from '@/types/climateWarehouseTypes'

interface Props {
  warehouseProjectId: string
  paramsKey: keyof Omit<Project, 'projectLocations' | 'issuances'>
}

const ProjectInfoDisplay = ({ warehouseProjectId, paramsKey }: Props) => {
  const { data, isLoading } = useGetProjectByIdQuery(warehouseProjectId || '', {
    skip: !warehouseProjectId,
  })

  if (isLoading) {
    return <CircularProgress size={20} color="primary" />
  }

  return <Typography variant="body2">{data?.[paramsKey]}</Typography>
}

export default ProjectInfoDisplay
