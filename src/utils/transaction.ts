import { Rule } from '@/types/dataLayerTypes'
import { BalanceChanges } from '@/types/jarvan'
import type { KycCredentialListItem } from '@/types/kycTypes'
import { KycResults, TransactionAlert } from '@/types/TransactionType'
import { prefix0x, puzzleHashToAddress } from '@/utils/chia'

import i18n from './i18n'

type CheckType = 'retirement' | 'receiving'

export const handleOnCheckKyc = (
  receiver: KycCredentialListItem | undefined,
  receiverAddress: string,
  sender: KycCredentialListItem | undefined,
  senderAddress: string,
  rule: Rule | undefined,
  assetId: string,
  type: CheckType
): { verify: boolean; message?: string } => {
  if (!receiver?.credential_level) {
    return {
      verify: false,
      message: i18n.t(TransactionAlert.WithoutKYC, {
        address: receiverAddress,
      }),
    }
  }

  if (!sender?.credential_level) {
    return {
      verify: false,
      message: i18n.t(TransactionAlert.WithoutKYCSender, {
        address: senderAddress,
      }),
    }
  }

  let ruleKycValue: number | undefined

  switch (type) {
    case 'retirement':
      ruleKycValue = rule?.kyc_retirement
      break
    case 'receiving':
      ruleKycValue = rule?.kyc_receiving
      break
    default:
      throw new Error('Invalid check type provided.')
  }

  if (!ruleKycValue) {
    return {
      verify: false,
      message: i18n.t(TransactionAlert.WithoutRule, { assetId }),
    }
  }

  if (
    receiver?.credential_level < ruleKycValue ||
    sender?.credential_level < ruleKycValue
  ) {
    return {
      verify: false,
      message: i18n.t(TransactionAlert.conflictKYC),
    }
  }

  return { verify: true }
}

export const validateKycAgainstRule = (
  senderKyc: number | undefined,
  receiverKyc: number | undefined,
  beneficiaryKyc: number | undefined,
  rule: Rule | undefined,
  isRetirement: boolean
): KycResults => {
  if (!rule) {
    return {
      senderKyc: false,
      receiverKyc: false,
      beneficiaryKyc: false,
      allKyc: false,
    }
  }

  const senderKycResult = senderKyc
    ? senderKyc >= (rule.kyc_sending || 0)
    : false
  const receiverKycResult = isRetirement
    ? true
    : receiverKyc
    ? receiverKyc >= (rule.kyc_receiving || 0)
    : false

  // Only check beneficiaryKyc if isRetirement is true
  const beneficiaryKycResult =
    isRetirement && beneficiaryKyc
      ? beneficiaryKyc >= (rule.kyc_retirement || 0)
      : !isRetirement // If isRetirement is false, default to true so it doesn't affect the allKycResult

  const allKycResult =
    senderKycResult && receiverKycResult && beneficiaryKycResult

  return {
    senderKyc: senderKycResult,
    receiverKyc: receiverKycResult,
    beneficiaryKyc: isRetirement ? beneficiaryKycResult : false, // If not isRetirement, always set to false
    allKyc: allKycResult,
  }
}

export const findSenderAndReceiver = (
  data: BalanceChanges,
  catId: string | undefined
): { sender?: string; receiver?: string } => {
  let sender: string | undefined
  let receiver: string | undefined
  for (const address in data) {
    const change = data[address].asset_balance_change[prefix0x(catId)]

    if (change) {
      if (!change.amount) {
        sender = address
        receiver = address
      } else if (change.amount < 0) {
        sender = address
      } else if (change.amount > 0) {
        receiver = address
      }
    }
  }

  return {
    sender: puzzleHashToAddress(sender),
    receiver: puzzleHashToAddress(receiver),
  }
}
