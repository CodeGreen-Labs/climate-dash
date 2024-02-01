import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import StatusChip from '@/components/CrudTable/StatusChip'
import ImportPreview from '@/components/ImportPreview'
import ImportPreviewTableCell from '@/components/Table/ImportPreviewTableCell'
import {
  useCreateCredentialByListMutation,
  useGetKycLevelListQuery,
  useUpdateCredentialByListMutation,
} from '@/services'
import { CrudColumn } from '@/types/crudTableTypes'
import { KycCredential } from '@/types/dataLayerTypes'
import { FileUploaded } from '@/types/fileUploadTypes'
import { ImportData, ImportTypeEnum } from '@/types/importDataTypes'
import { KycColumnAccessorKey, KycCredentialList } from '@/types/kycTypes'
import { formatDate, formatTimeToUTC } from '@/utils/datetime'
import { displayAPIErrorToast } from '@/utils/errorHandler'
import { editAbleList, validateKycCredentials } from '@/utils/importData'
import { transformObject } from '@/utils/tableData'
import { displayToast } from '@/utils/toast'
import { kycLevelTranslator } from '@/utils/translation'

const KycImportPreview = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const state: FileUploaded = location.state

  const [filename, setFilename] = useState<string>('')

  const [data, setData] = useState<
    ImportData<KycColumnAccessorKey, Partial<KycCredential>>[] | []
  >([])
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [createCredentialByList] = useCreateCredentialByListMutation()
  const [updateCredentialByList] = useUpdateCredentialByListMutation()

  const OnFileLoaded = useCallback(
    async (
      filename: string,
      fileType: string,
      fileContent: Record<KycColumnAccessorKey, any>[]
    ) => {
      setIsLoading(true)
      if (!fileContent) {
        setData([])
        setFilename('')
      } else {
        setFilename(filename)
        const transformedData = fileContent.map((item) =>
          transformObject({
            ...item,
            expired_date: formatTimeToUTC(item.expired_date),
          })
        ) as KycCredentialList

        const previewData = await createCredentialByList({
          method: 'preview',
          values: transformedData,
        })
          .unwrap()
          .catch((error) => error)
        if (previewData) {
          const { data, hasError } = validateKycCredentials(
            fileContent,
            previewData
          )
          setData(data)

          if (hasError) setSubmitBtnDisabled(true)
          else setSubmitBtnDisabled(false)
        }
        setIsLoading(false)
      }
    },
    [state]
  )
  const { data: kycLevels, isLoading: kycLevelIsLoading } =
    useGetKycLevelListQuery()
  const initColumns = useMemo<
    CrudColumn<
      ImportData<KycColumnAccessorKey, Partial<KycCredential>>,
      KycColumnAccessorKey | 'errors'
    >[]
  >(
    () => [
      {
        accessorKey: 'errors',
        header: 'type',
        cell: (info) => {
          const hasError = info.row.original.hasError
          return (
            <StatusChip
              value={
                hasError ? 'import-data.error' : info.row.original.defaultType
              }
              type={hasError ? 'alert' : 'default'}
              sx={{
                ml: 2,
              }}
            />
          )
        },
      },
      {
        accessorKey: 'walletUser.name',
        header: 'kyc:data.username',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types['walletUser.name']}
            value={info.row.original.walletUser?.name}
            updateDisabled={!editAbleList.includes('walletUser.name')}
          />
        ),
      },
      {
        accessorKey: 'walletUser.public_key',
        header: 'kyc:data.public-key',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types['walletUser.public_key']}
            value={info.row.original.walletUser?.public_key}
            updateDisabled={true}
          />
        ),
      },
      {
        accessorKey: 'document_id',
        header: 'kyc:data.doc-number',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types.document_id}
            value={info.row.original?.document_id}
            updateDisabled={!editAbleList.includes('document_id')}
          />
        ),
      },
      {
        accessorKey: 'walletUser.ein',
        header: 'kyc:data.ein-number',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types['walletUser.ein']}
            value={info.row.original.walletUser?.ein}
            updateDisabled={!editAbleList.includes('walletUser.ein')}
          />
        ),
      },
      {
        accessorKey: 'walletUser.email',
        header: 'kyc:data.email',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types['walletUser.email']}
            value={info.row.original.walletUser?.email}
            updateDisabled={!editAbleList.includes('walletUser.email')}
          />
        ),
      },
      {
        accessorKey: 'walletUser.contact_address',
        header: 'kyc:data.address',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types['walletUser.contact_address']}
            value={info.row.original.walletUser?.contact_address}
            updateDisabled={
              !editAbleList.includes('walletUser.contact_address')
            }
          />
        ),
      },

      {
        accessorKey: 'credential_level',
        header: 'wallet:wallet-kyc-level',
        cell: (info) => {
          const types = info.row.original.types
          const hasError =
            types?.credential_level === ImportTypeEnum.TYPE_ERROR ||
            types?.credential_level === ImportTypeEnum.EMPTY_ERROR

          return (
            <ImportPreviewTableCell
              type={types?.credential_level}
              value={
                hasError
                  ? info.row.original?.credential_level
                  : kycLevelTranslator(
                      kycLevels || [],
                      info.row.original?.credential_level
                    )
              }
              updateDisabled={!editAbleList.includes('credential_level')}
            />
          )
        },
      },

      {
        accessorKey: 'expired_date',
        header: 'kyc:data.expiry-data',
        cell: (info) => (
          <ImportPreviewTableCell
            type={info.row.original.types.expired_date}
            value={formatDate(info.row.original?.expired_date)}
            updateDisabled={!editAbleList.includes('expired_date')}
          />
        ),
      },
    ],
    []
  )

  const handleUpload = async () => {
    try {
      setIsLoading(true)
      const updateData = data
        .filter((item) => item.defaultType === ImportTypeEnum.UPDATE)
        .map((item) => ({
          kyc: item.credential_level,
          document_id: item.document_id,
          expired_date: formatTimeToUTC(item.expired_date),
          user: {
            name: item.walletUser?.name,
            public_key: item.walletUser?.public_key,
            ein: item.walletUser?.ein,
            email: item.walletUser?.email,
            contact_address: item.walletUser?.contact_address,
          },
        }))
      const createData = data
        .filter((item) => item.defaultType === ImportTypeEnum.CREATE)
        .map((item) => ({
          kyc: item.credential_level,
          document_id: item.document_id,
          expired_date: formatTimeToUTC(item.expired_date),
          user: {
            name: item.walletUser?.name,
            public_key: item.walletUser?.public_key,
            ein: item.walletUser?.ein,
            email: item.walletUser?.email,
            contact_address: item.walletUser?.contact_address,
          },
        }))

      let updated
      let created

      if (updateData.length > 0) {
        const updateRes = await updateCredentialByList({
          method: 'upset',
          values: updateData as unknown as KycCredentialList,
        }).unwrap()
        if (updateRes?.failed.length > 0) {
          displayAPIErrorToast(400, t('uploaded-failed'))
        } else {
          updated = true
        }
      } else {
        updated = true
      }

      if (createData.length > 0) {
        const createRes = await createCredentialByList({
          method: 'upset',
          values: createData as unknown as KycCredentialList,
        }).unwrap()

        if (createRes?.failed.length) {
          displayAPIErrorToast(400, t('uploaded-failed'))
        } else {
          created = true
        }
      } else {
        created = true
      }

      if (updated && created) {
        navigate('/kyc')
        displayToast(200, t('uploaded-successfully'))
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      displayAPIErrorToast(error, t('uploaded-failed'))
    }
  }

  useEffect(() => {
    if (state?.content)
      OnFileLoaded(state?.filename, state.fileType, state?.content)
  }, [state?.content])

  return (
    <ImportPreview
      filename={filename}
      data={data}
      columns={initColumns}
      isLoading={kycLevelIsLoading || isLoading}
      onCancel={() => navigate(-1)}
      onLoadImportData={(filename, fileType, content) =>
        navigate('/kyc/import-preview', {
          state: {
            filename,
            fileType,
            content,
          },
        })
      }
      removeFile={() => {
        setFilename('')
        setData([])
        navigate('/kyc/import-preview', {
          state: {},
        })
      }}
      onUpload={handleUpload}
      submitBtnDisabled={submitBtnDisabled}
    />
  )
}

export default KycImportPreview
