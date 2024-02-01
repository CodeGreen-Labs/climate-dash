import { Grid, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import theme from '@/constants/themeConfig'
import type { DashboardHeaderData } from '@/types/dashboardTypes'

import Tooltips from '../Tooltips'

interface Props {
  data: DashboardHeaderData[]
}

const DashboardHeader = ({ data }: Props) => {
  const { t } = useTranslation()

  return (
    <Grid container direction="column">
      <Grid>
        <Typography variant="h5" mb={3}>
          {t('nav.dashboard')}
        </Typography>
      </Grid>
      <Grid>
        <Grid container direction="row" gap={2}>
          {data.map(({ name, value, color, tooltip }, i) => (
            <Grid key={i} item xs={3}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 0,
                }}
              >
                <Tooltips
                  title={t(name)}
                  type="light"
                  contents={t(tooltip || '')}
                  sx={{
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color={color || theme.palette.text.primary}
                  >
                    {t(name)}
                  </Typography>
                </Tooltips>
                <Typography
                  variant="h5"
                  color={color || theme.palette.text.primary}
                  mt={2}
                >
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DashboardHeader
