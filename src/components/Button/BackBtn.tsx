import { ArrowBack } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface BackBtnProps extends ButtonProps {
  onClick?: () => void
}

const BackBtn = ({ onClick, ...props }: BackBtnProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleOnClick = () => {
    if (onClick) onClick()
    else navigate(-1)
  }

  return (
    <Button
      onClick={handleOnClick}
      variant="outlined"
      startIcon={<ArrowBack />}
      {...props}
    >
      {t('common:action.back')}
    </Button>
  )
}

export default BackBtn
