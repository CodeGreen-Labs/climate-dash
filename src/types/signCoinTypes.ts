import type { Program } from '@rigidity/clvm'

import type { Coin } from './coinTypes'

export interface XCHPayload {
  puzzle: Program
  amount: bigint
  memos?: string[]
  fee?: bigint
  targetPuzzleHash: string
  spendableCoinList: Coin[]
  additionalConditions?: Program[]
}
