import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  MenuProps,
  Radio,
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { MouseEvent, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { IFilter } from '@/types/filterTypes'

import { StyledButton } from './styles'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  justifyContent: 'center',
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    background: theme.palette.primary.light,
  },
}))

const StyledMenu = styled((props: MenuProps & { menuWidth?: number }) => (
  <Menu elevation={0} {...props} />
))(({ theme, menuWidth }) => ({
  '& .MuiPaper-root': {
    minWidth: 220,
    width: menuWidth,
    borderRadius: 6,
    marginTop: theme.spacing(1),
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '0px',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

interface IFilterItem extends IFilter {
  onSubmit?: (selectOptions: string[]) => void
}

export default function MultipleFilter({
  title,
  options,
  onSubmit,
  selected,
  multiple = true,
}: IFilterItem) {
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const buttonRef = useRef<HTMLButtonElement>(null)

  const { control } = useForm()

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setSelectedOptions(selected)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOptionChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option))
    } else {
      if (multiple) {
        setSelectedOptions([...selectedOptions, option])
      } else {
        setSelectedOptions([option])
      }
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedOptions)
    }
    setAnchorEl(null)
  }
  return (
    <>
      <StyledButton
        variant="outlined"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        id={title}
        ref={buttonRef}
      >
        {t(title)}
        {selected.length > 0 && `(${selected.length})`}
      </StyledButton>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <FormGroup sx={{ padding: 2, minWidth: 'max-content' }}>
          {options.map(({ key, label }) => (
            <Controller
              key={key}
              name={key}
              control={control}
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    multiple ? (
                      <Checkbox
                        checked={selectedOptions.some((o) => o === key)}
                        onChange={() => {
                          onChange(!value)
                          handleOptionChange(key)
                        }}
                        id={`checkbox-${key}`}
                      />
                    ) : (
                      <Radio
                        checked={selectedOptions.some((o) => o === key)}
                        id={`radio-${key}`}
                        onChange={(event) => {
                          onChange(event.target.value === key)
                          handleOptionChange(key)
                        }}
                      />
                    )
                  }
                  label={t(label)}
                  aria-label={t(label)}
                />
              )}
            />
          ))}
        </FormGroup>
        <StyledMenuItem onClick={handleSubmit} id="action.apply">
          {t('common:apply')}
        </StyledMenuItem>
      </StyledMenu>
    </>
  )
}
