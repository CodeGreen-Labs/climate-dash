export interface PaginationParams {
  page?: number
  limit?: number
}

export interface CWApiResponse<T> {
  page: number
  pageCount: number
  data: T
}

interface ProjectLocation {
  id: string
  warehouseProjectId: string
  orgUid: string
  country: string
  inCountryRegion: string
  geographicIdentifier: string
  timeStaged: string | null
  createdAt: string
  fileId: string
  updatedAt: string
}

export interface Issuance {
  id: string
  orgUid: string
  warehouseProjectId: string
  startDate: string
  endDate: string
  verificationApproach: string
  verificationReportDate: string
  verificationBody: string
  timeStaged: string | null
  createdAt: string
  updatedAt: string
}
export interface Project {
  warehouseProjectId: string
  orgUid: string
  currentRegistry: string
  projectId: string
  originProjectId: string
  registryOfOrigin: string
  program: string | null
  projectName: string
  projectLink: string
  projectDeveloper: string
  sector: string
  projectType: string
  projectTags: string
  coveredByNDC: string
  ndcInformation: string | null
  projectStatus: string
  projectStatusDate: string
  unitMetric: string
  methodology: string
  methodology2: string | null
  validationBody: string
  validationDate: string
  timeStaged: string
  description: string
  createdAt: string
  updatedAt: string
  projectLocations: ProjectLocation[]
  labels: string[]
  issuances: Issuance[]
}

export interface GetAllAuditRecordsParams extends PaginationParams {
  order?: string
  orgUid?: string
}

export interface AuditRecord {
  id: number
  orgUid: string
  registryId: string
  rootHash: string
  type: string
  change: string
  table: string
  onchainConfirmationTimeStamp: string
  author: string
  comment: string
  createdAt: string
  updatedAt: string
}

export interface AuditConflict {}

export interface GetFileParams {
  fileId: string
}

export interface File {}

export interface FileList extends Array<File> {}

export interface Org {
  orgUid: string
  name: string
  icon: string
  isHome: boolean
  subscribed: boolean
  fileStoreSubscribed: string
  synced: boolean
  sync_remaining: number
  xchAddress: string
  balance: string
}

export interface Governance {}

export interface StagingRecord {}
interface Label {
  id: string
  warehouseProjectId: string | null
  orgUid: string
  label: string
  labelType: string
  creditingPeriodStartDate: string
  creditingPeriodEndDate: string
  validityPeriodStartDate: string
  validityPeriodEndDate: string
  unitQuantity: number
  labelLink: string
  timeStaged: string | null
  createdAt: string
  updatedAt: string
  label_unit: LabelUnit
}

interface LabelUnit {
  id: string
  orgUid: string
  warehouseUnitId: string
  labelId: string
  timeStaged: string | null
  createdAt: string
  updatedAt: string
}
export interface Unit {
  warehouseUnitId: string
  issuanceId: string
  projectLocationId: string | null
  orgUid: string
  unitOwner: string
  countryJurisdictionOfOwner: string
  inCountryJurisdictionOfOwner: string | null
  serialNumberBlock: string
  unitBlockStart: string
  unitBlockEnd: string
  unitCount: number
  vintageYear: number
  unitType: string
  marketplace: string | null
  marketplaceLink: string | null
  marketplaceIdentifier: string | null
  unitTags: string
  unitStatus: string
  unitStatusReason: string | null
  unitRegistryLink: string
  correspondingAdjustmentDeclaration: string
  correspondingAdjustmentStatus: string
  timeStaged: string
  createdAt: string
  updatedAt: string
  labels: Label[]
  issuance: Issuance
}

export interface Staging<T> {
  id: number
  uuid: string
  table: string
  action: string
  data: T
  commited: boolean
  failedCommit: boolean
  isTransfer: boolean
  createdAt: string
  updatedAt: string
}
