import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { RadioSelector } from '@/components/Form/RadioSelector'
import { FormItemType } from '@/types/formItemTypes'

import { OptionInput } from '.'
import CustomDatePicker from './CustomDatePicker'
import { Subtitle, Title } from './Form.styles'
import TableRow from './TableRow'
const FormItem = ({
  type = 'text',
  editAble = true,
  header,
  defaultValue,
  cell,
  field,
  error,
  errorMessage,
  options,
  setValue,
  accessorKey,
  minDate,
  hasRowDivider = false,
  renderRowEndItem,
  transParams,
  rules,
  disabled = false,
  dirtyFields,
  resetField,
  resetOnChange = [],
  columnSx,
}: FormItemType) => {
  const { t } = useTranslation()
  const transHeader = header ? t(header, transParams) : header
  const renderInputType = () => {
    switch (type) {
      case 'title':
        return <Title id={header}>{transHeader}</Title>
      case 'subtitle':
        return <Subtitle id={header}>{transHeader}</Subtitle>
      case 'tableRow':
        return (
          <TableRow
            header={header}
            options={options}
            defaultValue={defaultValue}
            cell={cell}
          />
        )
      case 'view':
        return (
          <Stack direction="column" gap={1}>
            <Typography>{transHeader}</Typography>
            <Typography style={{ color: 'gray' }}>
              {typeof cell === 'function' ? cell(defaultValue) : defaultValue}
            </Typography>
          </Stack>
        )
      case 'option':
        return (
          <OptionInput
            header={transHeader}
            defaultValue={defaultValue}
            options={options}
            disabled={disabled}
            editAble={editAble}
            field={field}
            error={error}
            setValue={setValue}
          />
        )

      case 'radio':
        return (
          <FormControl component="fieldset">
            <RadioGroup row defaultValue={defaultValue} {...field}>
              <FormLabel
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  marginRight: 10,
                }}
              >
                {transHeader}
              </FormLabel>
              {options &&
                options.map((option, index) => (
                  <FormControlLabel
                    key={`${index}-${option.value}`}
                    value={option.value}
                    disabled={option.disabled}
                    control={<Radio color="primary" />}
                    label={option.label}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        )
      case 'date':
        return (
          <CustomDatePicker
            key={`${header}-${defaultValue}}`}
            disabled={!editAble || disabled}
            header={`${transHeader}`}
            defaultValue={dayjs(defaultValue)}
            minDate={minDate}
            onDateChange={(value) => field.onChange(value)}
          />
        )
      case 'popupRadio':
        return (
          options && (
            <RadioSelector
              required={rules?.required as boolean}
              label={transHeader}
              accessorKey={accessorKey || header}
              options={options}
              defaultValue={defaultValue}
              setValue={setValue}
              dirtyFields={dirtyFields}
              disabled={disabled}
            />
          )
        )

      case 'autocompleteSelector':
        return (
          <Box width="100%" id={`autocompleteSelector-${accessorKey}`}>
            <Autocomplete
              getOptionLabel={(option) =>
                option.label ||
                options?.find((item) => item.value === defaultValue)?.label
              }
              options={options || []}
              loading={!options}
              defaultValue={defaultValue}
              loadingText={t('loading')}
              disabled={options && options.length === 0}
              renderOption={(props, option) => (
                <li {...props} key={Math.random() + `${option.value}`}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...(params as any)}
                  {...field}
                  label={transHeader}
                  variant="outlined"
                  key={transHeader}
                />
              )}
              onChange={(event, value) => {
                const shouldReset =
                  defaultValue && defaultValue !== value?.value
                const valueExists = value && value.value !== undefined

                if (shouldReset && resetOnChange.length > 0 && resetField) {
                  resetOnChange.forEach((item) => {
                    resetField(item)
                    setValue(item, null)
                  })
                }

                if (valueExists) {
                  setValue(accessorKey || header, value.value)
                } else {
                  setValue(accessorKey || header, null)
                  if (!shouldReset && resetOnChange.length > 0 && resetField) {
                    resetOnChange.forEach((item) => {
                      resetField(item)
                      setValue(item, null)
                    })
                  }
                }
              }}
              isOptionEqualToValue={(option, value) => {
                return option.value === value.value
              }} // Customize the equality comparison
            />
          </Box>
        )

      case 'customize':
        return typeof cell === 'function' && cell(defaultValue)

      default:
        return (
          <TextField
            {...field}
            key={`${header}-${defaultValue}`}
            type={type}
            defaultValue={defaultValue}
            disabled={!editAble || disabled}
            fullWidth
            required={rules?.required as boolean}
            label={transHeader}
            aria-describedby={header}
            error={error}
            helperText={errorMessage}
            id={accessorKey || header}
          />
        )
    }
  }

  return (
    <Box key={`form-item-${header}`}>
      <Box
        display="flex"
        flexDirection="row"
        sx={{ py: 4, px: 4, alignItems: 'center', ...columnSx }}
      >
        {renderInputType()}
        {renderRowEndItem && renderRowEndItem(defaultValue)}
      </Box>
      {hasRowDivider && <Divider id={`divider-${header}-${Math.random()}`} />}
    </Box>
  )
}

export default FormItem
