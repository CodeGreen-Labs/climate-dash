import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import ImportPreview from '@/components/ImportPreview'
import ImportPreviewTableCell from '@/components/Table/ImportPreviewTableCell'
import { ruleEditAbleList } from '@/constants/rule'
import { useGetKycLevelListQuery } from '@/services'
import { CrudColumn } from '@/types/crudTableTypes'
import { Rule } from '@/types/dataLayerTypes'
import { FileUploaded } from '@/types/fileUploadTypes'
import { ImportData, ImportTypeEnum } from '@/types/importDataTypes'
import { RuleListItem, RuleListKeys } from '@/types/ruleTypes'
import { validateRules } from '@/utils/importData'
import { kycLevelTranslator } from '@/utils/translation'

const RuleImportPreview = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const state: FileUploaded = location.state

  const [filename, setFilename] = useState<string>('')

  const [data, setData] = useState<ImportData<keyof Rule, Partial<Rule>> | []>(
    []
  )
  const OnFileLoaded = useCallback(
    (filename: string, fileType: string, fileContent: Rule[]) => {
      if (!fileContent) {
        setData([])
        setFilename('')
      } else {
        setFilename(filename)
        const importRuleData = validateRules(fileContent) as
          | ImportData<keyof Rule, Partial<Rule>>
          | []
        setData(importRuleData)
      }
    },
    [state]
  )
  const { data: kycLevels, isLoading: kycLevelIsLoading } =
    useGetKycLevelListQuery()
  const initColumns = useMemo<
    CrudColumn<ImportData<RuleListKeys, Partial<RuleListItem>>, RuleListKeys>[]
  >(
    () => [
      {
        accessorKey: 'cat_id',
        header: 'rule:data.cat-id',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types.cat_id}
            value={info.row.original.cat_id}
            updateDisabled={!ruleEditAbleList.includes('walletUser.ein')}
          />
        ),
      },
      {
        accessorKey: 'warehouse_unit_id',
        header: 'rule:data.warehouse-unit-id',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types.warehouse_unit_id}
            value={info.row.original.warehouse_unit_id}
            updateDisabled={!ruleEditAbleList.includes('warehouse-unit-id')}
          />
        ),
      },
      // {
      //   accessorKey: 'vintage_year',
      //   header: 'rule:data.unit-vintage-year',
      //   cell: (info) => (
      //     <ImportPreviewTableCell
      //       type={info.row.original.types.vintage_year}
      //       value={info.row.original.vintage_year}
      //       updateDisabled={!ruleEditAbleList.includes('vintage-year')}
      //     />
      //   ),
      // },

      {
        accessorKey: 'origin_project_id',
        header: 'rule:data.origin-project-id',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types.origin_project_id}
            value={info.row.original.origin_project_id}
            updateDisabled={!ruleEditAbleList.includes('origin-project-id')}
          />
        ),
      },
      // {
      //   accessorKey: 'project_name',
      //   header: 'rule:data.project-name',
      //   cell: (info) => (
      //     <ImportPreviewTableCell
      //       type={info.row.original.types.project_name}
      //       value={info.row.original.project_name}
      //       updateDisabled={!ruleEditAbleList.includes('project-name')}
      //     />
      //   ),
      // },

      {
        accessorKey: 'kyc_receiving',
        header: 'rule:data.kyc-receiving',
        cell: (info) => {
          const types = info.row.original.types
          if (
            types?.kyc_receiving === ImportTypeEnum.TYPE_ERROR ||
            types?.kyc_receiving === ImportTypeEnum.EMPTY_ERROR
          )
            return (
              <ImportPreviewTableCell
                type={info.row.original.types.kyc_receiving}
                value={info.row.original.kyc_receiving}
              />
            )
          return t(
            kycLevelTranslator(kycLevels || [], info.row.original.kyc_receiving)
          )
        },
      },
      {
        accessorKey: 'kyc_retirement',
        header: 'rule:data.kyc-retirement',
        cell: (info) => {
          const types = info.row.original.types
          if (
            types?.kyc_retirement === ImportTypeEnum.TYPE_ERROR ||
            types?.kyc_retirement === ImportTypeEnum.EMPTY_ERROR
          )
            return (
              <ImportPreviewTableCell
                type={info.row.original.types.kyc_retirement}
                value={info.row.original.kyc_retirement}
              />
            )
          return t(
            kycLevelTranslator(
              kycLevels || [],
              info.row.original.kyc_retirement
            )
          )
        },
      },
      {
        accessorKey: 'kyc_sending',
        header: 'rule:data.kyc-sending',
        cell: (info) => {
          const types = info.row.original.types
          if (
            types?.kyc_sending === ImportTypeEnum.TYPE_ERROR ||
            types?.kyc_sending === ImportTypeEnum.EMPTY_ERROR
          )
            return (
              <ImportPreviewTableCell
                type={info.row.original.types.kyc_sending}
                value={info.row.original.kyc_sending}
              />
            )
          return t(
            kycLevelTranslator(kycLevels || [], info.row.original.kyc_sending)
          )
        },
      },

      {
        accessorKey: 'issuance_id',
        header: 'rule:data.issuance-id',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types.issuance_id}
            value={info.row.original.issuance_id}
            updateDisabled={!ruleEditAbleList.includes('issuance-id')}
          />
        ),
      },
    ],
    []
  )

  useEffect(() => {
    if (state) OnFileLoaded(state?.filename, state.fileType, state?.content)
  }, [])

  return (
    <ImportPreview
      filename={filename}
      data={data}
      columns={initColumns}
      isLoading={kycLevelIsLoading}
      onCancel={() => navigate(-1)}
      onLoadImportData={OnFileLoaded}
      removeFile={() => {
        setFilename('')
        setData([])
      }}
      onUpload={function (): Promise<void> {
        throw new Error('Function not implemented.')
      }}
      submitBtnDisabled={false}
    />
  )
}

export default RuleImportPreview
