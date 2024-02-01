import { Feature, permissions, Role } from '@/constants/role'

export const permissionVerify = (role: Role, feature: Feature): boolean => {
  return permissions[role].includes(feature)
}

export const matchFeatureFromPath = (path: string): Feature | null => {
  const match = path.split('/')[1]
  if (Object.values(Feature)?.includes(match as Feature)) {
    return match as Feature
  }
  return null
}
