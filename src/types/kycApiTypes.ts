import { KycCredential, WalletUser } from './dataLayerTypes'
// will remove public_key from WalletUser once api is updated
type EditableWalletUser = Pick<WalletUser, 'email' | 'contact_address'>

export interface UpdateKycCredential
  extends Partial<
    Pick<KycCredential, 'credential_level' | 'expired_date' | 'document_id'>
  > {
  id: string
  walletUser: EditableWalletUser
}

export interface CreateKycCredential
  extends Omit<KycCredential, 'wallet_user_id' | 'commit_status' | 'id'> {}
