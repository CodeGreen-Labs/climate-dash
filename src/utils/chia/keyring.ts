import {
  AugSchemeMPL,
  bigIntToBytes,
  bytesToBigInt,
  concatBytes,
  fromHex,
  hash256,
  JacobianPoint,
  PrivateKey,
} from '@rigidity/bls-signatures'
import { addressInfo, toAddress } from '@rigidity/chia'
import { Program } from '@rigidity/clvm'

import { chain } from '@/constants/network'

import { puzzles } from '../puzzles'

const groupOrder =
  0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n

export function onDerivePrivateKeyPath(
  privateKey: PrivateKey,
  path: number[],
  hardened: boolean
): PrivateKey {
  for (const index of path) {
    privateKey = (
      hardened
        ? AugSchemeMPL.deriveChildSk
        : AugSchemeMPL.deriveChildSkUnhardened
    )(privateKey, index)
  }
  return privateKey
}

export function onDerivePrivateKey(
  masterPrivateKey: PrivateKey,
  number: number = 0
): PrivateKey {
  return onDerivePrivateKeyPath(
    masterPrivateKey,
    [12381, 8444, 2, number],
    true
  )
}

export const getWalletPublicKey = (seed: Uint8Array, number: number = 0) => {
  const masterPrivateKey = PrivateKey.fromSeed(seed)
  const walletPrivateKey = onDerivePrivateKey(masterPrivateKey, number)
  const walletPublicKey = walletPrivateKey.getG1()

  return walletPublicKey
}

export function syntheticOffset(
  publicKey: JacobianPoint,
  hiddenPuzzleHash: Uint8Array
): bigint {
  const blob = hash256(concatBytes(publicKey.toBytes(), hiddenPuzzleHash))
  const result = bytesToBigInt(blob, 'big', true)
  return result > 0n ? result % groupOrder : (result % groupOrder) + groupOrder
}

export function syntheticPublicKey(
  publicKey: JacobianPoint,
  hiddenPuzzleHash: Uint8Array
): JacobianPoint {
  return JacobianPoint.fromBytes(
    puzzles.syntheticPublicKey.run(
      Program.fromList([
        Program.fromBytes(publicKey.toBytes()),
        Program.fromBytes(hiddenPuzzleHash),
      ])
    ).value.atom,
    false
  )
}

export function syntheticPrivateKey(
  privateKey: PrivateKey,
  hiddenPuzzleHash: Uint8Array
): PrivateKey {
  const privateExponent = bytesToBigInt(privateKey.toBytes(), 'big')
  const publicKey = privateKey.getG1()

  const _syntheticOffset = syntheticOffset(publicKey, hiddenPuzzleHash)
  const syntheticPrivateExponent =
    (privateExponent + _syntheticOffset) % groupOrder
  const blob = bigIntToBytes(syntheticPrivateExponent, 32, 'big')
  return PrivateKey.fromBytes(blob)
}

export const publicKeyToPuzzle = (publicKey: JacobianPoint): Program => {
  return puzzles.wallet.curry([
    Program.fromBytes(
      syntheticPublicKey(publicKey, Program.fromSource('(=)').hash()).toBytes()
    ),
  ])
}

export const puzzleHashToAddress = (puzzleHash?: string) => {
  if (!puzzleHash) {
    return
  }
  return toAddress(
    Program.fromHex(
      puzzleHash.startsWith('0x') ? puzzleHash.slice(2) : puzzleHash
    ).toBytes(),
    chain.prefix
  )
}

export const addressToPuzzleHash = (address: string): string => {
  return Program.fromBytes(addressInfo(address).hash).toHex()
}

export const publicKeyToCatPuzzle = (
  assetId: string,
  publicKey: JacobianPoint
) => {
  return puzzles.cat.curry([
    Program.fromBytes(puzzles.cat.hash()),
    Program.fromBytes(fromHex(assetId)),
    publicKeyToPuzzle(publicKey),
  ])
}

export const generateCatPuzzleHash = (
  assetId: string,
  publicKey?: JacobianPoint
) => {
  if (!publicKey) {
    return
  }

  return publicKeyToCatPuzzle(assetId, publicKey).hashHex()
}

export const shortenHash = (
  hash: string | undefined,
  head: number = 5,
  tail: number = 7,
  separator = '...'
) => {
  if (!hash) return hash
  if (head + tail >= hash.length) return hash
  return `${hash.slice(0, head)}${separator}${hash.slice(-tail)}`
}
