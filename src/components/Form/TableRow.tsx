import { Box, Stack, SxProps, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { FormColumn } from '@/types/formTypes'
import i18n from '@/utils/i18n'

const TableRow = ({ header, options, defaultValue, cell }: FormColumn) => {
  const { t } = useTranslation()

  // Define styles
  const headerStyle: SxProps = {
    flex: 0.4,
    wordBreak: 'break-word',
  }

  const valueStyle: SxProps = {
    flex: 1,
    wordBreak: 'break-word',
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      spacing={2}
      id={`table-row-${header}`}
      flex={1}
    >
      <Box sx={headerStyle}>
        <Typography variant="body2" color="#646464">
          {t(header)}
        </Typography>
      </Box>
      <Box sx={valueStyle}>
        {options ? (
          <Typography variant="body2">
            {i18n.t(
              options.find(
                (item) =>
                  (item.value as any).toString() === defaultValue.toString()
              )?.label as string
            )}
          </Typography>
        ) : typeof cell === 'function' ? (
          cell(defaultValue)
        ) : (
          <Typography variant="body2">{defaultValue}</Typography>
        )}
      </Box>
    </Stack>
  )
}

export default TableRow
