import { KycLevel } from '@/types/dataLayerTypes'
import { KycColumnAccessorKey } from '@/types/kycTypes'
import i18n from '@/utils/i18n'

type KycLevels = {
  [key: string]: {
    key: string
    label: string
  }
}

const kycLevels: KycLevels = {
  '0': { key: '0', label: 'kyc:level-type.none' },
  '1': { key: '1', label: 'kyc:level-type.basic' },
  '2': { key: '2', label: 'kyc:level-type.enhanced' },
}

export const kycLevelList: Partial<KycLevel>[] = [
  {
    level: 1,
    name: 'basic',
    description: 'Basic KYC',
  },
  {
    level: 2,
    name: 'enhanced',
    description: 'Enhance KYC',
  },
]

const kycImportDataHeader = [
  'walletUser.name',
  'walletUser.email',
  'walletUser.ein',
  'walletUser.public_key',
  'walletUser.contact_address',
  'kyc',
  'document_id',
  'expired_date',
] as KycColumnAccessorKey[]

const kycImportDataExample = [
  {
    kyc: i18n.t('export-kyc-example'),
    user: {
      name: 'name',
      public_key: 'public_key',
      ein: 'ein',
      email: 'test@example.com',
      contact_address: 'update address',
    },
    document_id: 'test123',
    expired_date: '2026-08-25',
  },
]

const kycEditAbleList: KycColumnAccessorKey[] = [
  'walletUser.email',
  'walletUser.contact_address',
  'document_id',
  'expired_date',
  'credential_level',
]

export { kycEditAbleList, kycImportDataExample, kycImportDataHeader, kycLevels }
