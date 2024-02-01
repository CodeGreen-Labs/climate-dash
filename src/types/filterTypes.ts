import { PaginationParams } from './climateWarehouseTypes'
import { FilterOptions } from './commonTypes'

export interface IFilter {
  selected: string[]
  options: FilterOptions[]
  title: string
  subTitle?: string
  multiple?: boolean
}

export enum EFilterList {
  KYC_LEVEL = 'credential_level',
  KYC_STATUS = 'status',
  KYC_RETIREMENT = 'kyc_retirement',
  KYC_RECEIVING = 'kyc_receiving',
  KYC_SENDING = 'kyc_sending',
  // mark until kyc commit status is ready
  COMMIT_STATUS = 'commit_status',
}

export type IFilterListType = Record<string, IFilter> & PaginationParams

export enum EFilter {
  KYC_FILTER = 'kycFilter',
  RULE_FILTER = 'ruleFilter',
  WALLET_HISTORY_FILTER = 'walletHistoryFilter',
}
