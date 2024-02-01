import {
  useGetLoggedInFingerprintQuery,
  useGetSyncStatusQuery,
  useGetWalletAddressesQuery,
} from '@codegreen-labs/api-react'
import { useMemo } from 'react'

const useChiaWallet = () => {
  const { data: syncStatus } = useGetSyncStatusQuery()
  const status = useMemo<'init' | 'synced' | 'syncing'>(() => {
    if (!syncStatus) {
      return 'init'
    }
    if (syncStatus.synced) {
      return 'synced'
    }
    return 'syncing'
  }, [syncStatus])
  // * assume walletId is 1

  const { data: fingerprint } = useGetLoggedInFingerprintQuery()
  const {
    data: walletAddresses,
    isLoading,
    isError,
  } = useGetWalletAddressesQuery(
    { fingerprints: [Number(fingerprint)], index: 0, count: 1 },
    {
      skip: !fingerprint,
    }
  )

  const address = walletAddresses?.[Number(fingerprint)]?.[0]?.address

  return {
    address,
    status,
    isNoFingerprint: isError && !isLoading,
    isLoading,
  }
}

export default useChiaWallet
