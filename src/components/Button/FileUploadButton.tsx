import { NoteAddOutlined } from '@mui/icons-material'
import { ButtonProps } from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { OnFileLoaded } from '@/types/fileUploadTypes'
import { custom_csv_parser } from '@/utils/fileUpload'
import { displayToast } from '@/utils/toast'

import FileUploadDropzone from '../FileUploadDropzone'
import { GreyButton } from './Button.styles'

interface Props extends ButtonProps {
  title?: string
  acceptTypes: string[]
  onLoaded?: OnFileLoaded
  withDropZone?: boolean
  defaultHeader?: string[]
}

const FileUpload = ({
  title = 'upload',
  acceptTypes,
  onLoaded,
  withDropZone = false,
  defaultHeader = [],
  ...props
}: Props) => {
  const { t } = useTranslation('common')

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement> | File[] | any
  ) => {
    const file = event?.target?.files?.[0] || event?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as any

        if (!content) return displayToast(400, t('alert.export.empty-content'))
        switch (file.type) {
          case 'text/csv': {
            const lines = content.split('\n')
            let header = custom_csv_parser(lines[0])

            // Check if the parsed header contains all fields from the defaultHeader
            const hasAllFields = defaultHeader.every((field) => {
              return header.includes(field)
            })
            if (!hasAllFields) {
              // If not, assume the CSV has no header and use the defaultHeader instead
              header = defaultHeader
            } else {
              // If they match, remove the header from the lines to avoid processing it as data
              lines.shift()
            }

            const formattedContent: Record<string, any>[] = []
            for (const line of lines) {
              const values = custom_csv_parser(line)
              const record: Record<string, any> = {}

              for (let j = 0; j < header.length; j++) {
                const value = values[j] || ''
                record[header[j]] = value
              }

              formattedContent.push(record)
            }

            onLoaded && onLoaded(file.name, file.type, formattedContent)
            break
          }
          default:
            onLoaded && onLoaded(file.name, file.type, content)
            break
        }
      }
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file)
      } else {
        switch (file.type) {
          case 'text/csv':
            reader.readAsText(file)
            break
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            reader.readAsArrayBuffer(file)
            break
          default:
            alert('Unsupported file type')
            break
        }
      }
    }
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {withDropZone ? (
        <FileUploadDropzone
          acceptTypes={acceptTypes}
          handleOnDrop={handleFileChange}
        />
      ) : (
        <GreyButton
          component="label"
          startIcon={<NoteAddOutlined />}
          {...props}
        >
          {t(title)}
          <input
            hidden
            accept={acceptTypes.join(',')}
            onChange={handleFileChange}
            type="file"
          />
        </GreyButton>
      )}
    </Stack>
  )
}

export default FileUpload
