export enum WalletStorageKeyEnum {
  ENCRYPTED_DATA = 'ENCRYPTED_DATA',
  ASSETS = 'ASSETS',
}

export interface EncryptedData {
  encryptedPassword: string
  cipherText: string
  salt: string
}

export interface Asset {
  symbol: string
  assetId: string
  imageUri?: string
  warehouseUnitId: string
  warehouseProjectId: string
}

export interface exportAssetDetail {
  assetId: string
  warehouseProjectId: string
  projectName: string
  vintageYear: number
  currentRegistry: string
  balance: string
}

export type Assets = Record<string, Asset>
