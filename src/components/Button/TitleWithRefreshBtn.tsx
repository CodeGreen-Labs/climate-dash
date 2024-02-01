import { Button, Stack, SxProps, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
type Props = {
  title: string
  handleRefresh: () => void
  sx?: SxProps
}
const TitleWithRefreshBtn = ({ title, handleRefresh, sx }: Props) => {
  const { t } = useTranslation()
  return (
    <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2, ...sx }}>
      <Typography variant="h6">{t(title)}</Typography>

      <Button variant="text" size="small" onClick={handleRefresh}>
        {t('action.refresh')}
      </Button>
    </Stack>
  )
}

export default TitleWithRefreshBtn
