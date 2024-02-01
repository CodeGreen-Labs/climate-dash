import type { CoinReturn, FeeRate } from '@/types/coinSelectorTypes'
import type { Coin } from '@/types/coinTypes'

import accumulative from './accumulative'
import blackjack from './blackjack'

export function coinScore<T extends Coin>(x: T) {
  return x.amount
}

export default function coinSelector<T extends Coin, O extends Coin>(
  coins: T[],
  outputs: O[],
  feeRate: FeeRate = 0n
): CoinReturn<T, O> {
  coins = coins.sort(function (a, b) {
    return Number(coinScore<T>(b)) - Number(coinScore<T>(a))
  })
  const base = blackjack(coins, outputs, feeRate)

  if (base?.coins) return base
  return accumulative(coins, outputs, feeRate)
}
