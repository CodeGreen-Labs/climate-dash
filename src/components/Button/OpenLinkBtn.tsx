import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  link: string
}

const OpenLinkBtn = ({ link }: Props) => {
  const { t } = useTranslation()
  const handleOpenWindow = () => {
    window.open(
      link,
      '_blank',
      'top=500,left=200,frame=false,nodeIntegration=no'
    )
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{ height: 30 }}
        onClick={() => handleOpenWindow()}
      >
        {t('action.open')}
      </Button>
    </>
  )
}

export default OpenLinkBtn
