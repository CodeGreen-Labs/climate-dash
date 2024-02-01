export interface Coin {
  amount: bigint
  parent_coin_info: string
  puzzle_hash: string
  name?: string
}

export interface SpendableCoin {
  coin: Coin
  confirmed_block_index: number
  timestamp: number
}

export interface CoinSpend {
  coin: Coin
  puzzle_reveal: string
  solution: string
}

export interface Primary {
  puzzlehash: string
  amount: bigint
  memos?: string[]
}

export interface LineageProof extends CoinSpend {
  lineageProof: {
    parent_name: string
    inner_puzzle_hash: string
    amount: bigint
  }
}
