import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'

import {
  useGetCredentialByAddressQuery,
  useGetRuleByTokenIdQuery,
} from '@/services'
import { prefix0x, puzzleHashToAddress } from '@/utils/chia'

const ViolationAlert = ({
  publicKey,
  assetId,
}: {
  publicKey: string
  assetId: string
}) => {
  const address = puzzleHashToAddress(publicKey) ?? ''

  const { data: credential } = useGetCredentialByAddressQuery(address, {
    skip: !publicKey,
  })

  const { data: assetRule } = useGetRuleByTokenIdQuery(
    prefix0x(assetId || ''),
    {
      skip: !assetId,
    }
  )

  const isViolated =
    credential &&
    assetRule &&
    credential?.credential_level >= assetRule?.kyc_retirement

  return <>{!isViolated && <ReportGmailerrorredIcon color="warning" />}</>
}

export default ViolationAlert
