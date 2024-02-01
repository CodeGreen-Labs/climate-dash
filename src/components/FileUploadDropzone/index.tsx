import { Button, Paper, Typography } from '@mui/material'
import { useCallback } from 'react'
import { Accept, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

interface Props {
  acceptTypes: string[]
  handleOnDrop: (acceptedFiles: File[]) => void
  maxFiles?: number
}

const transformAcceptTypes = (acceptTypes: string[]): Accept => {
  const result: Accept = {}
  for (const type of acceptTypes) {
    if (type.startsWith('.')) {
      const key = `text/${type.slice(1)}`
      result[key] = []
    } else {
      result[type] = []
    }
  }
  return result
}

const FileUploadDropzone = ({
  acceptTypes,
  handleOnDrop,
  maxFiles = 1,
}: Props) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleOnDrop(acceptedFiles)
  }, [])
  const { t } = useTranslation('common')

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: transformAcceptTypes(acceptTypes),
    maxFiles,
  })

  const isFileRejected = fileRejections.length > 0
  const tooManyFiles = acceptedFiles.length > 1

  return (
    <Paper
      {...getRootProps()}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        padding: 4,
        cursor: 'pointer',
        gap: 2,
        backgroundColor: isDragActive ? '#e9e9e9' : 'white',
        border: (theme) => `2px dashed ${theme.palette.primary.main}}`,
      }}
    >
      <input {...getInputProps()} />
      <img src={'/upload.svg'} alt="logo" width={24} />
      <Typography variant="h6">
        {isDragActive ? t('file-uploader.drop-here') : t('file-uploader.title')}
      </Typography>
      <Typography variant="body1" mb={2} color="text.secondary">
        {t('file-uploader.description', {
          count: maxFiles,
          acceptTypes: acceptTypes.join(', '),
        })}
      </Typography>
      {isFileRejected && (
        <Typography variant="body2" color="error">
          {t('file-uploader.unsupported', {
            acceptTypes: acceptTypes.join(', '),
          })}{' '}
        </Typography>
      )}
      {tooManyFiles && (
        <Typography variant="body1" color="error">
          {t('file-uploader.too-many-files', { count: maxFiles })}
        </Typography>
      )}
      <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
        {t('action.choose-file')}
      </Button>
    </Paper>
  )
}

export default FileUploadDropzone
