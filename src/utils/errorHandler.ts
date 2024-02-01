import { ResponseError } from '@/types/dataLayerTypes'

import { displayToast } from './toast'

export const displayAPIErrorToast = (error: any, title?: string) => {
  const { data, status, error: systemError } = error as ResponseError
  let message = title ? `${title}: ` : ''
  if (systemError) {
    message += `${status} `
  } else if (data?.detail) {
    if (typeof data.detail === 'string') {
      message = data.detail
    } else {
      data.detail.forEach((error: any, index: number) => {
        message += `${index + 1}.${error.loc.toString()} ${error.msg} `
      })
    }
  }
  displayToast(status, message, {
    autoHideDuration: 5000,
  })
}
