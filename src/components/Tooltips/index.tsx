import { HelpOutline } from '@mui/icons-material'
import { Box, Stack, SxProps, Tooltip, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { LightTooltip } from './styles'

interface Props {
  title: string | ReactNode
  translated?: boolean
  type?: 'light' | 'dark'
  contents?: string
  children?: ReactNode
  sx?: SxProps
}

const Tooltips = ({
  children,
  title,
  translated = false,
  type = 'dark',
  contents,
  sx,
}: Props) => {
  const { t } = useTranslation()
  return (
    <Stack alignItems="center" direction="row" sx={{ ...sx, flexGrow: 1 }}>
      {children}
      {title &&
        (type === 'light' ? (
          <LightTooltip
            title={
              <Box display="flex" flexDirection="column" gap="16px">
                <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                  {translated ? title : t(title as string)}
                </Typography>
                {contents && (
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                  >
                    {contents}
                  </Typography>
                )}
              </Box>
            }
          >
            <HelpOutline
              sx={{
                color: '#646464',
                cursor: 'pointer',
                marginLeft: '1px',
                fontSize: '18px',
              }}
            />
          </LightTooltip>
        ) : (
          <Tooltip title={translated ? title : t(title as string)}>
            <HelpOutline
              sx={{
                color: '#646464',
                cursor: 'pointer',
                marginLeft: '1px',
                fontSize: '18px',
              }}
            />
          </Tooltip>
        ))}
    </Stack>
  )
}

export default Tooltips
