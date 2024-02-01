import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyBtn } from '@/components/Button'

interface IProps {
  address: string
}

const TokenViewDetailBtn = ({ address }: IProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{
          height: 32,
          minWidth: 32,
          width: 32,
          background: (theme) => theme.palette.primary.background,
        }}
      >
        <MoreHorizIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('wallet:address')}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <DialogContentText>{address}</DialogContentText>
          <CopyBtn name="wallet:address" value={address} variant="text" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {t('common:action.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TokenViewDetailBtn
