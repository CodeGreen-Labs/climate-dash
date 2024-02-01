import type { Org } from '@/types/climateWarehouseTypes'
import { CommitStatus, DataLayerData } from '@/types/dataLayerTypes'

export const extractListValue = <T>(data: DataLayerData<T>[]) => {
  return data.map((item) => item.value)
}

export const extractListColumn = <T>(data: T[]) => {
  return data.map((item) => ({ ...item, commit_status: 3 }))
}

export const findHomeOrg = (
  orgData: Record<string, Org> | undefined
): string => {
  if (!orgData) return ''

  for (const orgUid in orgData) {
    if (Object.prototype.hasOwnProperty.call(orgData, orgUid)) {
      const org = orgData[orgUid]
      if (org.isHome === true) {
        return orgUid
      }
    }
  }
  return ''
}

export const extractStagingData = (rows: Array<any>) => {
  return rows.map((row) => {
    const staging = row.staging
    if (staging) {
      const data = staging.data
      return {
        ...row,
        ...data,
        updatedAt: staging.updatedAt,
        commit_status: staging.commited
          ? CommitStatus.Committing
          : CommitStatus.Staged,
      }
    }
    return row
  })
}
