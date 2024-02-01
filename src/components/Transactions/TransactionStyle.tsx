import { Button, Stack, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

export const TransactionInfo = styled(Stack)<{ selected?: boolean }>(
  ({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: 4,
  })
)

export const TransactionInput = styled(TextField)<{ selected?: boolean }>(
  () => ({
    marginBottom: 5,
    width: '100%',
  })
)

export const TransactionButton = styled(Button)({
  padding: '8px 40px',
})

export const TransactionContentWidth = 820
