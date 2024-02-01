import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, Grid, IconButton } from '@mui/material'
import { Omit } from '@reduxjs/toolkit/dist/tsHelpers'
import { ReactNode, useMemo, useState } from 'react'

import { PopupForm } from '@/components/Form'
import { ErrorPopup, SubmitActionPopup } from '@/components/Popup'
import Table, { ILocalTable } from '@/components/Table'
import type { ColumnDef, CrudColumn } from '@/types/crudTableTypes'

interface ICrudTable extends Omit<ILocalTable, 'columns'> {
  isLoading: boolean
  columns: CrudColumn[]
  add?: boolean
  edit?: boolean
  remove?: boolean
  finishAdd?: (row: any) => void
  finishEdit?: (row: any) => void
  finishRemove?: (row: any) => void
  extraActions?: (row: any) => ReactNode
}

type FromType = 'add' | 'edit' | 'remove'

interface IFromData {
  columns: CrudColumn[]
  type: FromType
}

const CrudTable = ({
  columns,
  add = true,
  edit = true,
  remove = true,
  finishAdd,
  finishEdit,
  finishRemove,
  extraActions,
  isLoading,
  ...props
}: ICrudTable) => {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSubmitRemovePopup, setShowSubmitRemovePopup] = useState(false)
  const [submitError, setSubmitError] = useState<Error>()

  const addColumns = useMemo(
    () =>
      columns
        .filter((c) => c.addAble !== false)
        .map((c) => ({
          ...c,
          ...(c.addDefaultValue && {
            defaultValue: c.addDefaultValue,
          }),
          editAble: true,
        })),
    [columns]
  )

  const [formData, setFormData] = useState<IFromData>({
    columns: addColumns,
    type: 'add',
  })

  const formDataGenerator = (rowData?: any) =>
    columns.map((column) => {
      return {
        ...column,
        defaultValue: rowData?.[column?.accessorKey || ''] ?? '',
      }
    })

  const handleOpenPopupForm = (formType: FromType, rowData?: any) => {
    switch (formType) {
      case 'add':
        setFormData({
          columns: addColumns,
          type: 'add',
        })
        setShowEditForm(true)
        break
      case 'edit': {
        const selectedFormData = formDataGenerator(rowData)
        setFormData({
          columns: selectedFormData,
          type: 'edit',
        })
        setShowEditForm(true)
        break
      }

      case 'remove': {
        setFormData({
          columns: rowData,
          type: 'remove',
        })
        setShowSubmitRemovePopup(true)
        break
      }

      default:
        break
    }
  }

  const handleClosePopupForm = () => {
    setFormData({
      columns: addColumns,
      type: 'add',
    })
    setShowEditForm(false)
  }

  const handleOnSubmitForm = (row?: any) => {
    try {
      switch (formData.type) {
        case 'add':
          if (finishAdd) {
            finishAdd(row)
          }
          setShowEditForm(false)

          break
        case 'edit':
          if (finishEdit) {
            finishEdit(row)
          }
          setShowEditForm(false)

          break
        case 'remove':
          if (finishRemove) {
            finishRemove(formData.columns)
          }
          setShowSubmitRemovePopup(false)
          break

        default:
          break
      }
    } catch (error) {
      setSubmitError(error as Error)
    }
  }

  const handleErrorClose = () => {
    setSubmitError(undefined)
  }

  const curdColumns: ColumnDef<any, any>[] = [
    ...columns,
    {
      header: 'common:actions',
      accessorKey: 'action',
      cell: (info) => (
        <Grid container>
          {edit && (
            <IconButton
              size="small"
              onClick={() => handleOpenPopupForm('edit', info.row.original)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {remove && (
            <IconButton
              size="small"
              onClick={() => handleOpenPopupForm('remove', info.row.original)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          {extraActions && extraActions(info.row.original)}
        </Grid>
      ),
    },
  ]

  return (
    <Box>
      <Grid container>
        {add && (
          <Button
            color="secondary"
            variant="contained"
            sx={{ width: 150 }}
            onClick={() => handleOpenPopupForm('add')}
          >
            <AddIcon fontSize="small" /> Add
          </Button>
        )}
      </Grid>
      <Table
        columns={curdColumns}
        isLoading={isLoading}
        lastColumnFixed={!!(edit || remove || extraActions)}
        {...props}
      />
      {showEditForm && (
        <PopupForm
          title={formData.type}
          onClose={() => handleClosePopupForm()}
          columns={formData.columns}
          onSubmit={handleOnSubmitForm}
          onError={(e) => setSubmitError(e)}
        />
      )}
      {showSubmitRemovePopup && (
        <SubmitActionPopup
          title="Are you sure you want to delete this item?"
          onClose={() => setShowSubmitRemovePopup(false)}
          onSubmit={handleOnSubmitForm}
        />
      )}
      {!!submitError && (
        <ErrorPopup message={submitError.message} onClose={handleErrorClose} />
      )}
    </Box>
  )
}

export default CrudTable
