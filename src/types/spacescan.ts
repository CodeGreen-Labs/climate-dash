export interface CatAsset {
  asset_id: string
  type: string
  asset_name: string
  symbol: string
  details: string
  description: string
  tags: string
  count: number
  balance: number
  sent: number
  received: number
  imageuri: string
}

export interface MyCatAssetsResponseData {
  count: number
  balance: number
  sent: number
  received: number
  cat_balance: Record<string, CatAsset>
}

export interface APIResponse<T> {
  status: string
  account: boolean
  data: T
  rowCount: number
}
