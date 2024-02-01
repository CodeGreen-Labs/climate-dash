import { CommitStatus, KycLevel } from '@/types/dataLayerTypes'

import i18n from './i18n'

export const kycLevelTranslator = (
  kycLevels: KycLevel[],
  level: any,
  translate: boolean = true
) => {
  if (!level) return ''
  const key =
    'kyc:level-type.' +
    kycLevels
      ?.filter((item) => item.level === parseInt(String(level)))?.[0]
      ?.name.toLowerCase()
      ?.split(' ')?.[0]

  return translate ? i18n.t(key) : key
}

export const commitStatusTranslator = (status: CommitStatus) => {
  return i18n.t('commit:commit-status-type.' + status)
}

export const kycStatusTranslator = (status: any) => {
  return i18n.t(`kyc:status-type.${status.toLocaleLowerCase()}`)
}
