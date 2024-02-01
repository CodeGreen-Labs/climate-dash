import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_CALL_TIMEOUT } from '@/constants/api'
import type {
  AuditConflict,
  AuditRecord,
  CWApiResponse,
  GetAllAuditRecordsParams,
  GetFileParams,
  Governance,
  Org,
  PaginationParams,
  Project,
  StagingRecord,
  Unit,
} from '@/types/climateWarehouseTypes'

export const climateWarehouseEndpoint = import.meta.env
  .VITE_DATA_LAYER_END_POINT

export const climateWarehouseApi = createApi({
  reducerPath: 'climateWarehouseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: climateWarehouseEndpoint,
    timeout: API_CALL_TIMEOUT,
  }),
  endpoints: (builder) => ({
    getAllAuditRecords: builder.query<
      CWApiResponse<AuditRecord[]>,
      GetAllAuditRecordsParams
    >({
      query: (params) => ({
        url: 'audit',
        method: 'GET',
        params,
      }),
    }),
    getAllAuditConflicts: builder.query<
      CWApiResponse<AuditConflict[]>,
      PaginationParams
    >({
      query: (Params) => ({
        url: 'audit/findConflicts',
        method: 'GET',
        Params,
      }),
    }),

    getFileList: builder.query<FileList, void>({
      query: () => ({
        url: 'filestore/get_file_list',
        method: 'GET',
      }),
    }),
    getFileById: builder.mutation<any, GetFileParams>({
      query: (params) => ({
        url: 'filestore/get_file',
        method: 'POST',
        body: params,
      }),
    }),
    getAllGovernanceData: builder.query<
      CWApiResponse<Governance[]>,
      PaginationParams
    >({
      query: (params) => ({ url: 'governance', method: 'GET', params }),
    }),
    getGovernanceBodyIsCreated: builder.query<boolean, void>({
      query: () => ({ url: 'governance/exists', method: 'GET' }),
    }),
    getDefaultOrgList: builder.query<CWApiResponse<Org[]>, PaginationParams>({
      query: (params) => ({
        url: 'governance/meta/orgList',
        method: 'GET',
        params,
      }),
    }),
    getPicklistValues: builder.query<CWApiResponse<Org[]>, PaginationParams>({
      query: (params) => ({
        url: 'governance/meta/pickList',
        method: 'GET',
        params,
      }),
    }),
    getAllOrgs: builder.query<Record<string, Org>, void>({
      query: () => ({ url: 'organizations', method: 'GET' }),
    }),
    getAllProjects: builder.query<Project[], PaginationParams>({
      query: (params) => ({ url: 'projects', method: 'GET', params }),
    }),
    getProjectById: builder.query<Project, string>({
      query: (projectId) => ({
        url: `projects?warehouseProjectId=${projectId}`,
        method: 'GET',
      }),
    }),
    getProjectByOrgUid: builder.query<Project[], string>({
      query: (orgUid) => ({
        url: `projects?orgUid=${orgUid}`,
        method: 'GET',
      }),
    }),
    getAllStagingRecords: builder.query<
      CWApiResponse<StagingRecord[]>,
      PaginationParams
    >({
      query: (params) => ({ url: 'staging', method: 'GET', params }),
    }),
    getAllUnits: builder.query<Unit[], PaginationParams>({
      query: (params) => ({ url: 'units', method: 'GET', params }),
    }),
    getUnitById: builder.query<Unit, string>({
      query: (warehouseUnitId) => ({
        url: `units`,
        method: 'GET',
        params: { warehouseUnitId },
      }),
    }),
    getUnitsByOrgUid: builder.query<Unit[], string>({
      query: (orgUid) => ({
        url: `units`,
        method: 'GET',
        params: { orgUid },
      }),
    }),
    getOrgMetadata: builder.query<Record<string, string>, string>({
      query: (orgUid) => ({
        url: 'organizations/metadata',
        method: 'GET',
        params: { orgUid },
      }),
    }),
  }),
})

export const {
  useGetAllAuditRecordsQuery,
  useGetAllAuditConflictsQuery,
  useGetFileListQuery,
  useGetFileByIdMutation,
  useGetAllGovernanceDataQuery,
  useGetGovernanceBodyIsCreatedQuery,
  useGetDefaultOrgListQuery,
  useGetPicklistValuesQuery,
  useGetAllOrgsQuery,
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useGetAllStagingRecordsQuery,
  useGetAllUnitsQuery,
  useGetUnitByIdQuery,
  useGetUnitsByOrgUidQuery,
  useGetProjectByOrgUidQuery,
  useGetOrgMetadataQuery,
} = climateWarehouseApi
