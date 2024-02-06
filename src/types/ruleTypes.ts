import { Issuance, Project, Unit } from './climateWarehouseTypes'
import { Rule } from './dataLayerTypes'

export interface RuleDetails {
  issuance: Issuance
  project: Project
}

export interface RuleProjectInfo
  extends Pick<
    Project,
    | 'projectName'
    | 'originProjectId'
    | 'currentRegistry'
    | 'projectLink'
    | 'projectDeveloper'
    | 'program'
    | 'sector'
    | 'projectType'
    | 'projectStatus'
    | 'projectStatusDate'
    | 'projectId'
    | 'issuances'
  > {}
export interface RuleIssuanceInfo {
  issuance: Issuance
  rule: Pick<
    Rule,
    | 'kyc_receiving'
    | 'kyc_retirement'
    | 'kyc_sending'
    | 'commit_status'
    | 'cat_id'
    | 'last_modified_time'
    | 'createdAt'
    | 'updatedAt'
  >
  unit: Unit
}

export interface RuleEditForm extends RuleIssuanceInfo {
  project: RuleProjectInfo
  unit: Unit
}

export type IssuanceKeys = keyof Issuance extends infer Key
  ? Key extends string
    ? `issuance.${Key}`
    : never
  : never
export type RuleKeys = keyof Rule extends infer Key
  ? Key extends string
    ? `rule.${Key}`
    : never
  : never

export type ProjectKeys = keyof Project extends infer Key
  ? Key extends string
    ? `project.${Key}`
    : never
  : never
export type UnitKeys = keyof Unit extends infer Key
  ? Key extends string
    ? `unit.${Key}`
    : never
  : never

export type RuleIssuanceInfoKeys = IssuanceKeys | RuleKeys | UnitKeys

export type RuleEditFormKeys =
  | IssuanceKeys
  | RuleKeys
  | ProjectKeys
  | UnitKeys
  | 'toggleIssuanceViewMore'
  | 'toggleRuleViewMore'

export type RuleListKeys =
  | keyof Rule
  | 'project.projectId'
  | 'project.projectName'
  | 'unit.vintageYear'
  | 'action'
  | 'current_registry'
  | 'unit_owner'

export type RuleListItem = Omit<
  Rule,
  'project' | 'issuance' | 'unit' | 'staging'
> & {
  project_name: string
  vintage_year: number
}

export interface RuleListWithCADTInfo extends Rule {
  unit: Unit
  project: Project
}

export interface UnitRadio {
  info?: Unit
  selectedUnitId?: string
  handleChange: (unitId: string) => void
}
