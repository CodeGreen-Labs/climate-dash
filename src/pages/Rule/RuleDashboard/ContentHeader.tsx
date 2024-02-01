import { Divider, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ExportButton } from '@/components/Button'
import { makeHeaders } from '@/utils/exportData'

interface Props {
  total: number
  exportData?: any[]
  exportColumns: any[]
  exportFileName: string
}

const ContentHeader = ({
  total,
  exportData,
  exportColumns,
  exportFileName,
}: Props) => {
  const { t } = useTranslation()
  return (
    <>
      <Grid
        container
        spacing={1}
        flexDirection="row"
        justifyContent="space-between"
        width="100%"
        p={3}
      >
        <Grid>
          <Typography variant="h6" fontWeight={800}>
            {t('wallet:history.violation-incidents')}
          </Typography>
          <Typography variant="body2" color="grey">
            {t('total-is', { total })}
          </Typography>
        </Grid>
        <Grid>
          <ExportButton
            data={exportData || []}
            headers={makeHeaders(exportColumns)}
            filename={`${exportFileName}`}
          />
        </Grid>
      </Grid>
      <Divider />
    </>
  )
}

export default ContentHeader
