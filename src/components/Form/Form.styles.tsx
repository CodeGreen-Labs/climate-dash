import { styled, Typography } from '@mui/material'

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: '175%',
  fontSize: theme.typography.pxToRem(16),
  letterSpacing: theme.typography.pxToRem(0.15),
}))

const Subtitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  lineHeight: '157%',
  fontSize: theme.typography.pxToRem(14),
  letterSpacing: theme.typography.pxToRem(0.1),
}))

export { Subtitle, Title }
