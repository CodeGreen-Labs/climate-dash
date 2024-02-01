import { Box, Stack } from '@mui/material'
import { ReactNode } from 'react'

interface TabPanelProps {
  children?: ReactNode
  name: any
  selected: any
}

const TabPanel = ({ children, selected, name, ...props }: TabPanelProps) => {
  return (
    <Stack
      role="tabpanel"
      hidden={selected !== name}
      id={`simple-tabpanel-${name}`}
      {...props}
    >
      {selected === name && <Box>{children}</Box>}
    </Stack>
  )
}

export default TabPanel
