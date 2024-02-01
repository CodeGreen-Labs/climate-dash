import { CloseOutlined } from '@mui/icons-material'
import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  Button,
  ButtonProps,
  IconButton,
  InputAdornment,
  InputBase,
  Stack,
  SxProps,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AutocompleteOptions {
  label: string
  [key: string]: any
}

interface Props {
  onSearch: (searchField: string) => void
  onChange?: (searchField: string) => void
  onClear?: () => void
  autocompleteOptions?: AutocompleteOptions[]
  placeHolder?: string
  sx?: SxProps
  buttonSx?: SxProps
  buttonProps?: ButtonProps
}

const Search = ({
  onSearch,
  onChange,
  onClear,
  placeHolder = 'common:action.search',
  autocompleteOptions = [],
  sx,
  buttonSx,
  buttonProps,
}: Props) => {
  const { t } = useTranslation()
  const [searchField, setSearchField] = useState('')

  const handleSearch = () => {
    if (searchField.length > 0) {
      onSearch(searchField)
    }
  }

  const handleOnChange = (value: string) => {
    setSearchField(value)
    if (onChange) onChange(value)
  }

  const handleOnClear = () => {
    setSearchField('')
    if (onClear) onClear()
  }

  const capitalizeFirstLetterAndLowercaseRest = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }
  const placeholderText = t(placeHolder)

  useEffect(() => {
    if (searchField.length === 0) {
      if (onClear) onClear()
    }
  }, [searchField])

  return (
    <Stack
      width="100%"
      direction="row"
      height="40px"
      gap="16px"
      alignItems="center"
    >
      <Autocomplete
        id="search"
        fullWidth
        freeSolo
        options={autocompleteOptions}
        value={searchField}
        onInputChange={(event, value) => handleOnChange(value)}
        clearOnBlur
        clearOnEscape
        sx={{
          height: '100%',
        }}
        renderInput={(params) => (
          <InputBase
            {...params}
            placeholder={capitalizeFirstLetterAndLowercaseRest(placeholderText)}
            size="medium"
            fullWidth
            inputProps={{
              ...params.inputProps,
              'aria-label':
                capitalizeFirstLetterAndLowercaseRest(placeholderText),
            }}
            sx={{
              px: 1,
              gap: 0.5,
              borderRadius: '4px',
              height: '100%',
              ...sx,
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              searchField && ( // Only show clear icon when there's text in the input
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={handleOnClear}
                    size="medium"
                    aria-label="clear input"
                  >
                    <CloseOutlined />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        )}
      />

      <Button
        sx={{
          height: '100%',
          borderColor: '#0398D780',
          ...buttonSx,
        }}
        disabled={!(searchField.length > 0)}
        onClick={handleSearch}
        id="searchButton"
        color="primary"
        {...buttonProps}
      >
        {t('common:action.search')}
      </Button>
    </Stack>
  )
}

export default Search
