import { Chip, Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'

import useGetCredentials from '@/hooks/useGetCredentials'

import type { IHistroy } from '../Token/TokenHistory'
const Violation = (props: IHistroy) => {
  const { allKyc, isLoading } = useGetCredentials(props)
  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton sx={{ width: 80, height: 48 }} />
  }

  return (
    <Chip
      color={allKyc ? 'default' : 'warning'}
      sx={{ borderRadius: '6px', minWidth: 80 }}
      label={
        allKyc
          ? t('wallet:history.violation-status.normal')
          : t('wallet:history.violation-status.violating')
      }
    />
  )
}

export default Violation
