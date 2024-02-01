import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { IHistroy } from '../Token/TokenHistory'

interface Props {
  row: Row<IHistroy>
}

const OnChain = ({ row }: Props) => {
  const { t } = useTranslation()
  return (
    <>
      {t(`wallet:history.tx-status.${row.original.status}`)}
      {row.original.status === 'on-chain' && (
        <CheckCircleIcon
          sx={{
            color: (theme) => theme.palette.success.light,
            fontSize: 18,
            ml: 1,
          }}
        />
      )}
    </>
  )
}

export default OnChain
