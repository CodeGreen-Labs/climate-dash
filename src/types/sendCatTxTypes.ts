export enum SendCatTxError {
  Insufficient_xch_balance = 'Insufficient XCH balance to pay fee for this transaction',
  Insufficient_asset_coin = 'Insufficient asset coin balance to send for this transaction',
}

export interface SpendableCatCoin {
  amount: BigInt
  parent_coin_info: string
  puzzle_hash: string
  lineage_proof: {
    parent_name: string
    inner_puzzle_hash: string
    amount: bigint
  }
}
