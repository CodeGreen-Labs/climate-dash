export enum Role {
  ADMIN = 'admin',
  REGISTRY = 'registry',
  KYC_PROVIDER = 'kycProvider',
  WALLET_USER = 'walletUser',
  UNAUTHENTICATED = 'unauthenticated',
}

export const defaultRole = Role.ADMIN as const

export enum Feature {
  KYC = 'kyc',
  RULE = 'rule',
  WALLET = 'wallet',
  EXPLORER = 'explorer',
  CLIMATE = 'climate',
}

type RolePermissions = {
  [key in Role]: Feature[]
}

export const permissions: RolePermissions = {
  [Role.ADMIN]: [
    Feature.KYC,
    Feature.RULE,
    Feature.WALLET,
    Feature.EXPLORER,
    Feature.CLIMATE,
  ],
  [Role.REGISTRY]: [
    Feature.KYC,
    Feature.RULE,
    Feature.EXPLORER,
    Feature.CLIMATE,
  ],
  [Role.KYC_PROVIDER]: [Feature.KYC, Feature.EXPLORER],
  [Role.WALLET_USER]: [Feature.WALLET, Feature.EXPLORER],
  [Role.UNAUTHENTICATED]: [],
}

export const roleDefaultRoutes: { [key in Role]: string } = {
  [Role.ADMIN]: '/kyc',
  [Role.REGISTRY]: '/rule',
  [Role.KYC_PROVIDER]: '/kyc',
  [Role.WALLET_USER]: '/wallet',
  [Role.UNAUTHENTICATED]: '/404',
}
