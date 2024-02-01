import type { WalletBalance, WalletType } from '@codegreen-labs/api'
export interface IWallet {
  id: number
  name: string
  type: WalletType
  meta: {
    assetId: string
    name: string
  }
}

export interface ICat {
  assetId: string
  name: string
  symbol: string
}

export interface IStrayCat {
  assetId: string
  firstSeenHeight: number
  name: string
  senderPuzzleHash: string
}

export type WalletBalances = Record<number, WalletBalance>
