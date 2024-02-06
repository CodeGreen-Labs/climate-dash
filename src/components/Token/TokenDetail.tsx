import { Box } from '@mui/material'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { ProjectInfo } from '@/components/Info'
import type { Project, Unit } from '@/types/climateWarehouseTypes'

interface Props {
  projectData?: Project
  unitData?: Unit
}

const TokenDetail = ({ projectData, unitData }: Props) => {
  const { assetId } = useParams<{ assetId: string }>()

  const column = useMemo(
    () => [
      { title: 'rule:data.cat-id', field: assetId },
      { title: 'rule:data.unit-vintage-year', field: unitData?.vintageYear },
      { title: 'rule:data.project-id', field: projectData?.projectId },
      {
        title: 'rule:data.current-registry',
        field: projectData?.currentRegistry,
      },
      {
        title: 'rule:data.project-link',
        field: projectData?.projectLink,
        link: true,
      },
      {
        title: 'rule:data.project-developer',
        field: projectData?.projectDeveloper,
      },
      { title: 'rule:data.program', field: projectData?.program },
    ],
    [projectData, unitData]
  )

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        p: 2,
        border: (theme) => `1px solid ${theme.palette.grey[300]}`,
        borderRadius: '6px',
      }}
    >
      <ProjectInfo column={column} />
    </Box>
  )
}

export default TokenDetail
