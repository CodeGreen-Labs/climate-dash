import { Button, styled } from '@mui/material'

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  minWidth: '160px',
  gap: '16px',
  color: theme.palette.text.secondary,
  borderColor: '#E3E3E3',
}))

export { StyledButton }
