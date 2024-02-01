import { Box, Link, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  column: { title: string; field: any; link?: boolean }[]
}

const ProjectInfo = ({ column }: Props) => {
  const { t } = useTranslation()
  return (
    <Box>
      {column.map((item, index) => (
        <Stack
          direction="row"
          sx={{
            p: 2,
            background: (theme) =>
              index % 2 === 1
                ? theme.palette.grey[100]
                : theme.palette.common.white,
          }}
          key={index}
        >
          <Typography
            sx={{ color: (theme) => theme.palette.grey[600], width: 200 }}
          >
            {t(item.title)}
          </Typography>

          {item.link ? (
            <Link
              href={item.field}
              sx={{ flex: 1, wordBreak: 'break-all' }}
              target="_blank"
              color="inherit"
            >
              {item.field ?? '-'}
            </Link>
          ) : (
            <Typography sx={{ flex: 1, wordBreak: 'break-all' }}>
              {item.field ?? '-'}
            </Typography>
          )}
        </Stack>
      ))}
    </Box>
  )
}

export default ProjectInfo
