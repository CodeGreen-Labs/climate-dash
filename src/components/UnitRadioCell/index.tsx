import { Radio } from '@mui/material'
import { useMemo } from 'react'

import { useGetRuleByTokenIdQuery } from '@/services'
import { UnitRadio } from '@/types/ruleTypes'

const UnitRadioCell = ({ info, selectedUnitId, handleChange }: UnitRadio) => {
  const { data, isLoading } = useGetRuleByTokenIdQuery(
    info?.marketplaceIdentifier || '',
    {
      skip: !info?.marketplaceIdentifier,
    }
  )

  const disabled = useMemo(() => {
    if (!info?.marketplaceIdentifier) return true
    if (data && !isLoading) {
      return true
    }
    return false
  }, [data, isLoading, info?.marketplaceIdentifier])
  return (
    <Radio
      key={`radio-${info?.warehouseUnitId}`}
      id={`radio-${info?.warehouseUnitId}`}
      checked={
        selectedUnitId ? info?.warehouseUnitId === selectedUnitId : false
      }
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => handleChange(info?.warehouseUnitId || '')}
      inputProps={{ 'aria-label': 'A' }}
    />
  )
}

export default UnitRadioCell
