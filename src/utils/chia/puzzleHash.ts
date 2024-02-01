import { addressInfo, toAddress } from '@rigidity/chia'
import { Program } from '@rigidity/clvm'

import { chain } from '@/constants/network'

export const addressToPuzzleHash = (address: string): string => {
  return Program.fromBytes(addressInfo(address).hash).toHex()
}
export const puzzleHashToAddress = (puzzleHash?: string) => {
  if (!puzzleHash) return ''
  return toAddress(
    Program.fromHex(
      puzzleHash.startsWith('0x') ? puzzleHash.slice(2) : puzzleHash
    ).toBytes(),
    chain.prefix
  )
}
