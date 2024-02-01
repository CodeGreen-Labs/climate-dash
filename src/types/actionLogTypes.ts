export enum Action {
  insert,
  delete,
  update,
}

export interface ActionLog {
  action: keyof typeof Action
  key: string
  value?: string
  timestamp: Date
  tx_id?: string
}
