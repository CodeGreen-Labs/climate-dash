import { Edit } from '@mui/icons-material'
import { Box, FormLabel, Stack, Typography } from '@mui/material'
import { OptionHTMLAttributes, useEffect, useMemo, useState } from 'react'
import { FieldValues, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { RadioPopup } from '@/components/Popup'

import { PopupIconButton } from '../Button/Button.styles'

interface RadioSelectorProps {
  label: string
  accessorKey: string
  options: Array<OptionHTMLAttributes<HTMLOptionElement>>
  defaultValue: string
  setValue: UseFormSetValue<FieldValues>
  required?: boolean | undefined
  dirtyFields?: Partial<Readonly<any>>
  disabled?: boolean
}

export const RadioSelector = ({
  label,
  accessorKey,
  options,
  defaultValue,
  setValue,
  required = false,
  dirtyFields,
  disabled = false,
}: RadioSelectorProps) => {
  const { t } = useTranslation()
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const [openPopup, setOpenPopup] = useState(false)
  const selectedName = useMemo<string>(
    () =>
      options?.filter((item) => item.value === parseInt(selectedValue))?.[0]
        ?.label as string,
    [selectedValue, options]
  )
  const handlePopupSubmit = (value: string) => {
    setSelectedValue(value)
    setValue(accessorKey, value, { shouldDirty: true })
    setOpenPopup(false)
  }

  const handlePopupOpen = () => {
    setOpenPopup(true)
  }

  const handlePopupClose = () => {
    setOpenPopup(false)
  }

  useEffect(() => {
    if (!dirtyFields?.[accessorKey]) {
      setSelectedValue(defaultValue)
    }
  }, [dirtyFields])

  return (
    <Box>
      <FormLabel>
        {label}
        {required && ' *'}
      </FormLabel>
      <Stack direction="row" alignItems="center" gap={2} mt={2} mb={1}>
        <Typography
          variant="h6"
          sx={{
            color: '#1A8BCF',
          }}
        >
          {t(selectedName)}
        </Typography>
        <PopupIconButton
          onClick={handlePopupOpen}
          disabled={disabled}
          id={`common:action.edit-${accessorKey}`}
        >
          <Edit />
        </PopupIconButton>
      </Stack>
      {openPopup && (
        <RadioPopup
          title={label}
          defaultValue={selectedValue}
          onClose={handlePopupClose}
          onSubmit={handlePopupSubmit}
          options={options}
        />
      )}
    </Box>
  )
}
