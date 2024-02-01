import { ColumnDef as ColumnDefFromTable } from '@tanstack/react-table'
import { Dayjs } from 'dayjs'
import { HTMLInputTypeAttribute, OptionHTMLAttributes } from 'react'
import { RegisterOptions } from 'react-hook-form'

export type InputType =
  | 'title'
  | 'subtitle'
  | 'option'
  | 'popupRadio'
  | 'tableRow'
  | 'view'
  | 'customize'
  | 'autocompleteSelector'
  | HTMLInputTypeAttribute

export type ColumnDef<T, K> = {
  tooltip?: string
  accessorKey?: K
} & ColumnDefFromTable<T>

export type CrudColumn<T = any, K = string> = {
  header: string
  type?: InputType
  defaultValue?: any
  editAble?: boolean
  rules?: RegisterOptions
  addAble?: boolean
  options?: Array<OptionHTMLAttributes<HTMLOptionElement>>
  minDate?: string | Dayjs
  addDefaultValue?: any
} & ColumnDef<T, K>
