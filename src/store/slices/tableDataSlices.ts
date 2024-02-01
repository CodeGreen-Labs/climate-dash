import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { CommitTypes } from '@/types/commitTypes'

import { RootState } from '..'

interface State {
  staged_commit_count: {
    kyc: number
    rule: number
  }

  isCommitting: {
    kyc: boolean
    rule: boolean
  }

  success_commit_count: {
    kyc: number
    rule: number
  }
}

const initialState: State = {
  staged_commit_count: {
    kyc: 0,
    rule: 0,
  },
  isCommitting: {
    kyc: false,
    rule: false,
  },
  success_commit_count: {
    kyc: 0,
    rule: 0,
  },
}

const tableDataSlice = createSlice({
  name: 'tableData',
  initialState,
  reducers: {
    updateStagedCommitCount(
      state,
      action: PayloadAction<{
        kyc?: number
        rule?: number
      }>
    ) {
      state.staged_commit_count = {
        ...state.staged_commit_count,
        ...action.payload,
      }
    },
    updateSuccessCommitCount(
      state,
      action: PayloadAction<{
        key: CommitTypes
        value: number
      }>
    ) {
      state.success_commit_count[action.payload.key] = action.payload.value
    },
    updateIsCommitting(
      state,
      action: PayloadAction<{
        key: CommitTypes
        value: boolean
      }>
    ) {
      state.isCommitting[action.payload.key] = action.payload.value
    },
  },
})

export const {
  updateStagedCommitCount,
  updateSuccessCommitCount,
  updateIsCommitting,
} = tableDataSlice.actions

// selectors
export const selectStagedCommitCount = (state: RootState) =>
  state.tableData.staged_commit_count
export const selectSuccessCommitCount = (state: RootState) =>
  state.tableData.success_commit_count
export const selectIsCommitting = (state: RootState) =>
  state.tableData.isCommitting

export default tableDataSlice.reducer
