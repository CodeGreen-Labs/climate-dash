export enum ImportTypeEnum {
  UPDATE = 'action.update',
  CREATE = 'action.create',
  TYPE_ERROR = 'typeError',
  EMPTY_ERROR = 'emptyError',
}

export type ImportType<T extends string> = {
  [key in T]: ImportTypeEnum
}
export type ImportData<Keys extends string, D> = D & {
  defaultType: ImportTypeEnum
  types: ImportType<Keys>
  hasError: boolean
}

export type ImportDataList<T extends string, D> = {
  hasError: boolean
  data: ImportData<T, D>[]
}
