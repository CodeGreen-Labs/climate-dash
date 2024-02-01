import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  toggle: boolean
  handleOnClick: () => void
}

const ViewMoreBtn = ({ toggle, handleOnClick }: Props) => {
  const { t } = useTranslation()
  return (
    <Button
      size="small"
      onClick={handleOnClick}
      endIcon={toggle ? <ArrowDropUp /> : <ArrowDropDown />}
      id="common:action.view-more"
    >
      {toggle ? t('common:action.hide-details') : t('common:action.view-more')}
    </Button>
  )
}

export default ViewMoreBtn
