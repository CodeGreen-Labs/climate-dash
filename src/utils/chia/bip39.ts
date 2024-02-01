import { generateMnemonic, mnemonicToSeed, validateMnemonic } from 'web-bip39'
import wordLists from 'web-bip39/wordlists/english'

export const generateRandomMnemonic = async (
  wordList: string[] = wordLists,
  stringLength: 128 | 256 = 256
): Promise<string> => {
  const mnemonic: string = await generateMnemonic(wordList, stringLength)
  return mnemonic
}

export const validateMnemonicPhrase = async (
  mnemonic: string,
  wordList: string[] = wordLists
): Promise<boolean> => {
  const valid: boolean = await validateMnemonic(mnemonic, wordList)
  return valid
}

export const generateSeedFromMnemonic = async (
  mnemonic: string,
  password?: string
): Promise<Uint8Array> => {
  const seed = await mnemonicToSeed(mnemonic, password)
  return seed
}
