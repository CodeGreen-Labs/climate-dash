import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { CrudColumn } from '@/types/crudTableTypes'

import FormItem from './FormItem'

interface Props {
  title: string
  onClose: () => void
  onSubmit: (data: any) => void
  columns: CrudColumn[]
  onError: (error: Error) => void
}

const PopupForm = ({ title, onClose, onSubmit, columns, onError }: Props) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' })

  useEffect(() => {
    // set default values for each column
    columns.forEach((col) => {
      setValue(col?.accessorKey ?? '', col?.defaultValue ?? '')
    })
  }, [columns, setValue])

  const handleFormSubmit = (data: any) => {
    if (isValid) {
      onSubmit(data)
      reset()
    }
  }

  const handleFormClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open onClose={handleFormClose}>
      <form
        onSubmit={(e) =>
          handleSubmit(handleFormSubmit)(e).catch((error) => {
            onError(error as Error)
          })
        }
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent style={{}}>
          <Grid container mt={2} spacing={2}>
            {columns.map(
              ({
                type,
                accessorKey,
                header,
                defaultValue,
                editAble,
                rules,
                options,
              }) => (
                <Grid item key={accessorKey} xs={12}>
                  <Controller
                    render={({ field }) => (
                      <FormItem
                        editAble={editAble}
                        type={type}
                        field={field}
                        error={!errors?.[accessorKey as string]}
                        header={header}
                        accessorKey={accessorKey}
                        defaultValue={defaultValue}
                        options={options}
                        setValue={setValue}
                      />
                    )}
                    name={accessorKey || ''}
                    control={control}
                    rules={rules || {}}
                  />
                </Grid>
              )
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="secondary">
            Summit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default PopupForm
