import { Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { selectFilter, updateFilter } from '@/store/slices/filterSlices'
import { EFilter, EFilterList } from '@/types/filterTypes'

import FilterItem from './FilterItem'

interface Props {
  filter: EFilter
}

const FilterList = ({ filter }: Props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const filters = useSelector(selectFilter(filter))

  const handleUpdate = (key: EFilterList, selected: string[]) => {
    dispatch(updateFilter({ filter, key, selected }))
  }

  const handleClearSelect = () => {
    Object.keys(filters).forEach((key) => {
      dispatch(updateFilter({ filter, key: key as EFilterList, selected: [] }))
    })
  }

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      display="flex"
      flexWrap="wrap"
      position="relative"
      gap="12px"
    >
      {Object.keys(filters).length > 0 && (
        <Typography variant="body1" sx={{ mr: 3 }}>
          {t('common:filters')}
        </Typography>
      )}
      {Object.entries(filters).map(([key, value]) => {
        return (
          <FilterItem
            selected={value.selected}
            key={key}
            title={value.title}
            subTitle={value.subTitle}
            options={value.options}
            multiple={value.multiple}
            onSubmit={(options) => handleUpdate(key as EFilterList, options)}
          />
        )
      })}

      {!Object.entries(filters).every(
        ([, value]) => value.selected.length === 0
      ) && (
        <Button
          onClick={handleClearSelect}
          sx={{ textTransform: 'uppercase' }}
          id="btn-remove-filters"
        >
          {t('common:remove-all-filters')}
        </Button>
      )}
    </Stack>
  )
}

export default FilterList
