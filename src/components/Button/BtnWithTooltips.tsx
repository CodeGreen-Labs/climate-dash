import { Button, ButtonProps, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props extends ButtonProps {
  tooltip?: string
  btnText?: string
}

const BtnWithTooltips = ({
  onClick,
  disabled,
  tooltip = 'commit:can-not-do-action-when-committing',
  btnText = 'common:action.edit',
  ...props
}: Props) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t(tooltip)} disableHoverListener={!disabled || !tooltip}>
      <span>
        <Button
          disabled={disabled}
          onClick={onClick}
          variant="contained"
          id={btnText}
          {...props}
        >
          {t(btnText)}
        </Button>
      </span>
    </Tooltip>
  )
}

export default BtnWithTooltips
