import { SxProps } from '@mui/material'
import { ReactNode } from 'react'

export interface TabInfo {
  label: string
  value: string
  header?: ReactNode
  children: ReactNode
}
export interface TabFormProps {
  curTab: any
  setCurTab: (value: any) => void
  tabs: TabInfo[]
  tabStyles?: SxProps
  displayTabs?: boolean
  warpComponent?: any
}
