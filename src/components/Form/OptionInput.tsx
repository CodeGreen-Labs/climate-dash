import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { FormItemType } from '@/types/formItemTypes'

const OptionInput = ({
  header,
  defaultValue,
  options,
  disabled,
  editAble,
  field,
  error,
}: FormItemType) => {
  const { t } = useTranslation()

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="select-button" id="select-label">
        {t(header)}
      </InputLabel>
      <Select
        labelId={`${header}-selector`}
        defaultValue={defaultValue || ''}
        disabled={!editAble || (options && options.length === 0) || disabled}
        label={t(header)}
        aria-describedby={t(header)}
        {...field}
        error={error}
      >
        {options &&
          options.map((option, index) => (
            <MenuItem
              key={`${index}-${option.value}`}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

export default OptionInput
