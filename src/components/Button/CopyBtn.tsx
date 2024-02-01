import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Button, ButtonProps, Snackbar } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import theme from '@/constants/themeConfig'
type Props = {
  name: string
  value: any
  small?: boolean
} & ButtonProps

const CopyBtn = ({ name, value, small, ...props }: Props) => {
  const { t } = useTranslation()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [, setCopiedValue] = useState('')

  const wh = small ? 24 : 32

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopiedValue(value)
    setSnackbarOpen(true)
  }

  return (
    <>
      <Button
        size="small"
        onClick={() => {
          handleCopy()
        }}
        {...props}
        sx={{
          ...props.sx,
          height: wh,
          minWidth: wh,
          background: theme.palette.primary.background,
        }}
      >
        <ContentCopyIcon sx={{ fontSize: small ? 16 : 24 }} />
      </Button>
      <Snackbar
        open={snackbarOpen}
        message={t('common:value-copied', { name: t(name) })}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  )
}

export default CopyBtn
