import { Box, SxProps } from '@mui/material'
import _ from 'lodash'

import ViewMoreBtn from '@/components/Button/ViewMoreBtn'
import { Title } from '@/components/Form'
import theme from '@/constants/themeConfig'
import { InputType } from '@/types/crudTableTypes'
import {
  DetailFormRows,
  FormColumn,
  FormRow,
  FormRowGroup,
} from '@/types/formTypes'
import { RuleKeys } from '@/types/ruleTypes'

import i18n from './i18n'
import { flattenObject, generateErrorMassage } from './tableData'

const addColumnWithViewMoreButton = (
  name: string,
  columns: FormColumn<any, any>[],
  toggle: boolean,
  extendedColumns: FormColumn<any, any>[],
  handleOnClick: () => void
) => {
  let updatedColumns = [...columns]

  if (toggle) {
    updatedColumns = updatedColumns.concat(extendedColumns)
  }

  updatedColumns.push({
    type: 'customize',
    header: '',
    accessorKey: `${name}-view-more-btn`,
    cell: () => ViewMoreBtn({ toggle, handleOnClick }),
    hasRowDivider: true,
  })

  return updatedColumns
}

const leftColumnStyle: SxProps = {
  flex: 0.5,
  alignSelf: 'flex-start',
  textAlign: 'left',
}

const blankColumn: FormColumn<any, any> = {
  header: 'left-blank-column',
  type: 'customize',
  rowSx: leftColumnStyle,
  columnSx: {
    px: 0,
    py: 0,
  },
}

const titleColumn = (column: FormColumn<any, any>): FormColumn<any, any> => ({
  ...column,
  header: column.header,
  type: 'customize',
  columnSx: { py: 0, px: 0 },
  rowSx: { ...leftColumnStyle, mb: -4 },
  cell: () => <Title>{i18n.t(column.header)} </Title>,
})

const dividerColumn: FormColumn<any, any> = {
  header: `divider-${Math.random()}`,
  type: 'customize',
  rowSx: { px: 0 },
  columnSx: { pl: 0, pr: 4 },
  cell: () => (
    <Box
      width="100%"
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}}`,
        my: 2,
      }}
    />
  ),
}
const addRowWithViewMoreButton = (
  name: string,
  Rows: FormRow<any, any>[],
  toggle: boolean,
  extendedColumns: FormRow<any, any>[],
  handleOnClick: () => void,
  withLeftBlankColumn: boolean = true,
  rowSx: SxProps = {}
) => {
  let updatedRows = _.cloneDeep(Rows)

  if (toggle) {
    updatedRows = updatedRows.concat(extendedColumns)
  }

  const additionalRow: FormRow<any, any> = [
    {
      type: 'customize',
      header: '',
      accessorKey: `${name}-view-more-btn`,
      rowSx,
      cell: () => ViewMoreBtn({ toggle, handleOnClick }),
    },
  ]

  if (withLeftBlankColumn) {
    additionalRow.unshift(blankColumn)
  }

  updatedRows.push(additionalRow)

  return updatedRows
}

const styleTableRow = (rows: FormRow<any, any>[], curIndex: number) =>
  rows.map((row) => {
    return row.map((column: FormColumn) => {
      if (column.type === 'tableRow') {
        column.columnSx = {
          background:
            curIndex % 2 === 0
              ? theme.palette.table?.row?.even
              : theme.palette.table?.row?.odd,
          px: 2,
          py: 0,
          height: 50,
          ...column.columnSx,
        }
        column.rowSx = {
          px: 4,
        }
        curIndex++

        if (column.extensionRows) {
          styleTableRow(column.extensionRows, curIndex)
        }
      }

      return column
    })
  })

const styleTableRowByRowGroups = (
  rowGroups: FormRowGroup<any, any>[],
  initialIndex: number = 0
) => {
  const curIndex = initialIndex

  return rowGroups.map((group) => {
    group.rows = styleTableRow(group.rows, curIndex)
    return group
  })
}

// Will be deleted in the future if find a better way to do this
const generateColumns = (data: any, columns: FormColumn[]) => {
  if (data) {
    const flattenData = flattenObject([], data)
    return columns.map((column) => {
      const { accessorKey } = column
      const defaultValue = flattenData?.[accessorKey as RuleKeys]
      if (defaultValue) {
        return {
          ...column,
          defaultValue,
        }
      }
      return column
    })
  }
  return columns
}

function parseJSON<T>(str: string): T | null {
  if (!str) return null

  try {
    const parsed = JSON.parse(str) as T
    return parsed
  } catch (e) {
    return null
  }
}

const isJSON = (str: string) => {
  return parseJSON(str) !== null
}

const getErrorMessage = (accessorKey: string, errors: Record<string, any>) => {
  const errorObject =
    flattenObject([accessorKey], errors)[accessorKey] || errors[accessorKey]
  if (!errorObject) return null
  const errorMessage = generateErrorMassage(accessorKey, errors)
  return typeof errorMessage === 'string'
    ? errorMessage
    : (i18n.t(errorMessage?.key, errorMessage?.params) as string)
}

const createRowWithBlankColumn = (Column: Function | FormColumn) => {
  const tableColumn = typeof Column === 'function' ? Column() : Column
  return [blankColumn, tableColumn]
}

const createFormColumn = (
  type: InputType,
  header?: string,
  accessorKey?: string,
  options?: Partial<FormColumn>
): FormColumn => ({
  type,
  header: header ?? '',
  accessorKey: accessorKey ?? '',
  ...options,
})

const createDetailRows = (formRows: DetailFormRows): FormRow<any, any>[] => {
  const formattedRows: FormRow<any, any>[] = []

  for (const group of formRows) {
    const columns = group.map((row) =>
      createFormColumn(row[0], row[1], row[2], row[3])
    )

    if (columns[0].type === 'title') {
      formattedRows.push([titleColumn(columns[0]), columns[1]])
    } else if (columns[0].type === 'divider') {
      formattedRows.push([dividerColumn])
    } else {
      if (columns[0]?.extensionRows) {
        const extensionRows = createDetailRows(
          columns[0].extensionRows as unknown as DetailFormRows
        )
        formattedRows.push(
          createRowWithBlankColumn({
            ...columns[0],
            extensionRows,
          })
        )
      } else {
        formattedRows.push(createRowWithBlankColumn(columns[0]))
      }
    }
  }
  return styleTableRow(formattedRows, 0)
}

export {
  addColumnWithViewMoreButton,
  addRowWithViewMoreButton,
  blankColumn,
  createDetailRows,
  createFormColumn,
  createRowWithBlankColumn,
  dividerColumn,
  generateColumns,
  getErrorMessage,
  isJSON,
  leftColumnStyle,
  parseJSON,
  styleTableRow,
  styleTableRowByRowGroups,
  titleColumn,
}
