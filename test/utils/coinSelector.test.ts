import { describe, it } from 'vitest'

import coinSelector from '../../src/utils/coinSelector'

describe('coinSelect', async () => {
  const spendableCoinList = [
    {
      amount: 1000000n,
      parent_coin_info:
        '0x52b549974e2a3a7545dd1d320530034518edbd8a1cd74dba7a138cd984409c19',
      puzzle_hash:
        '0xd53527f18be58a71feb2177a9f6bd6141177335a5eb16079a32f1e814a70ed30',
    },
  ]
  it('Should be select coins correctly', async ({ expect }) => {
    const coinSelected = await coinSelector(spendableCoinList, [
      {
        amount: BigInt(1000),
        parent_coin_info: '',
        puzzle_hash: '',
      },
    ])
    expect(coinSelected.outputs.length).toBeGreaterThan(0)
    expect(coinSelected.outputs[0].amount).toEqual(BigInt(1000))
    const sum = coinSelected.outputs.reduce(
      (a: any, b: { amount: any }) => a + b.amount,
      BigInt(0)
    )
    expect(sum).toEqual(spendableCoinList[0].amount)
  })
})
