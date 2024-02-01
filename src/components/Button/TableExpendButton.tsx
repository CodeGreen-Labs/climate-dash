import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Button } from '@mui/material'
import { Row } from '@tanstack/react-table'

interface Props {
  row: Row<any>
}

const TableExpendButton = ({ row }: Props) => {
  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={() => row.toggleExpanded()}
      sx={{
        minWidth: 24,
        width: 32,
        height: 32,
        color: (theme) => theme.palette.grey[500],
        borderRadius: 1,
      }}
    >
      {row.getIsExpanded() ? (
        <KeyboardArrowUpIcon />
      ) : (
        <KeyboardArrowDownIcon />
      )}
    </Button>
  )
}

export default TableExpendButton
