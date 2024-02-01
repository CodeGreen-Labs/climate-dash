import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import i18n from './i18n'

dayjs.extend(utc)
dayjs.extend(timezone)

export const formatDate = (date?: Dayjs | string) => {
  if (!date) return ''

  dayjs.locale(i18n.language)
  return dayjs(date).format('L')
}
export const formatTime = (date?: Dayjs | string | undefined | number) => {
  if (!date) return ''

  dayjs.locale(i18n.language)
  return dayjs(date).format('L HH:mm')
}

export const formatTimeToUTC = (date?: Dayjs | string | undefined) => {
  if (!date) return ''
  return dayjs.utc(date)
}
