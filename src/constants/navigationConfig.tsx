import { ReactNode } from 'react'

import { ExplorerIcon, KycIcon, RuleIcon, WalletIcon } from '@/components/Icons'

import { Feature } from './role'

export type BasicNavigation = {
  title: ReactNode
  icon: ReactNode
  path: string
  isFuzzy?: boolean
}

type Navigation = BasicNavigation & {
  path: Feature
  sub?: BasicNavigation[]
}

export const navigationList: Navigation[] = [
  {
    title: 'kyc',
    icon: <KycIcon />,
    path: Feature.KYC,
  },
  {
    title: 'rule',
    icon: <RuleIcon />,
    path: Feature.RULE,
  },
  {
    title: 'wallet',
    icon: <WalletIcon />,
    path: Feature.WALLET,
  },
  {
    title: 'explorer',
    icon: <ExplorerIcon />,
    path: Feature.EXPLORER,
  },
]

export const headerHeight = 64
export const drawerWidth = 240
export const navigationWidth = 70
