import { SxProps } from '@mui/material'
import { ReactNode } from 'react'

import { CrudColumn, InputType } from './crudTableTypes'

type FormColumn<T = any, K = string> = {
  hasRowDivider?: boolean
  renderRowEndItem?: (value: string) => ReactNode
  transParams?: Record<string, string>
  disabled?: boolean
  resetOnChange?: string[]
  rowSx?: SxProps
  columnSx?: SxProps
  extensionRows?: FormRow<T, K>[]
} & CrudColumn<T, K>

type FormRow<T, K> = FormColumn<T, K>[]

type FormRowGroup<T, K> = {
  warpComponent: (children: ReactNode) => ReactNode
  rows: FormRow<T, K>[]
}

type DetailFormRows = Array<
  Array<[InputType, string?, string?, Partial<DetailColumn<any, any>>?]>
>

type DetailColumn<T, K> = Partial<FormColumn<T, K>> & {
  extensionRows?: DetailFormRows
}

export type { DetailFormRows, FormColumn, FormRow, FormRowGroup }
