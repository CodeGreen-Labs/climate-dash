export type TransactionInfosType = {
  title: string
  field: any
  link?: boolean
}[]

export type TransactionInfosListType = {
  title: string
  list: TransactionInfosType
}[]

export type SendType = {
  address: string
  amount: string
  fee: string
  memo: string
}

export type RetireType = {
  amount: string
  fee: string
  beneficiary: string
  publicKey: string
}

export enum TransactionStep {
  Input = 'wallet:transaction.info',
  Review = 'common:review',
  Result = 'wallet:transaction.result.title',
}

export interface TransactionListItem {
  type: string
  status: string
  transaction_id: string
  project_name: string
  project_id: string
  cat_id: string
  last_modified_time: string
  quantity: number
}

export enum TransactionType {
  Transfer = 'wallet:history.type-is.transfer',
  Retirement = 'wallet:history.type-is.retirement-transaction',
}

export enum TransactionAlert {
  WithoutKYC = 'wallet:alert.not-completed-kyc',
  WithoutKYCSender = 'wallet:alert.not-completed-kyc-sender',
  WithoutRule = 'wallet:alert.no-rule',
  conflictKYC = 'kyc:alert.conflict.content',
}

export interface KycResults {
  senderKyc: boolean
  receiverKyc: boolean
  beneficiaryKyc: boolean
  allKyc: boolean
}

export interface Beneficiary {
  beneficiary: string
  publicKey: string
}
