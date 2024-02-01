import { addressInfo } from '@rigidity/chia'
import { ColumnSort } from '@tanstack/react-table'
import dayjs from 'dayjs'
import Fuse from 'fuse.js'
import { ValidationRule } from 'react-hook-form'

import { chain } from '@/constants/network'
import { emailPattern, numberPattern, stringPattern } from '@/constants/regex'
import { PaginationParams } from '@/types/climateWarehouseTypes'
import type { CrudColumn } from '@/types/crudTableTypes'
import { CommitStatus, KycCredential, Rule } from '@/types/dataLayerTypes'
import { EFilterList, IFilterListType } from '@/types/filterTypes'
import { I18nTransProps } from '@/types/i18nTypes'
import { KycCredentialList, KycStatus } from '@/types/kycTypes'
import { RuleEditFormKeys } from '@/types/ruleTypes'

import { formatTimeToUTC } from './datetime'
import { isJSON } from './form'

// from
// {
//     'walletUser.name': 'abc',
//     id: '123'
// }
// to
// {
//     user: {
//         name: "abc",
//     },
//     id: '123'
// }
export const transformObject = (
  obj: Record<string, any>
): Record<string, any> => {
  const transformedObj: Record<string, any> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key.includes('.')) {
        const [nestedKey, nestedProp] = key.split('.')
        if (!transformedObj[nestedKey]) {
          transformedObj[nestedKey] = {}
        }
        transformedObj[nestedKey][nestedProp] = value
      } else {
        transformedObj[key] = value
      }
    }
  })

  return transformedObj
}

// from
// {
//     user: {
//         name: "abc",
//     },
//     id: '123'
// }
// to
// {
//     'walletUser.name': 'abc',
//     id: '123'
// }

export const flattenObject = (
  excludedKeys: string[],
  obj: Record<string, any>,
  prefix = ''
): Record<string, any> => {
  const flattenedObj: Record<string, any> = {}
  if (obj) {
    Object.entries(obj).forEach(([key, value]) => {
      const currentKey = prefix ? `${prefix}.${key}` : key

      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        if (excludedKeys.includes(currentKey)) {
          flattenedObj[currentKey] = value
        } else {
          const nestedObj = flattenObject(excludedKeys, value, currentKey)
          Object.assign(flattenedObj, nestedObj)
        }
      } else {
        flattenedObj[currentKey] = value
      }
    })
  }

  return flattenedObj
}

export const setFormDefaultValues = (columns: CrudColumn[]) => {
  const results: { [key: string]: any } = {}

  columns.forEach((column) => {
    if (column.accessorKey) {
      const keys = column.accessorKey.split('.')
      let currentObj: { [key: string]: any } = results

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]

        if (!currentObj[key]) {
          currentObj[key] = {}
        }

        currentObj = currentObj[key]
      }

      const lastKey = keys[keys.length - 1]
      const defaultValue = column.defaultValue

      if (defaultValue !== undefined) {
        currentObj[lastKey] = defaultValue
      }
    }
  })

  return results
}

export const requiredErrorMessageGenerator = (
  translationPrefix: string,
  key: string
) =>
  JSON.stringify({
    key: 'common:validation.required',
    params: { key: `${translationPrefix}.${key}` },
  })

export const validateWalletAddress = (address?: string) => {
  try {
    if (!address) return false
    const info = addressInfo(address)
    return info.hash.length === 32 && info.prefix === chain.prefix
  } catch (error) {
    return false
  }
}

export const valuePatternGenerator = (
  key: string,
  type: 'string' | 'number' | 'email' | 'wallet_address'
): ValidationRule<any> => {
  if (type === 'string')
    return {
      value: stringPattern,
      message: JSON.stringify({
        key: 'common:validation.must-be-alphanumeric',
        params: { key },
      }),
    }
  else if (type === 'number')
    return {
      value: numberPattern,
      message: JSON.stringify({
        key: 'common:validation.must-be-numeric',
        params: { key },
      }),
    }
  else if (type === 'email')
    return {
      value: emailPattern,
      message: 'common:validation.invalid-email-address',
    }
}

export const getDirtyData = (
  data: Record<string, any>,
  dirtyFields: Record<string, boolean>
): Record<string, any> => {
  const flattenData = flattenObject(['expired_date'], data)
  const flattenDirtyFields = flattenObject([], dirtyFields)
  const dirtyData: Record<string, any> = {}

  Object.entries(flattenData).forEach(([key, value]) => {
    if (flattenDirtyFields[key]) {
      dirtyData[key] = value
    }
  })

  return transformObject(dirtyData)
}

export const generateQueryString = (
  filter: IFilterListType,
  localFilterKey: EFilterList[],
  search: string,
  pagination: PaginationParams,
  sorting?: ColumnSort
) => {
  const filters: string[] = []
  const localFilter = {} as Record<EFilterList, any>
  let query = `?limit=${pagination.limit}&page=${pagination.page}&`

  Object.entries(filter).forEach(([key, value]) => {
    const selectedValues = value.selected
    if (selectedValues.length > 0) {
      if (!localFilterKey.includes(key as EFilterList)) {
        const selectedOptions = selectedValues.map((value: string) =>
          encodeURIComponent(value)
        )

        const filterString = `${key}:${selectedOptions.join(',')}:eq`
        filters.push(filterString)
      } else {
        localFilter[key as EFilterList] = value.selected
      }
    }
  })

  const expiredDataFilter = filters.filter(
    (filter) =>
      filter.includes(`status:${KycStatus.Expired}:eq`) ||
      filter.includes(`status:${KycStatus.Verified}:eq`)
  )

  if (expiredDataFilter.length > 0) {
    // Find the index of the filter to replace
    const index = filters.findIndex((filter) =>
      filter.includes(`status:${KycStatus.Expired}:eq`)
    )

    if (index !== -1) {
      // For KycStatus.Expired, the date should be less than or equal to today
      filters[index] = `expired_date:${dayjs()
        .utc()
        .format('YYYY-MM-DDTHH:mm')}:lte`
    }

    const verifiedIndex = filters.findIndex((filter) =>
      filter.includes(`status:${KycStatus.Verified}:eq`)
    )

    if (verifiedIndex !== -1) {
      // For KycStatus.Verified, the date should be greater than today
      filters[verifiedIndex] = `expired_date:${dayjs()
        .utc()
        .format('YYYY-MM-DDTHH:mm')}:gt`
    }
  }

  const isCommittingIndex = filters.findIndex((filter) =>
    filter.includes(`commit_status:${CommitStatus.Committing}:eq`)
  )

  if (isCommittingIndex !== -1) {
    filters[isCommittingIndex] = `staging.commited:true:eq`
  }

  if (filters.length > 0) {
    query += `filter=${filters.join(';')}&`
  }

  if (search.length > 0) {
    query += `search=${search}&`
  }

  if (sorting) {
    query += `order=${sorting.id}:${sorting.desc ? 'DESC' : 'ASC'}`
  }
  query.replace(
    'status:Expired:eq',
    `expired_date:${formatTimeToUTC(dayjs())}:lte`
  )

  return {
    query,
    localQuery: localFilter,
  }
}

export const generateKycStatus = (kyc: KycCredential): KycStatus => {
  if (kyc.commit_status === CommitStatus.Staged) return KycStatus.Pending
  const targetDate = dayjs(kyc.expired_date)
  const currentDate = dayjs()
  if (targetDate < currentDate) return KycStatus.Expired
  // if (kyc.commit_status === CommitStatus.Committed) return KycStatus.Verified
  return KycStatus.Verified
}

export const addKycStatusToCredentials = (
  list: KycCredentialList
): KycCredentialList =>
  list.map((item) => ({
    ...item,
    status: generateKycStatus(item),
  }))

export const localFilter = (filter: Record<string, any[]>, list: any[]) => {
  let filteredList = [...list]
  Object.entries(filter).forEach(([key, value]) => {
    filteredList = filteredList.filter((item) =>
      value?.toString().includes(item[key]?.toString())
    )
  })

  return filteredList
}

export const localSearch = (
  keys: string[],
  searchString: string,
  list: any[]
) => {
  const options = {
    threshold: 0.2,
    includeScore: true,
    keys,
  }
  const fuse = new Fuse(list, options)
  const result = fuse.search(searchString).map((item) => item.item)
  return result
}

export const generateI18nTransProps = (key: string): I18nTransProps => {
  if (isJSON(key)) {
    return JSON.parse(key)
  }
  return { key, params: {} }
}

export const generateErrorMassage = (
  accessorKey: string,
  errors: Record<string, any>
) => {
  if (!accessorKey || !errors) return ''
  const msg = flattenObject([accessorKey], errors)[accessorKey]?.message
  return generateI18nTransProps(msg)
}

export const getRuleFilteredData = (
  queryString: any,
  searchString: string,
  queriedRuleList: Rule[] | undefined
): Rule[] => {
  if (!queriedRuleList) return []

  const displaySearchResult =
    queryString.query.length > 0 ||
    Object.keys(queryString.localQuery).length > 0 ||
    searchString.length > 0

  if (!displaySearchResult) return queriedRuleList

  const filteredList = localFilter(queryString.localQuery, queriedRuleList)

  if (searchString.length > 0) {
    return localSearch(
      [
        'project_name',
        'cat_id',
        'origin_project_id',
        'project.projectId',
        'unit.vintageYear',
        'unit.serialNumberBlock',
      ] as Array<RuleEditFormKeys>,
      searchString,
      filteredList
    )
  }

  return filteredList
}
