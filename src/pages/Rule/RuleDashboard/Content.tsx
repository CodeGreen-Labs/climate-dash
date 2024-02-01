import { Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import CrudTable from '@/components/CrudTable'
import { CrudColumn } from '@/types/crudTableTypes'
import { TransactionListItem } from '@/types/TransactionType'

interface Props {
  countTitle: string
  count: number
  data: Record<string, any>[]
  columns: CrudColumn[]
}

const Content = ({ countTitle, count, data, columns }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleOpenDetails = (data: TransactionListItem) => {
    navigate({
      pathname: `/rule/violating/${data.transaction_id}`,
    })
  }
  return (
    <Stack sx={{ p: 2 }}>
      <Typography variant="body1" mt={2}>
        {t(countTitle, {
          count,
        })}
      </Typography>
      <CrudTable
        isLoading={false}
        data={data}
        columns={columns}
        add={false}
        edit={false}
        remove={false}
        extraActions={(rowData) => (
          <Button onClick={() => handleOpenDetails(rowData)} variant="outlined">
            {t('common:action.view')}
          </Button>
        )}
      />
    </Stack>
  )
}

export default Content
