import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { kycLevels } from '@/constants/kyc'
import { CommitStatus } from '@/types/dataLayerTypes'
import { EFilter, EFilterList, IFilterListType } from '@/types/filterTypes'
import { KycStatus } from '@/types/kycTypes'

import { RootState } from '..'

type State = Record<EFilter, IFilterListType> & {}

// uncomment the following line if api is available
// const commitStatusOptions = [
//   {
//     key: CommitStatus.Staged.toString(),
//     label: 'commit:commit-status-type.staged',
//   },
//   {
//     key: CommitStatus.Committing.toString(),
//     label: 'commit:commit-status-type.committing',
//   },
//   {
//     key: CommitStatus.Committed.toString(),
//     label: 'commit:commit-status-type.committed',
//   },
// ]

const kycLevelOptions = Object.values(kycLevels)

const initialState: State = {
  kycFilter: {
    [EFilterList.KYC_LEVEL]: {
      selected: [],
      options: kycLevelOptions,
      title: 'kyc:all-kyc-level',
      subTitle: 'kyc:data.level',
      multiple: false,
    },
    status: {
      selected: [],
      options: [
        { key: KycStatus.Pending, label: 'kyc:status-type.pending' },
        { key: KycStatus.Verified, label: 'kyc:status-type.verified' },
        { key: KycStatus.Expired, label: 'kyc:status-type.expired' },
      ],
      title: 'kyc:all-kyc-status',
      subTitle: 'kyc:data.status',
      multiple: false,
    },
    commit_status: {
      selected: [],
      multiple: false,
      options: [
        { key: CommitStatus.Staged, label: 'commit:commit-status-type.staged' },
        {
          key: CommitStatus.Committing,
          label: 'commit:commit-status-type.committing',
        },
        {
          key: CommitStatus.Committed,
          label: 'commit:commit-status-type.committed',
        },
      ],
      title: 'commit:all-commitments',
      subTitle: 'commit:commit-status',
    },
  },
  ruleFilter: {
    // kyc_receiving: {
    //   selected: [],
    //   options: kycLevelOptions,
    //   title: 'all-kyc-receiving',
    //   subTitle: 'rule:data.kyc-receiving',
    //   multiple: false,
    // },
    // kyc_retirement: {
    //   selected: [],
    //   options: kycLevelOptions,
    //   title: 'all-kyc-retirement',
    //   subTitle: 'rule:data.kyc-retirement',
    //   multiple: false,
    // },
    // kyc_sending: {
    //   selected: [],
    //   options: kycLevelOptions,
    //   title: 'all-kyc-sending',
    //   subTitle: 'rule:data.kyc-sending',
    //   multiple: false,
    // },
    commit_status: {
      selected: [],
      multiple: false,
      options: [
        { key: CommitStatus.Staged, label: 'commit:commit-status-type.staged' },
        {
          key: CommitStatus.Committing,
          label: 'commit:commit-status-type.committing',
        },
        {
          key: CommitStatus.Committed,
          label: 'commit:commit-status-type.committed',
        },
      ],
      title: 'commit:all-commitments',
      subTitle: 'commit:commit-status',
    },
  },
  walletHistoryFilter: {
    status: {
      selected: [],
      options: [
        { key: '1', label: 'Success' },
        { key: '2', label: 'Pending' },
      ],
      title: 'All Status',
      subTitle: '',
      multiple: true,
    },
  },
}

const filterSlices = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateFilter: (
      state,
      action: PayloadAction<{
        filter: EFilter
        key: EFilterList
        selected: string[]
      }>
    ) => {
      const { key, selected, filter } = action.payload
      state[filter][key].selected = selected
    },
    updateOptions: (
      state,
      action: PayloadAction<{
        filter: EFilter
        key: EFilterList
        options: { key: any; label: string }[]
      }>
    ) => {
      const { key, options, filter } = action.payload
      state[filter][key].options = options
    },
  },
})

export const selectFilter =
  (filter: EFilter) =>
  (state: RootState): IFilterListType =>
    state.filter[filter]

export const { updateFilter, updateOptions } = filterSlices.actions

export default filterSlices.reducer
