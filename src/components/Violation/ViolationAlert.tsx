import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'

import useGetCredentials from '@/hooks/useGetCredentials'
import type { KycResults } from '@/types/TransactionType'

import { IHistroy } from '../Token/TokenHistory'
const ViolationAlert = ({
  data,
  type,
}: {
  data: IHistroy
  type: keyof KycResults
}) => {
  const credentials = useGetCredentials(data)

  return (
    <>{!credentials?.[type] && <ReportGmailerrorredIcon color="warning" />}</>
  )
}

export default ViolationAlert
