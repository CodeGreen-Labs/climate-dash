import { Rule } from './dataLayerTypes'

export interface UpdateRule
  extends Partial<
    Pick<Rule, 'kyc_receiving' | 'kyc_retirement' | 'kyc_sending' | 'cat_id'>
  > {}

export interface CreateRule
  extends Omit<Rule, 'project' | 'unit' | 'issuance'> {}
