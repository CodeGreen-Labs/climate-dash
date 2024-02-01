import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
const PageHeading = () => {
  const { t } = useTranslation('nav', {
    keyPrefix: 'route',
  })
  const location = useLocation()

  const paths = location.pathname.split('/')
  return (
    <Typography variant="body1" sx={{ marginLeft: 3 }}>
      {t(`/${paths[1]}${paths[2] ? `/${paths[2]}` : ''}`)}
    </Typography>
  )
}

export default PageHeading
