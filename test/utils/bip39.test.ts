import { describe, expect, it } from 'vitest'
import wordLists from 'web-bip39/wordlists/english'

import {
  generateRandomMnemonic,
  generateSeedFromMnemonic,
  validateMnemonicPhrase,
} from '../../src/utils/chia'

describe('Mnemonic Functions', () => {
  const exampleMnemonic =
    'crash lottery basket zero leg rice crunch force volcano toilet nasty baby'

  it('should generate a random mnemonic', async () => {
    const mnemonic = await generateRandomMnemonic()
    expect(mnemonic).toBeDefined()
    expect(mnemonic.split(' ')).toHaveLength(24)
  })

  it('should validate a mnemonic', async () => {
    const valid = await validateMnemonicPhrase(exampleMnemonic, wordLists)
    expect(valid).toBe(true)
  })

  it('should generate a seed from a mnemonic', async () => {
    const seed = await generateSeedFromMnemonic(exampleMnemonic, 'password')
    expect(seed).toBeDefined()
    expect(seed).toBeInstanceOf(Uint8Array)
  })
})
