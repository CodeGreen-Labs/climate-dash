import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types'
import { ColumnSort } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import StatusChip from '@/components/CrudTable/StatusChip'
import ListWithCommit from '@/components/ListWithCommit'
import { kycImportDataExample, kycImportDataHeader } from '@/constants/kyc'
import useGetStagingData from '@/hooks/useGetStagedData'
import {
  useGetCredentialListQuery,
  useGetKycLevelListQuery,
  usePostCommitMutation,
} from '@/services'
import { selectFilter, updateOptions } from '@/store/slices/filterSlices'
import {
  updateStagedCommitCount,
  updateSuccessCommitCount,
} from '@/store/slices/tableDataSlices'
import { CrudColumn } from '@/types/crudTableTypes'
import { CommitTable } from '@/types/dataLayerTypes'
import { OnFileLoaded } from '@/types/fileUploadTypes'
import { EFilter, EFilterList } from '@/types/filterTypes'
import type {
  KycColumnAccessorKey,
  KycCredentialListItem,
} from '@/types/kycTypes'
import { formatTime } from '@/utils/datetime'
import { generateQueryString, transformObject } from '@/utils/tableData'
import { displayToast } from '@/utils/toast'

import {
  commitStatusTranslator,
  kycLevelTranslator,
} from '../../utils/translation'

function KycList() {
  const selectFiltered = useSelector(selectFilter(EFilter.KYC_FILTER))
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState<ColumnSort>()

  const queryString = useMemo(
    () =>
      generateQueryString(
        selectFiltered,
        [],
        searchString,
        {
          limit: pageSize,
          page: pageIndex + 1,
        },
        sorting
      ),

    [selectFiltered, searchString, sorting, pageIndex, pageSize]
  )

  const { data: kycLevels, isLoading: kycLevelIsLoading } =
    useGetKycLevelListQuery()
  const {
    data,
    isLoading: kycListIsLoading,
    refetch: refetchCredential,
  } = useGetCredentialListQuery(queryString.query)

  const [postCommit] = usePostCommitMutation()

  const isLoading = useMemo(
    () => kycListIsLoading || kycLevelIsLoading,
    [kycListIsLoading, kycLevelIsLoading]
  )

  const { t } = useTranslation()
  const columns = useMemo<
    CrudColumn<KycCredentialListItem, KycColumnAccessorKey>[]
  >(
    () => [
      {
        accessorKey: 'walletUser.name',
        header: 'kyc:data.username',
        enableSorting: true,
      },
      {
        type: 'popupRadio',
        accessorKey: 'credential_level',
        header: 'wallet:wallet-kyc-level',
        cell: (info) =>
          t(
            kycLevelTranslator(
              kycLevels || [],
              info.row.original.credential_level
            )
          ),
      },

      {
        type: 'radio',
        accessorKey: 'status',
        header: 'kyc:data.status',
        tooltip: 'kyc:credential-status-tooltip',
        cell: (info) => (
          <StatusChip type="kycStatus" value={info.row.original.status} />
        ),
      },
      {
        type: 'radio',
        accessorKey: 'commit_status',
        header: 'commit:commit-status',
        tooltip: 'commit:commit-status-tooltip',
        cell: (info) => {
          return (
            <StatusChip
              type="commitStatus"
              value={info.row.original.commit_status}
            />
          )
        },
      },
      {
        type: 'date',
        accessorKey: 'updatedAt',
        header: 'common:last-updated-time',
        enableSorting: true,
        cell: (info) => {
          return formatTime(info.row.original.updatedAt)
        },
      },
    ],
    [kycLevels]
  )

  const { selectStaged, selectCommitting, stagingsRefetch, lockWriteFunc } =
    useGetStagingData({
      table: CommitTable.Wallet,
    })
  const prevSelectCommittingRef = useRef(selectCommitting)
  const prevSelectTimerRef = useRef<TimeoutId | null>(null)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const checkTheCommittingStatus = () => {
    // Clear the previous timer, if it exists
    if (prevSelectTimerRef.current) {
      clearTimeout(prevSelectTimerRef.current)
    }

    // Set a new timer to call refetch after 5000ms
    prevSelectTimerRef.current = setTimeout(() => {
      stagingsRefetch()
    }, 5000)
  }

  const handleCommitData = async () => {
    // mark until the api is ready to specify the commit kyc list
    // const selectedAddress = [...selectStaged, ...selectFail].map(
    //   (item) => item.walletUser.public_key
    // ) as string[]
    try {
      await postCommit({
        table: CommitTable.Wallet,
        ids: selectStaged.map((i) => i.uuid),
        author: '',
        comment: '',
      }).unwrap()
    } catch (error: any) {
      displayToast(
        400,
        `${t('commit:alert.commit-failed.content')}: ${error?.message}`,
        { autoHideDuration: 5000 }
      )
    }
  }

  const handleOnLoadImportData: OnFileLoaded = (
    filename: string,
    fileType: string,
    content: any
  ) => {
    navigate('/kyc/import-preview', {
      state: {
        filename,
        fileType,
        content,
      },
    })
  }

  useEffect(() => {
    // Check if the current value of selectCommitting is different from the previous one
    if (selectCommitting.length > 0) {
      checkTheCommittingStatus()
    }
    // Committing is done
    else if (
      selectCommitting.length === 0 &&
      prevSelectCommittingRef.current.length > 0
    ) {
      refetchCredential()
      dispatch(
        updateSuccessCommitCount({
          key: 'kyc',
          value: prevSelectCommittingRef.current.length,
        })
      )
    }

    // Update the previous value to the current value of selectCommitting for the next render
    prevSelectCommittingRef.current = selectCommitting
  }, [selectCommitting, checkTheCommittingStatus])

  useEffect(() => {
    if (kycLevels) {
      dispatch(
        updateOptions({
          filter: EFilter.KYC_FILTER,
          key: EFilterList.KYC_LEVEL,
          options: kycLevels.map((item) => ({
            key: String(item.level),
            label: kycLevelTranslator(kycLevels, item.level),
          })),
        })
      )
    }
  }, [kycLevels])

  useEffect(() => {
    if (selectStaged) {
      dispatch(updateStagedCommitCount({ kyc: selectStaged.length }))
    }
  }, [selectStaged?.length])

  const handleOpenDetails = (rowData: KycCredentialListItem) => {
    navigate(`/kyc/details/${rowData.walletUser.public_key}`)
  }
  const exportData = useMemo(() => {
    return (
      data?.rows?.map((item: KycCredentialListItem) =>
        transformObject({
          'walletUser.name': item?.walletUser?.name,
          credential_level: t(
            kycLevelTranslator(kycLevels || [], item.credential_level)
          ),
          status: t(`kyc:status-type.${item.status.toLocaleLowerCase()}`),
          commit_status: t(commitStatusTranslator(item.commit_status)),
          updatedAt: formatTime(item.updatedAt),
        })
      ) || []
    )
  }, [data?.rows, kycLevels, t])
  return (
    <ListWithCommit
      title="kyc:mgt"
      data={data?.rows || []}
      importHeader={kycImportDataHeader}
      exportData={exportData}
      columns={columns}
      isLoading={isLoading}
      handleCommitData={handleCommitData}
      selectStaged={selectStaged}
      handleOpenDetails={handleOpenDetails}
      searchPlaceholder="kyc:search"
      lockWriteFunc={lockWriteFunc}
      setSearchString={(searchField: string) => setSearchString(searchField)}
      handleCreate={() =>
        navigate({
          pathname: '/kyc/create',
        })
      }
      filter={EFilter.KYC_FILTER}
      exportFileName="KYC-Export"
      onLoadImportData={handleOnLoadImportData}
      importDataExample={kycImportDataExample}
      handleSorting={(state) => {
        setSorting(state)
      }}
      tableOptions={{
        manualPagination: true,
        total: data?.count || 0,
        state: {
          pagination: {
            pageSize,
            pageIndex,
          },
        },
        onPaginationChange: (updater: any) => {
          const state = updater({
            pageSize,
            pageIndex,
          })
          setPageIndex(state.pageIndex)
          setPageSize(state.pageSize)
        },
      }}
    />
  )
}

export default KycList
