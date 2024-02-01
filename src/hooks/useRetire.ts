import {
  useGetOrgMetadataQuery,
  usePermissionlessRetireMutation,
} from '@/services'

import { IClimateToken } from './chia/useClimateTokens'
import useClimateWarehouseData from './useClimateWarehouseData'

const useRetire = (props: IClimateToken) => {
  const { unitData } = useClimateWarehouseData(props)
  const { data: { [props.assetId]: metadataRaw } = {} } =
    useGetOrgMetadataQuery(unitData?.orgUid || '', {
      skip: !unitData?.orgUid,
    })
  const metadata = JSON.parse(metadataRaw || '{}')
  const [_retire, { isLoading }] = usePermissionlessRetireMutation()
  const retire = async ({
    amount,
    fee,
    beneficiary,
    address,
  }: Pick<
    Parameters<typeof _retire>[0],
    'amount' | 'fee' | 'beneficiary' | 'address'
  >) => {
    return await _retire({
      assetId: props.assetId,
      metadata,
      amount,
      fee,
      beneficiary,
      address,
    }).unwrap()
  }
  return { retire, isLoading }
}

export default useRetire
