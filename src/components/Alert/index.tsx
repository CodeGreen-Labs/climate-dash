import { Stack } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import {
  selectStagedCommitCount,
  selectSuccessCommitCount,
  updateSuccessCommitCount,
} from '@/store/slices/tableDataSlices'
import type { CommitTypes } from '@/types/commitTypes'

import AlertItem from './AlertItem'

const Alert = () => {
  const location = useLocation()
  const splitPathname = location.pathname.split('/')
  const pathname =
    splitPathname.length === 2
      ? (location.pathname.split('/')[1] as CommitTypes)
      : null

  const selectStagedCount = useSelector(selectStagedCommitCount)
  const selectSuccessCount = useSelector(selectSuccessCommitCount)

  const dispatch = useDispatch()

  return (
    <Stack sx={{ width: '100%' }}>
      {pathname && selectSuccessCount?.[pathname] > 0 && (
        <AlertItem
          count={selectSuccessCount[pathname]}
          content="commit:alert.committed.content"
          severity="success"
          onClose={() =>
            dispatch(
              updateSuccessCommitCount({
                key: pathname,
                value: 0,
              })
            )
          }
        />
      )}
      {pathname && selectStagedCount?.[pathname] > 0 && (
        <AlertItem
          count={selectStagedCount[pathname]}
          title={`alert.uncommitted.title${
            selectStagedCount[pathname] === 1 ? '_one' : '_other'
          }`}
          content={`alert.uncommitted.content${
            selectStagedCount[pathname] === 1 ? '_one' : '_other'
          }`}
          severity="warning"
        />
      )}
    </Stack>
  )
}

export default Alert
