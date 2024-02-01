import { SxProps } from '@mui/material'
import {
  ControllerRenderProps,
  FieldValues,
  UseFormResetField,
  UseFormSetValue,
} from 'react-hook-form'

import { FormColumn } from './formTypes'

export type FormItemType = {
  field: ControllerRenderProps<FieldValues, string>
  error: boolean
  errorMessage?: string
  setValue: UseFormSetValue<FieldValues>
  dirtyFields?: Partial<Readonly<any>>
  resetField?: UseFormResetField<FieldValues>
  sx?: SxProps
  headerSx?: SxProps
} & FormColumn
