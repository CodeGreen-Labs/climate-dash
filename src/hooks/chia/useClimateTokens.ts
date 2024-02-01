import { WalletType } from '@codegreen-labs/api'
import { useGetWalletsQuery } from '@codegreen-labs/api-react'
import { useMemo } from 'react'

import { useGetAllUnitsQuery } from '@/services'
import { IWallet } from '@/types/chiaApi'
import { prefix0x } from '@/utils/chia'

import useChiaWallet from './useChiaWallet'

export interface IClimateToken {
  walletId: number
  assetId: string
  unitId: string
  projectId: string
}

const useClimateTokens = () => {
  const { status } = useChiaWallet()
  const skip = status !== 'synced'

  const { data: wallets, isLoading: isWalletsLoading } = useGetWalletsQuery(
    undefined,
    {
      skip,
    }
  )

  const { data: units, isLoading: isUnitsLoading } = useGetAllUnitsQuery(
    {},
    {
      skip,
    }
  )

  const createClimateToken = (
    wallet: IWallet,
    unit: {
      warehouseUnitId: string
      issuance: {
        warehouseProjectId: string
      }
    }
  ): IClimateToken => {
    return {
      walletId: wallet.id,
      assetId: wallet.meta?.assetId,
      unitId: unit?.warehouseUnitId,
      projectId: unit.issuance?.warehouseProjectId,
    }
  }

  const isLoading = isWalletsLoading || isUnitsLoading

  const climateTokens = useMemo(() => {
    if (isLoading) return []
    const climateTokens: IClimateToken[] = []
    for (const wallet of wallets as IWallet[]) {
      if (![WalletType.STANDARD_WALLET, WalletType.CAT].includes(wallet.type))
        continue
      const unit = units?.find(
        (unit) =>
          prefix0x(wallet.meta?.assetId) ===
          prefix0x(unit?.marketplaceIdentifier || '')
      )
      // check if wallet is climate token
      if (!unit) continue
      climateTokens.push(createClimateToken(wallet, unit))
    }
    return climateTokens
  }, [wallets, units])

  return {
    climateTokens,
    isLoading,
  }
}

export default useClimateTokens
