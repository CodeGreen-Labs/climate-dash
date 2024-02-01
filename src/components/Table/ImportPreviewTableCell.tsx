import { Box, TableCell, TableCellProps } from '@mui/material'
import { useEffect, useState } from 'react'

import theme from '@/constants/themeConfig'
import { ImportTypeEnum } from '@/types/importDataTypes'

interface Props extends TableCellProps {
  type?: ImportTypeEnum
  value: any
  updateDisabled?: boolean
}

const ImportPreviewTableCell = ({
  type,
  value,
  updateDisabled = false,
  ...props
}: Props) => {
  const [color, setColor] = useState('default')
  const [bgColor, setBgColor] = useState('default')
  useEffect(() => {
    switch (type) {
      case ImportTypeEnum.TYPE_ERROR:
        setColor(theme.palette.error.main)
        break
      case ImportTypeEnum.EMPTY_ERROR:
        setBgColor(theme.palette.table?.error?.fill || '#FEECEC')
        break
      case ImportTypeEnum.UPDATE:
        if (updateDisabled) {
          setBgColor('#CDCDCD')
          setColor('#A3A3A3')
        }
        break
      default:
        break
    }
  }, [type, updateDisabled])

  return (
    <TableCell
      sx={{
        backgroundColor: bgColor,
        display: 'flex',
        color,
        border: 'none',
      }}
      {...props}
    >
      <Box>{value || '\u00A0'}</Box>
    </TableCell>
  )
}

export default ImportPreviewTableCell
