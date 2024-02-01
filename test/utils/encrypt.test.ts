import { describe, expect, it } from 'vitest'

import {
  bytesToString,
  decrypt,
  encrypt,
  stringToBytes,
} from '../../src/utils/chia/encrypt'

const areEqual = (first, second) =>
  first.length === second.length &&
  first.every((value, index) => value === second[index])

describe('bytesToString', () => {
  it('converts Uint8Array to base64 string', async () => {
    const bytes = new Uint8Array([104, 101, 108, 108, 111])
    const result = bytesToString(bytes)
    expect(result).toEqual('aGVsbG8=')
  })
})

describe('stringToBytes', () => {
  it('converts base64 string to Uint8Array', async () => {
    const str = 'aGVsbG8='
    const result = stringToBytes(str)
    expect(areEqual(new Uint8Array([104, 101, 108, 108, 111]), result)).toBe(
      true
    )
  })
})

describe('Encryption and Decryption', () => {
  const password = 'YFOs3)NntK,wH#=ws4>eDa*XM'
  const plainText = 'Hello CodeGreen!!'

  it('should encrypt and decrypt successfully', async () => {
    const encryptedData = await encrypt(password, plainText)
    const { salt, cipherText } = encryptedData

    expect(salt).toBeDefined()
    expect(cipherText).toBeDefined()

    const decryptedText = await decrypt(salt, cipherText, password)

    expect(decryptedText).toEqual(plainText)
  })
})
