import {
  AugSchemeMPL,
  concatBytes,
  encodeInt,
  fromHex,
  hash256,
  JacobianPoint,
  PrivateKey,
} from '@rigidity/bls-signatures'
import { sanitizeHex } from '@rigidity/chia'
import { Program } from '@rigidity/clvm'

import { chains } from '@/constants/network'
import { ChainEnum } from '@/types/chia'
import type { Coin, CoinSpend } from '@/types/coinTypes'

import { puzzles } from '../puzzles'
import {
  onDerivePrivateKey,
  syntheticPrivateKey,
  syntheticPublicKey,
} from './keyring'

const defaultHiddenPuzzleHash = puzzles.defaultHidden.hash()

export const generateCoinName = (coin: Coin) =>
  hash256(
    concatBytes(
      fromHex(sanitizeHex(coin.parent_coin_info)),
      fromHex(sanitizeHex(coin.puzzle_hash)),
      encodeInt(Number(coin.amount || 0))
    )
  )

export const signCoinSpend = (
  coinSpend: CoinSpend,
  aggSigMeExtraData: Uint8Array,
  privateKey: PrivateKey,
  walletPublicKey: JacobianPoint,
  keyPairs: Map<JacobianPoint, PrivateKey> = new Map()
): JacobianPoint => {
  if (!privateKey.getG1().equals(walletPublicKey)) {
    throw new Error('Incorrect private key.')
  }
  const signatures: Array<JacobianPoint> = []
  const finalKeyPairs = new Map(keyPairs)
  const _syntheticPublicKey = syntheticPublicKey(
    walletPublicKey,
    defaultHiddenPuzzleHash
  )

  const _syntheticPrivateKey = syntheticPrivateKey(
    privateKey,
    defaultHiddenPuzzleHash
  )
  finalKeyPairs.set(_syntheticPublicKey, _syntheticPrivateKey)

  const conditions = Program.deserializeHex(
    sanitizeHex(coinSpend.puzzle_reveal)
  )
    .run(Program.deserializeHex(sanitizeHex(coinSpend.solution)))
    .value.toList()
  const pairs: Array<[JacobianPoint, Uint8Array]> = []
  for (const item of conditions.filter(
    (condition) =>
      condition.first.isAtom && [49, 50].includes(condition.first.toInt())
  )) {
    const condition = item.toList()
    if (condition.length !== 3) {
      throw new Error('Invalid condition length.')
    } else if (!condition[1].isAtom || condition[1].atom.length !== 48) {
      throw new Error('Invalid public key.')
    } else if (!condition[2].isAtom || condition[2].atom.length > 1024) {
      throw new Error('Invalid message.')
    }

    pairs.push([
      JacobianPoint.fromBytesG1(condition[1].atom),
      concatBytes(
        condition[2].atom,
        ...(condition[0].toInt() === 49
          ? []
          : [generateCoinName(coinSpend.coin), aggSigMeExtraData])
      ),
    ])
  }
  const pks: JacobianPoint[] = []
  const messages: Uint8Array[] = []
  for (const [publicKey, message] of pairs) {
    let privateKey: PrivateKey | null = null
    for (const keyPair of finalKeyPairs) {
      if (keyPair[0].equals(publicKey)) privateKey = keyPair[1]
      pks.push(publicKey)
    }
    if (!privateKey) {
      throw new Error(`Could not find private key for ${publicKey.toHex()}.`)
    }
    messages.push(message)
    const signature = AugSchemeMPL.sign(privateKey, message)
    signatures.push(signature)
  }
  return AugSchemeMPL.aggregate(signatures)
}

export const onGetAggregateSignature = (
  chain: ChainEnum,
  coinSpends: CoinSpend[],
  seed: Uint8Array
) => {
  const agg_sig_me_additional_data = chains[chain].agg_sig_me_additional_data

  const signatures = AugSchemeMPL.aggregate(
    coinSpends
      .filter((spend) => spend.coin.amount)
      .map((item) =>
        signCoinSpend(
          item,
          fromHex(sanitizeHex(agg_sig_me_additional_data)),
          onDerivePrivateKey(PrivateKey.fromSeed(seed)),
          onDerivePrivateKey(PrivateKey.fromSeed(seed)).getG1()
        )
      )
  )
  return signatures
}
