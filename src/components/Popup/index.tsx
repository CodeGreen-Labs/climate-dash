import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import {
  ChangeEvent,
  OptionHTMLAttributes,
  PropsWithChildren,
  useState,
} from 'react'
import { Trans, useTranslation } from 'react-i18next'

interface ErrorPopupProps {
  message: string
  onClose: () => void
  btnText?: string
}

export const ErrorPopup = ({
  message,
  onClose,
  btnText = 'ok',
}: ErrorPopupProps) => {
  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <Typography color="error">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{btnText}</Button>
      </DialogActions>
    </Dialog>
  )
}

interface SubmitActionPopupProps {
  title: string
  submitDisable?: boolean
  submitBtnText?: string
  closeBtnText?: string
  onClose: () => void
  onSubmit: (data?: any) => void
  onCloseOverlay?: () => void
}

export const SubmitActionPopup = ({
  title,
  submitDisable = false,
  submitBtnText = 'common:action.submit',
  closeBtnText = 'common:action.close',
  onClose,
  onSubmit,
  children,
  onCloseOverlay,
}: PropsWithChildren<SubmitActionPopupProps>) => {
  const { t } = useTranslation()
  return (
    <Dialog id={title} open onClose={onCloseOverlay || onClose}>
      <DialogTitle fontWeight={500}>{t(title)}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button id={`popup-common:action.close`} onClick={onClose}>
          {t(closeBtnText)}
        </Button>
        <Button
          id={`popup-common:action.submit`}
          disabled={submitDisable}
          onClick={onSubmit}
          autoFocus
          type="submit"
          color="primary"
        >
          {t(submitBtnText)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

type RadioPopupProps = Omit<SubmitActionPopupProps, 'children'> & {
  options: Array<OptionHTMLAttributes<HTMLOptionElement>>
  defaultValue: any
}

export const RadioPopup = ({
  title,
  submitDisable = false,
  submitBtnText = 'common:action.submit',
  onClose,
  onSubmit,
  options,
  defaultValue,
}: RadioPopupProps) => {
  const { t } = useTranslation()
  const [selectedValue, setSelectedValue] = useState(defaultValue)

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <SubmitActionPopup
      title={title}
      submitDisable={submitDisable}
      submitBtnText={submitBtnText}
      onClose={onClose}
      onSubmit={() => onSubmit(selectedValue)}
    >
      <FormControl component="fieldset">
        <RadioGroup defaultValue={defaultValue} onChange={handleRadioChange}>
          {options &&
            options.map((option, index) => (
              <FormControlLabel
                id={`radio-popup-${option.value}`}
                key={`${index}-${option.value}`}
                value={option.value}
                disabled={option.disabled}
                control={<Radio color="primary" />}
                label={<Trans t={t}>{option.label}</Trans>}
              />
            ))}
        </RadioGroup>
      </FormControl>
    </SubmitActionPopup>
  )
}
