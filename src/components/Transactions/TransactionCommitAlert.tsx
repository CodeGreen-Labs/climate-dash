import { Alert, AlertTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'

const TransactionCommitAlert = () => {
  const { t } = useTranslation()
  return (
    <Alert
      severity="info"
      sx={{
        border: (theme) => `1px solid ${theme.palette.info.dark}`,
        borderRadius: '4px',
      }}
    >
      <AlertTitle>{t('commit:alert.commit.title')}</AlertTitle>
      {t('commit:alert.commit.content')}
    </Alert>
  )
}

export default TransactionCommitAlert
