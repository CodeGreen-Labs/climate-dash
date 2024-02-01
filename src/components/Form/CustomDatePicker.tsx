import { Grid, Paper, Typography } from '@mui/material'
import { CalendarIcon } from '@mui/x-date-pickers'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import Dayjs from 'dayjs'
import { FC, useEffect, useRef, useState } from 'react'

import { formatDate } from '@/utils/datetime'

import { PopupIconButton } from '../Button/Button.styles'

interface CustomDatePickerProps {
  header: string
  defaultValue: Dayjs.Dayjs
  minDate?: Dayjs.Dayjs | string
  onDateChange: (date: Dayjs.Dayjs) => void
  disabled?: boolean
}

const CustomDatePicker: FC<CustomDatePickerProps> = ({
  header,
  defaultValue,
  minDate,
  onDateChange,
  disabled,
}) => {
  const [value, setValue] = useState<Dayjs.Dayjs>(defaultValue)
  const [open, setOpen] = useState(false)
  const paperRef = useRef<HTMLDivElement>(null)

  const handleDateChange = (date: Dayjs.Dayjs) => {
    setValue(date)
    onDateChange(date)
    // not close the calendar if the year is different
    if (date.year() === value.year()) setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paperRef.current &&
        !paperRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [paperRef])

  return (
    <Grid container flexDirection="column">
      <Typography variant="subtitle2" color="text.secondary">
        {header}
      </Typography>
      <Grid
        item
        container
        flexDirection="row"
        alignItems="center"
        gap={2}
        mt={2}
      >
        <Typography color="text.primary" variant="h6">
          {formatDate(value)}
        </Typography>
        <PopupIconButton
          aria-label="open date picker"
          onClick={() => setOpen(!open)}
          disabled={disabled}
          id="date-picker-btn"
        >
          <CalendarIcon />
        </PopupIconButton>
      </Grid>
      {open && (
        <Grid
          item
          container
          justifyContent="flex-start"
          flexDirection="row"
          width="fit-content"
          position="relative"
          ref={paperRef}
        >
          <Paper
            sx={{
              position: 'absolute',
              bottom: '0',
              left: '165px',
              zIndex: 100,
            }}
          >
            <DateCalendar
              value={value}
              onChange={(date) => handleDateChange(date as Dayjs.Dayjs)}
              minDate={minDate}
            />
          </Paper>
        </Grid>
      )}
    </Grid>
  )
}

export default CustomDatePicker
