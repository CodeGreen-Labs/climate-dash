import type { ColumnDef, CrudColumn } from '@/types/crudTableTypes'
import { ExportHeader } from '@/types/exportData'

import i18n from './i18n'
type Column<T, K> = CrudColumn<T, K>[] | ColumnDef<T, K>[]

export function makeHeaders<T, K>(columns: Column<T, K>) {
  return columns.map((column) => {
    return {
      label: i18n.t(column.header as string),
      key: column.accessorKey,
    }
  }) as ExportHeader[]
}
