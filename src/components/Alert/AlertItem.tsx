import { Alert as MuiAlert, AlertColor, AlertTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  title?: string
  content: string
  count?: number
  severity?: AlertColor
  onClose?: () => void
}

const AlertItem = ({ title, count, content, severity, onClose }: Props) => {
  const { t } = useTranslation('commit')

  return (
    <MuiAlert
      severity={severity}
      variant="standard"
      onClose={onClose}
      sx={{
        border: '1px solid',
        borderColor: (theme) => theme.palette[severity || 'warning'].main,
      }}
    >
      {title && <AlertTitle>{t(title, { count })}</AlertTitle>}
      {t(content, { count })}
    </MuiAlert>
  )
}

export default AlertItem
