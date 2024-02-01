import { TransactionType, WalletType } from '@codegreen-labs/api'

export { TransactionType, WalletType }

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

export interface ITransaction {
  amount: number
  confirmed: boolean
  confirmedAtHeight: number
  createdAtTime: number
  feeAmount: number
  memos: Record<string, string>
  name: string
  additions: {
    amount: number
    parentCoinInfo: string
    puzzleHash: string
  }[]
  removals: {
    amount: number
    parentCoinInfo: string
    puzzleHash: string
  }[]
  sent: number
  sentTo: any[]
  spendBundle: any
  toAddress: string
  toPuzzleHash: string
  tradeId: any
  type: number
  validTimes: {
    maxBlocksAfterCreated: any
    maxHeight: any
    maxSecsAfterCreated: any
    maxTime: any
    minBlocksSinceCreated: any
    minHeight: any
    minSecsSinceCreated: any
    minTime: any
  }
  walletId: number
}
