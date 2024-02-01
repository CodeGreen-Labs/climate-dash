import { useMemo } from 'react'

import { useGetStagingQuery } from '@/services'
import { CommitTable } from '@/types/dataLayerTypes'

interface Props {
  table: CommitTable
}

const useGetStagingData = ({ table }: Props) => {
  const { data: stagings, refetch: stagingsRefetch } = useGetStagingQuery('')

  const selectStaged = useMemo(
    () =>
      stagings?.filter(
        (item) => item.commited === false && item.table === table
      ) || [],
    [stagings, table]
  )

  const selectCommitting = useMemo(
    () =>
      stagings?.filter(
        (item) => item.commited === true && item.table === table
      ) || [],
    [stagings, table]
  )

  return {
    selectCommitting,
    selectStaged,
    stagingsRefetch,
    lockWriteFunc: stagings
      ? stagings.findIndex((staging) => staging.commited === true) !== -1
      : false,
  }
}

export default useGetStagingData
