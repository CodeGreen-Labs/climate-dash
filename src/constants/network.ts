import { ChainEnum, ChainSet } from '@/types/chia'
import { getConfig } from '@/utils/yamlConfigLoader'

export const chains: ChainSet = {
  [ChainEnum.Mainnet]: {
    name: 'Mainnet',
    prefix: 'xch',
    id: ChainEnum.Mainnet,
    agg_sig_me_additional_data:
      'ccd5bb71183532bff220ba46c268991a3ff07eb358e8255a65c30a2dce0e5fbb',
    retireAddress:
      'xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqm6ks6e8mvy',
  },
  [ChainEnum.Testnet]: {
    name: 'Testnet',
    prefix: 'txch',
    id: ChainEnum.Testnet,
    agg_sig_me_additional_data:
      'ae83525ba8d1dd3f09b277de18ca3e43fc0af20d20c4b3e92ef2a48bd291ccb2',
    retireAddress:
      'txch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqm6ksh7qddh',
  },
  [ChainEnum.Develop]: {
    name: 'Develop',
    prefix: 'txch',
    id: ChainEnum.Develop,
    agg_sig_me_additional_data:
      'ae83525ba8d1dd3f09b277de18ca3e43fc0af20d20c4b3e92ef2a48bd291ccb2',
    retireAddress:
      'txch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqm6ksh7qddh',
  },
}

export const DEAD_PUZZLE_HASH =
  '0x000000000000000000000000000000000000000000000000000000000000dead'

export const chain = chains[getConfig().network as keyof typeof chains]
