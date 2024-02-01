import { enqueueSnackbar, SharedProps } from 'notistack'

export const displayToast = (
  code: number,
  message: string,
  options?: SharedProps
) => {
  const defaultsOptions: SharedProps = {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    variant: 'info',
    autoHideDuration: 2000,
  }
  if (code >= 200 && code < 300) {
    defaultsOptions.variant = 'success'
  } else if (code >= 400 && code < 500) {
    defaultsOptions.variant = 'error'
  } else if (code >= 500) {
    defaultsOptions.variant = 'warning'
  } else {
    defaultsOptions.variant = 'info'
  }
  enqueueSnackbar(message, { ...defaultsOptions, ...options })
}
