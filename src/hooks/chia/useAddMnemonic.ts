import {
  useAddPrivateKeyMutation,
  useGenerateMnemonicMutation,
  useLogInMutation,
} from '@codegreen-labs/api-react'

interface IParams {
  mnemonic: string
  label?: string
  logIn?: boolean
}

const useAddMnemonic = () => {
  const [addKey] = useAddPrivateKeyMutation()
  const [login] = useLogInMutation()
  const [generateMnemonic] = useGenerateMnemonicMutation()

  const addMnemonic = async ({ logIn = true, ...rest }: IParams) => {
    const fingerprint = Number(await addKey(rest).unwrap())
    if (logIn) {
      await login({ fingerprint }).unwrap()
    }
  }

  return { addMnemonic, generateMnemonic }
}

export default useAddMnemonic
