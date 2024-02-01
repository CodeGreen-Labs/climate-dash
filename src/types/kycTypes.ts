import { KycCredential, KycLevel, WalletUser } from './dataLayerTypes'

export enum KycStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  Expired = 'Expired',
}

export interface KycCredentialListItem extends KycCredential {
  status: KycStatus
}

export type KycCredentialUserKeys = keyof WalletUser extends infer Key
  ? Key extends string
    ? `walletUser.${Key}`
    : never
  : never

export type KycCredentialKycLevelKeys = keyof KycLevel extends infer Key
  ? Key extends string
    ? `kyc.${Key}`
    : never
  : never

export interface KycCredentialList extends Array<KycCredentialListItem> {}

export type KycColumnAccessorKey =
  | KycCredentialUserKeys
  | KycCredentialKycLevelKeys
  | keyof KycCredential
  | keyof KycCredentialListItem
