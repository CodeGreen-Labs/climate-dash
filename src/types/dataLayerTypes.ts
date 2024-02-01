import dayjs from 'dayjs'

import { Issuance, Project, Staging, Unit } from './climateWarehouseTypes'

export enum CommitStatus {
  Staged = 'staged',
  Committing = 'committing',
  Committed = 'committed',
}

export interface TimeStamp {
  createdAt: string
  updatedAt: string
}

export interface KycLevel extends TimeStamp {
  id: string
  level: number
  name: string
  description?: string
}

export interface ValidationError {
  loc: string[]
  msg: string
  type: string
}

export interface ResponseError {
  message: string
  success: boolean
  error?: any
  status?: any
  data?: any
}

export interface ResponseWithData<T> {
  success: boolean
  data: T
}

export interface Response {
  success: boolean
  message: string
}

export interface ResponseWithMsg {
  success: number
  message: string
}
export interface DataWithCount<T> {
  count: number
  rows: T
}

export interface WalletUser extends TimeStamp {
  id: string
  ein: string
  public_key: string
  name: string
  contact_address: string
  email: string
  orgUid: string
}

export interface KycCredential extends TimeStamp {
  id: string
  walletUser: WalletUser
  credential_level: number
  document_id: string
  expired_date: dayjs.Dayjs | string
  wallet_user_id: string
  orgUid: string
  commit_status: CommitStatus
  staging?: Staging<KycCredential>
}

export interface Rule {
  origin_project_id: string
  warehouse_project_id: string
  warehouse_unit_id: string
  issuance_id: string
  cat_id: string
  kyc_receiving: number
  kyc_retirement: number
  kyc_sending: number
  commit_status?: CommitStatus
  last_modified_time?: string
  createdAt?: string
  updatedAt?: string
  unit: Unit
  project: Project
  issuance: Issuance
  staging?: Staging<Rule>
}

export type RuleList = Rule[]

export interface DataLayerData<T> {
  key: string
  value: T
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface DashboardData {
  wallet: {
    total_cases: number
    weekly_updates: number
    pending_cases: number
    expired_cases: number
  }
  rule_management: {
    total_cases: number
    weekly_updates: number
    pending_cases: number
  }
}

export enum CommitTable {
  Wallet = 'Credentials',
  Rule = 'Rules',
}

export interface CommitParams {
  table: CommitTable
  author: string
  comment: string
  ids: string[]
  fee?: number
}

export interface CreateOrUpdateByList<T> {
  method: 'preview' | 'upset'
  values: T[]
}

export interface CreateOrUpdateByListRes {
  create: string[]
  update: string[]
  error_create: string[]
  error_update: string[]
  failed: string[]
}

export interface GetStagingResponse {
  id: number
  uuid: string
  table: string
  action: string
  commited: boolean
  failedCommit: boolean
  isTransfer: boolean
  createdAt: string
  updatedAt: string
  diff: any
}
