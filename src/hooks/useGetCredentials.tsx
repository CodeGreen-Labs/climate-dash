import { useParams } from 'react-router-dom'

import { IHistroy } from '@/components/Token/TokenHistory'
import {
  useGetCredentialByAddressQuery,
  useGetRuleByTokenIdQuery,
} from '@/services'
import type { Beneficiary } from '@/types/TransactionType'
import { prefix0x } from '@/utils/chia'
import { parseJSON } from '@/utils/form'
import { validateKycAgainstRule } from '@/utils/transaction'

interface Props extends IHistroy {}

const useGetCredentials = ({ from, to, memos, type }: Props) => {
  const { assetId } = useParams<{ assetId: string }>()

  const isRetirement = type === 'retirement'
  // TODO: get Beneficiary
  const Beneficiary = parseJSON<Beneficiary>(memos?.[1])

  const { data: senderCredential, isLoading: senderLoading } =
    useGetCredentialByAddressQuery(from || '', { skip: !from })
  const { data: receiverCredential, isLoading: receiverLoading } =
    useGetCredentialByAddressQuery(to || '', { skip: !to })
  const { data: beneficiaryCredential, isLoading: beneficiaryLoading } =
    useGetCredentialByAddressQuery(Beneficiary?.publicKey || '', {
      skip: !Beneficiary?.publicKey,
    })

  const { data: assetRule, isLoading: ruleLoading } = useGetRuleByTokenIdQuery(
    prefix0x(assetId || ''),
    {
      skip: !assetId,
    }
  )

  // The hook is loading if any of the queries are loading.
  const isLoading =
    senderLoading || receiverLoading || beneficiaryLoading || ruleLoading

  const kycValidationResults = validateKycAgainstRule(
    senderCredential?.credential_level,
    receiverCredential?.credential_level,
    beneficiaryCredential?.credential_level,
    assetRule || undefined,
    isRetirement
  )

  return {
    ...kycValidationResults,
    isLoading,
  }
}

export default useGetCredentials
