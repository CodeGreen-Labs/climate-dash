import { Stack, Typography } from '@mui/material'
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types'
import { ColumnSort } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CopyBtn } from '@/components/Button'
import { ProjectInfoDisplay } from '@/components/Cadt'
import StatusChip from '@/components/CrudTable/StatusChip'
import ListWithCommit from '@/components/ListWithCommit'
import useGetStagingData from '@/hooks/useGetStagedData'
import {
  useGetKycLevelListQuery,
  useGetRuleListQuery,
  usePostCommitMutation,
} from '@/services'
import { useAppDispatch, useTypedSelector } from '@/store'
import { selectFilter } from '@/store/slices/filterSlices'
import {
  updateStagedCommitCount,
  updateSuccessCommitCount,
} from '@/store/slices/tableDataSlices'
import { CrudColumn } from '@/types/crudTableTypes'
import { CommitStatus, CommitTable, Rule } from '@/types/dataLayerTypes'
import { EFilter } from '@/types/filterTypes'
import { RuleListKeys } from '@/types/ruleTypes'
import { removePrefix0x, shortenHash } from '@/utils/chia'
import { formatTime } from '@/utils/datetime'
import { generateQueryString, transformObject } from '@/utils/tableData'
import { displayToast } from '@/utils/toast'
import { commitStatusTranslator, kycLevelTranslator } from '@/utils/translation'
function RuleList() {
  const { t } = useTranslation()
  const selectFiltered = useTypedSelector(selectFilter(EFilter.RULE_FILTER))
  const { data: kycLevels, isLoading: kycLevelIsLoading } =
    useGetKycLevelListQuery()
  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState<ColumnSort>()

  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(5)

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

  const {
    data,
    isLoading: ruleListIsLoading,
    refetch: refetchRules,
  } = useGetRuleListQuery(queryString.query)

  const isLoading = useMemo(
    () => ruleListIsLoading || kycLevelIsLoading,
    [ruleListIsLoading, kycLevelIsLoading]
  )

  const [postCommit] = usePostCommitMutation()

  const columns = useMemo<CrudColumn<Rule, RuleListKeys>[]>(
    () => [
      {
        accessorKey: 'origin_project_id',
        header: 'rule:data.origin-project-id',
        cell: (info) => (
          <ProjectInfoDisplay
            paramsKey="projectId"
            warehouseProjectId={info.row.original.warehouse_project_id}
          />
        ),
      },
      {
        accessorKey: 'project.projectName',
        header: 'rule:data.project-name',
        cell: ({ row }) => (
          <Typography
            variant="body2"
            sx={{ width: 300, wordBreak: 'break-all', whiteSpace: 'normal' }}
          >
            {row.original.project.projectName}
          </Typography>
        ),
      },
      {
        accessorKey: 'unit.vintageYear',
        header: 'rule:data.unit-vintage-year',
      },

      {
        accessorKey: 'cat_id',
        header: 'rule:data.cat-id',
        cell: (info) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {shortenHash(removePrefix0x(info.row.original.cat_id))}
            <CopyBtn
              name="rule:data.cat-id"
              value={info.row.original.cat_id}
              small
              sx={{ ml: 1 }}
            />
          </Stack>
        ),
      },
      {
        type: 'radio',
        accessorKey: 'kyc_sending',
        header: 'rule:data.kyc-sending',
        cell: (info) =>
          t(kycLevelTranslator(kycLevels || [], info.row.original.kyc_sending)),
      },
      {
        accessorKey: 'kyc_receiving',
        header: 'rule:data.kyc-receiving',
        cell: (info) =>
          t(
            kycLevelTranslator(kycLevels || [], info.row.original.kyc_receiving)
          ),
      },
      {
        type: 'radio',
        accessorKey: 'kyc_retirement',
        header: 'rule:data.kyc-retirement',
        cell: (info) =>
          t(
            kycLevelTranslator(
              kycLevels || [],
              info.row.original.kyc_retirement
            )
          ),
      },

      {
        accessorKey: 'commit_status',
        header: 'commit:commit-status-header',
        tooltip: 'commit:commit-status-tooltip',
        cell: (info) => (
          <StatusChip
            type="commitStatus"
            value={info.row.original.commit_status}
          />
        ),
      },
      {
        type: 'date',
        accessorKey: 'updatedAt',
        header: 'common:last-updated-time',
        enableSorting: true,
        cell: (info) => formatTime(info.row.original.updatedAt),
      },
    ],
    [kycLevels]
  )

  const { selectStaged, selectCommitting, stagingsRefetch, lockWriteFunc } =
    useGetStagingData({
      table: CommitTable.Rule,
    })
  const prevSelectCommittingRef = useRef(selectCommitting)
  const prevSelectTimerRef = useRef<TimeoutId | null>(null)

  const dispatch = useAppDispatch()

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
        table: CommitTable.Rule,
        ids: selectStaged.map((i) => i.uuid),
        author: '',
        comment: '',
      }).unwrap()
    } catch (error) {
      displayToast(
        400,
        t('commit:alert.commit-failed.content', { autoHideDuration: 5000 })
      )
    }
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
      refetchRules()
      dispatch(
        updateSuccessCommitCount({
          key: 'rule',
          value: prevSelectCommittingRef.current.length,
        })
      )
    }

    // Update the previous value to the current value of selectCommitting for the next render
    prevSelectCommittingRef.current = selectCommitting
  }, [selectCommitting, checkTheCommittingStatus])

  useEffect(() => {
    if (selectStaged) {
      dispatch(updateStagedCommitCount({ rule: selectStaged.length }))
    }
  }, [selectStaged?.length])

  const handleOpenDetails = (rowData: Rule) => {
    navigate(`/rule/details/${rowData.cat_id}`)
  }

  const exportData = useMemo(() => {
    return data?.rows.map((item) =>
      transformObject({
        ...item,
        kyc_sending: t(kycLevelTranslator(kycLevels || [], item.kyc_receiving)),
        kyc_receiving: t(
          kycLevelTranslator(kycLevels || [], item.kyc_receiving)
        ),
        kyc_retirement: t(
          kycLevelTranslator(kycLevels || [], item.kyc_retirement)
        ),
        commit_status: t(
          commitStatusTranslator(item?.commit_status || CommitStatus.Staged)
        ),
        updatedAt: formatTime(item.updatedAt),
      })
    )
  }, [data?.rows, kycLevels, t])
  return (
    <ListWithCommit
      title="rule:mgt"
      data={data?.rows || []}
      exportData={exportData}
      columns={columns}
      isLoading={isLoading}
      lockWriteFunc={lockWriteFunc}
      handleCommitData={handleCommitData}
      selectStaged={selectStaged}
      handleOpenDetails={handleOpenDetails}
      searchPlaceholder="rule:search"
      setSearchString={(searchField: string) => setSearchString(searchField)}
      handleCreate={() =>
        navigate({
          pathname: '/rule/create',
        })
      }
      filter={EFilter.RULE_FILTER}
      exportFileName="Rule-Export"
      withImport={false}
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
      handleSorting={(state) => {
        setSorting(state)
      }}
    />
  )
}

export default RuleList
