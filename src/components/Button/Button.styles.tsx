import { Button, IconButton, styled } from '@mui/material'

const GreyButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderRadius: '4px',
  background: 'rgba(179, 186, 188, 0.12)',
  border: 'none',
  padding: '8px 16px',
  '&:hover': {
    background:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.08) 100%), rgba(179, 186, 188, 0.12)',
    transition: 'background 0.3s ease-in-out',
  },
}))

const PopupIconButton = styled(IconButton)(() => ({
  border: '1px solid #0000003D',
  borderRadius: '8px',
  height: '40px',
  width: '40px',
}))

export { GreyButton, PopupIconButton }
