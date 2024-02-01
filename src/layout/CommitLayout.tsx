import { Stack, useTheme } from '@mui/material'
import { ReactNode } from 'react'

import Alert from '@/components/Alert'

interface Props {
  children: ReactNode
}

const CommitLayout = ({ children }: Props) => {
  const theme = useTheme()
  const styleOverrides = theme.components?.MuiAppBar?.styleOverrides?.root as
    | Record<string, string>
    | undefined
  return (
    <>
      <Stack px={3} height={`calc(100% - ${styleOverrides?.height})`}>
        <Alert />
        <Stack py={3}>{children}</Stack>
      </Stack>
    </>
  )
}

export default CommitLayout
