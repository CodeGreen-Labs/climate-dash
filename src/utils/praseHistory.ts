import type { AdditionalProp } from '@/types/jarvan'
import { prefix0x, puzzleHashToAddress } from '@/utils/chia'

export const getSenderAndReceiver = (
  balance_changes: Record<string, AdditionalProp>,
  puzzleHash?: string,
  assetId?: string
) => {
  const myPuzzleHash = prefix0x(puzzleHash)

  const asset_balance_change =
    balance_changes?.[myPuzzleHash]?.asset_balance_change
  const amount = asset_balance_change?.[prefix0x(assetId)]?.amount

  const anotherPuzzleHash =
    Object.entries(balance_changes).find(([key, value]) => {
      const checkAnotherPuzzleHash =
        Object.values(balance_changes).length === 1
          ? true
          : key !== myPuzzleHash
      const assetBalanceChange = value.asset_balance_change
      return (
        checkAnotherPuzzleHash &&
        Object.keys(assetBalanceChange).some((key) => key === prefix0x(assetId))
      )
    })?.[0] || ''

  const sender = puzzleHashToAddress(
    amount >= 0 ? anotherPuzzleHash : myPuzzleHash
  )
  const receiver = puzzleHashToAddress(
    amount >= 0 ? myPuzzleHash : anotherPuzzleHash
  )

  return {
    sender,
    receiver,
  }
}
