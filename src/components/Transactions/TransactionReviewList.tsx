import { Box, Divider, Stack, Typography } from '@mui/material'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectInfo } from '@/components/Info'
import type { TransactionInfosListType } from '@/types/TransactionType'
interface Props {
  projectName?: string
  unitVintageYear?: number
  currentRegistry?: string
  infos: TransactionInfosListType
}

const TransactionReviewList = ({
  projectName,
  unitVintageYear,
  currentRegistry,
  infos,
}: Props) => {
  const { t } = useTranslation()

  const projectInfo = [
    {
      title: 'rule:data.project-name',
      field: projectName,
    },
    {
      title: 'rule:data.unit-vintage-year',
      field: unitVintageYear,
    },
    {
      title: 'rule:data.current-registry',
      field: currentRegistry,
    },
  ]

  const allInfos = [
    { title: 'wallet:asset-information', list: projectInfo },
    ...infos,
  ]

  return (
    <Box sx={{ mt: 1, mb: 3 }}>
      {allInfos.map((item, index) => (
        <Fragment key={index}>
          <Stack
            sx={{
              py: '12px',
            }}
            spacing={2}
            direction="row"
          >
            <Typography
              color="textSecondary"
              sx={{ width: 250, fontWeight: 500 }}
            >
              {t(item.title)}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <ProjectInfo column={item.list} />
            </Box>
          </Stack>
          {index !== allInfos.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
        </Fragment>
      ))}
    </Box>
  )
}

export default TransactionReviewList
