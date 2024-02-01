import { Rule } from '@/types/dataLayerTypes'
import i18n from '@/utils/i18n'

export const ruleImportDataHeader = [
  'cat_id',
  'issuance_id',
  'project_name',
  'kyc_receiving',
  'kyc_retirement',
  'kyc_sending',
  'origin_project_id',
  'vintage_year',
  'warehouse_unit_id',
] as Array<keyof Rule>

export const ruleEditAbleList = ['kyc_receiving', 'kyc_retirement']

export const ruleImportDataExample = [
  {
    cat_id: 'cat_id',
    issuance_id: 'issuance_id',
    kyc_receiving: `${i18n.t('export-kyc-example')}`,
    kyc_retirement: `${i18n.t('export-kyc-example')}`,
    kyc_sending: `${i18n.t('export-kyc-example')}`,
    origin_project_id: 'origin_project_id',
    vintage_year: 2023,
    warehouse_unit_id: 'warehouse_unit_id',
    project_name: 'project_name',
  },
]
