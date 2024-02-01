import { kycLevels } from '@/constants/kyc'
import { emailPattern } from '@/constants/regex'
import { CreateOrUpdateByListRes, Rule } from '@/types/dataLayerTypes'
import {
  ImportData,
  ImportDataList,
  ImportType,
  ImportTypeEnum,
} from '@/types/importDataTypes'
import { KycColumnAccessorKey } from '@/types/kycTypes'
import { RuleListItem } from '@/types/ruleTypes'

import { transformObject, validateWalletAddress } from './tableData'

function isValidEmail(email: string) {
  const regex = emailPattern
  return regex.test(email)
}
export const editAbleList: KycColumnAccessorKey[] = [
  'walletUser.email',
  'walletUser.contact_address',
  'document_id',
  'expired_date',
  'credential_level',
]
const validateStringField = (
  field: any,
  key: any,
  errors: ImportType<any>,
  validateFunc?: (val: string) => boolean
) => {
  if (!field) {
    errors[key] = ImportTypeEnum.EMPTY_ERROR
  } else if (
    typeof field !== 'string' ||
    (validateFunc && !validateFunc(field))
  ) {
    errors[key] = ImportTypeEnum.TYPE_ERROR
  }
}

const validateKyc = (kyc: any, key: string, errors: ImportType<any>) => {
  if (!kyc) errors.kyc = ImportTypeEnum.EMPTY_ERROR
  else if (!kycLevels[kyc]) errors[key] = ImportTypeEnum.TYPE_ERROR
}

export const validateNumberField = (
  field: any,
  key: any,
  errors: ImportType<any>
) => {
  if (typeof field !== 'number') {
    errors[key] = ImportTypeEnum.TYPE_ERROR
  } else if (!field) {
    errors[key] = ImportTypeEnum.EMPTY_ERROR
  }
}

const getKycTypes = (
  kycCredential: Record<string, any>,
  defaultType: ImportTypeEnum
): ImportType<KycColumnAccessorKey> => {
  const types: ImportData<KycColumnAccessorKey, any> = {
    'walletUser.ein': defaultType,
    'walletUser.public_key': defaultType,
    'walletUser.name': defaultType,
    'walletUser.contact_address': defaultType,
    'walletUser.email': defaultType,
    'kyc.name': defaultType,
    'kyc.level': defaultType,
    'kyc.description': defaultType,
    user: defaultType,
    kyc: defaultType,
    document_id: defaultType,
    expired_date: defaultType,
    last_modified_time: defaultType,
    commit_status: defaultType,
    status: defaultType,
  }
  // not editable fields in table
  if (defaultType !== ImportTypeEnum.UPDATE) {
    validateStringField(
      kycCredential['walletUser.ein'],
      'walletUser.ein',
      types
    )
    validateStringField(
      kycCredential['walletUser.name'],
      'walletUser.name',
      types
    )
  }
  // public_key not editable but must be checked
  validateStringField(
    kycCredential['walletUser.public_key'],
    'walletUser.public_key',
    types,
    validateWalletAddress
  )
  validateStringField(
    kycCredential['walletUser.contact_address'],
    'walletUser.contact_address',
    types
  )
  console.log(
    ' test:>> ',
    validateStringField(
      kycCredential['walletUser.contact_address'],
      'walletUser.contact_address',
      types
    )
  )
  validateStringField(
    kycCredential['walletUser.email'],
    'walletUser.email',
    types,
    isValidEmail
  )
  validateKyc(kycCredential.kyc, 'kyc', types)
  validateStringField(kycCredential.document_id, 'document_id', types)
  validateStringField(kycCredential.expired_date, 'expired_date', types)
  return types
}

export const validateKycCredentials = (
  kycCredentials: Record<KycColumnAccessorKey, any>[],
  previewData: CreateOrUpdateByListRes
): ImportDataList<KycColumnAccessorKey, any> => {
  let hasError =
    previewData?.error_create?.length > 0 ||
    previewData?.error_update?.length > 0
  const data = kycCredentials.map((kyc) => {
    const defaultType =
      previewData?.update?.includes(kyc?.['walletUser.public_key']) ||
      previewData?.error_update?.includes(kyc?.['walletUser.public_key'])
        ? ImportTypeEnum.UPDATE
        : ImportTypeEnum.CREATE
    const types = getKycTypes(kyc, defaultType)
    const transformKyc = transformObject(kyc)
    const errors =
      Object.values(types).includes(ImportTypeEnum.EMPTY_ERROR) ||
      Object.values(types).includes(ImportTypeEnum.TYPE_ERROR)

    if (errors) hasError = true
    return { ...transformKyc, types, defaultType, hasError }
  })

  return {
    data,
    hasError,
  }
}

export const getRuleTypes = (
  rule: Record<string, any>,
  defaultType: ImportTypeEnum
): ImportType<keyof RuleListItem> => {
  const type: ImportType<keyof RuleListItem> = {
    last_modified_time: defaultType,
    commit_status: defaultType,
    origin_project_id: defaultType,
    warehouse_project_id: defaultType,
    warehouse_unit_id: defaultType,
    issuance_id: defaultType,
    project_name: defaultType,
    cat_id: defaultType,
    kyc_receiving: defaultType,
    kyc_retirement: defaultType,
    kyc_sending: defaultType,
    vintage_year: defaultType,
    createdAt: defaultType,
    updatedAt: defaultType,
  }

  validateStringField(rule.last_modified_time, 'last_modified_time', type)
  validateStringField(rule.commit_status, 'commit_status', type)
  validateStringField(rule.origin_project_id, 'origin_project_id', type)
  validateStringField(rule.warehouse_project_id, 'warehouse_project_id', type)
  validateStringField(rule.warehouse_unit_id, 'warehouse_unit_id', type)
  validateStringField(rule.issuance_id, 'issuance_id', type)
  validateStringField(rule.project_name, 'project_name', type)
  validateStringField(rule.cat_id, 'cat_id', type, validateWalletAddress)
  validateKyc(rule.kyc_receiving, 'kyc_receiving', type)
  validateKyc(rule.kyc_retirement, 'kyc_retirement', type)
  validateKyc(rule.kyc_sending, 'kyc_sending', type)
  validateStringField(rule.vintage_year, 'vintage_year', type)

  return type
}

export const validateRules = (rules: Rule[]): ImportData<keyof Rule, any>[] => {
  return rules.map((rule) => {
    const defaultType = ImportTypeEnum.CREATE
    const types = getRuleTypes(rule, defaultType)
    const transformRule = transformObject(rule)

    return { ...transformRule, types }
  })
}
