import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
const NotFound = () => {
  const [t] = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: 'calc( 100vh - 94px )',
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6" gutterBottom>
        {t('not-found.page-is-not-exist')}
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        {t('not-found.back-home')}
      </Button>
    </Box>
  )
}

export default NotFound
