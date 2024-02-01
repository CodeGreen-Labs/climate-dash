import { Coin } from './coinTypes'

export interface CoinTarget {
  coin?: Coin
}

export enum SendCatTxError {
  Insufficient_xch_balance = 'Insufficient XCH balance to pay fee for this transaction',
  Insufficient_asset_coin = 'Insufficient asset coin balance to send for this transaction',
}

export type FeeRate = bigint

export interface CoinReturn<T extends Coin, O extends Coin> {
  coins?: T[]
  outputs?: O[]
  fee?: bigint
}

export type CoinSelctFun<T extends Coin, O extends Coin> = (
  coins: T[],
  output: O[],
  feeRate: bigint
) => { coins?: T[]; output?: O[]; feeRate?: bigint }
