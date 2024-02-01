export enum ChainEnum {
  Mainnet = '0x01',
  Testnet = '0x02',
  Develop = '0x99',
}

export interface Chain {
  name: keyof typeof ChainEnum
  id: ChainEnum
  prefix: string
  agg_sig_me_additional_data: string
  retireAddress: string
}

export type ChainSet = Record<ChainEnum, Chain>

export enum ConditionOpcode {
  AGG_SIG_UNSAFE = '0x31',
  AGG_SIG_ME = '0x32',
  CREATE_COIN = '0x33',
  RESERVE_FEE = '0x34',
  CREATE_COIN_ANNOUNCEMENT = '0x3c',
  ASSERT_COIN_ANNOUNCEMENT = '0x3d',
  CREATE_PUZZLE_ANNOUNCEMENT = '0x3e',
  ASSERT_PUZZLE_ANNOUNCEMENT = '0x3f',
  ASSERT_MY_COIN_ID = '0x46',
  ASSERT_MY_PARENT_ID = '0x47',
  ASSERT_MY_PUZZLEHASH = '0x48',
  ASSERT_MY_AMOUNT = '0x49',
  ASSERT_SECONDS_RELATIVE = '0x50',
  ASSERT_SECONDS_ABSOLUTE = '0x51',
  ASSERT_HEIGHT_RELATIVE = '0x52',
  ASSERT_HEIGHT_ABSOLUTE = '0x53',
}
