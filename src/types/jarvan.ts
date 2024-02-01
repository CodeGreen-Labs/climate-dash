import { Coin } from './coinTypes'

export interface CoinFromJarvan extends Omit<Coin, 'amount'> {
  amount: number
}
export interface CoinRecord {
  coin_record: {
    coin: CoinFromJarvan
    confirmed_block_index: number
    coinbase: boolean
    spent: boolean
    spent_block_index: number
    timestamp: number
    amount: number
  }
}

export interface GetPuzzleAndSolutionRecordRequest {
  coin_id: string
  height: number
}

export interface CoinSolution {
  coin: CoinFromJarvan
  puzzle_reveal: string
  solution: string
}
export interface GetPuzzleAndSolutionRecordResponse {
  coin_solution: CoinSolution
}

export interface CoinSpend {
  coin: CoinFromJarvan
  puzzle_reveal: string
  solution: string
}

export interface SpendBundle {
  aggregated_signature: string
  coin_spends: CoinSpend[]
  name?: string
}

export interface Tx {
  spend_bundle: SpendBundle
  name: string
  status: number
  header_hash: string
  height: number
  cost: number
  balance_changes: Record<string, unknown>
  created_at: string
  updated_at: string
  inmempool_at: string
  onchain_at: string
}

export interface TransactionsParams {
  puzzle_hash: string
  status?: number
  type?: number
  page: number
  size: number
}

export type TransactionsParamsV2 = {
  asset_id: string
} & Omit<TransactionsParams, 'puzzle_hash'>

export interface TransactionsByAssetParams extends TransactionsParams {
  asset_id: string
}

export interface AdditionalProp {
  asset_balance_change: Record<string, { amount: number; asset_type: string }>
}

export interface Metadata {
  amount: number
  asset_id: string
  from_puzzle_hash: string
  memos: string[]
  to_puzzle_hashes: string[]
}

export type BalanceChanges = Record<string, AdditionalProp>
export interface TransactionsResponseData extends Tx {
  balance_changes: BalanceChanges
  metadata: Metadata
  memos: string[]
}

export interface TransactionsResponse extends Tx {
  total: number
  list: TransactionsResponseData[]
}

export interface JarvanApiResponse<T> {
  code: number
  message: string
  data: T
}

export enum ITxStatus {
  TX_STATUS_UNSPECIFIED = 0,
  TX_STATUS_FAILED = 1,
  TX_STATUS_INIT = 2,
  TX_STATUS_PUSHED = 3,
  TX_STATUS_IN_MEMPOOL = 4,
  TX_STATUS_ON_CHAIN = 5,
}
export enum ITxType {
  TX_TYPE_UNSPECIFIED = 0,
  TX_TYPE_COINBASE = 1,
  TX_TYPE_STANDARD_TRANSFER = 2,
  TX_TYPE_CAT_MINT = 3,
  TX_TYPE_CAT_TRANSFER = 4,
  TX_TYPE_CAT_MELT = 5,
  TX_TYPE_OFFER1_SWAP = 6,
  TX_TYPE_UNKNOWN = 99,
}
