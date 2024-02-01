import { describe, expect, test } from 'vitest'

import { addressToPuzzleHash } from '../../src/utils/chia'
import { getSenderAndReceiver } from '../../src/utils/praseHistory'

describe('getSenderAndReceiver', () => {
  test('should return correct sender and receiver for given balance_changes', () => {
    const balance_changes = {
      '0x068a63ece551c597be7c86d06186c3fc2a8c5a760a89a1f00d0d7226f1490c3b': {
        asset_balance_change: {
          '': {},
          '0x164de1d017ebcf5f3bdf52858abf21b067ba4352d6921b4d2fd2fa3be395f01f':
            {
              amount: -1000000,
            },
        },
      },
      '0x57dfc8e911a05b38675c9ff952cf1f34847a976d21101d6077e9b56253dceb1b': {
        asset_balance_change: {
          '0x164de1d017ebcf5f3bdf52858abf21b067ba4352d6921b4d2fd2fa3be395f01f':
            {
              amount: 1000000,
            },
        },
      },
    }

    const puzzleHash =
      '0x068a63ece551c597be7c86d06186c3fc2a8c5a760a89a1f00d0d7226f1490c3b'
    const assetId =
      '0x164de1d017ebcf5f3bdf52858abf21b067ba4352d6921b4d2fd2fa3be395f01f'

    const result = getSenderAndReceiver(balance_changes, puzzleHash, assetId)

    const senderPuzzleHash = addressToPuzzleHash(result.sender)
    const receiverPuzzleHash = addressToPuzzleHash(result.receiver)

    expect(senderPuzzleHash).toEqual(
      '068a63ece551c597be7c86d06186c3fc2a8c5a760a89a1f00d0d7226f1490c3b'
    )
    expect(receiverPuzzleHash).toEqual(
      '57dfc8e911a05b38675c9ff952cf1f34847a976d21101d6077e9b56253dceb1b'
    )
  })
})
