import { ButtonProps } from '@mui/material'
import { FC, useRef } from 'react'
import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next'

import type { ExportHeader } from '@/types/exportData'

import { GreyButton } from './Button.styles'

interface IExportButton extends ButtonProps {
  data: any[]
  headers: ExportHeader[]
  filename?: string
  title?: string
}

const ExportButton: FC<IExportButton> = ({
  filename,
  data,
  headers,
  title = 'common:action.export',
  ...props
}) => {
  const { t } = useTranslation()
  const csvLink = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null)

  const handleExportData = () => {
    csvLink?.current?.link?.click()
  }
  return (
    <GreyButton onClick={handleExportData} {...props} size="medium">
      {t(title)}
      <CSVLink
        data={data}
        headers={headers}
        style={{ display: 'hide' }}
        ref={csvLink}
        filename={`${filename || 'output'}.csv`}
      ></CSVLink>
    </GreyButton>
  )
}

export default ExportButton
