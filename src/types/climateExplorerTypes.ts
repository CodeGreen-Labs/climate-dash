import type { Org, Project, Unit } from './climateWarehouseTypes'

interface Token {
  org_uid: string
  warehouse_project_id: string
  vintage_year: number
  sequence_num: number
  index: string
  public_key: string
  asset_id: string
  tokenization: {
    mod_hash: string
    public_key: string
  }
  detokenization: {
    mod_hash: string
    public_key: string
    signature: string
  }
  permissionless_retirement: {
    mod_hash: string
    signature: string
  }
}

export interface Activity {
  metadata: Record<string, any>
  beneficiary_name: string | null
  beneficiary_address: string | null
  beneficiary_puzzle_hash: string | null
  coin_id: string
  height: number
  amount: number
  mode: string
  timestamp: number
  token: Token
  cw_unit: Unit
  cw_org: Org
  cw_project: Project
}

export interface ActivityResponse {
  activities: Activity[]
  total: number
}

export interface ActivityRequest {
  search?: string
  search_by?: 'onchain_metadata' | 'climate_warehouse'
  minHeight?: number
  sort?: string
  page?: number
  size?: number
  mode?: 'tokenization' | 'detokenization' | 'permissionless_retirement'
}
