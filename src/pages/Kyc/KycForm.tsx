import { Box, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { EditForm, Subtitle, Title } from '@/components/Form'
import { SubmitActionPopup } from '@/components/Popup'
import { kycEditAbleList } from '@/constants/kyc'
import {
  kycApi,
  useCreateCredentialMutation,
  useGetCredentialByAddressQuery,
  useGetKycLevelListQuery,
  useUpdateCredentialMutation,
} from '@/services'
import store from '@/store'
import { KycCredential } from '@/types/dataLayerTypes'
import { FormRowGroup } from '@/types/formTypes'
import { formatTime, formatTimeToUTC } from '@/utils/datetime'
import {
  createDetailRows,
  createFormColumn,
  styleTableRowByRowGroups,
} from '@/utils/form'
import {
  requiredErrorMessageGenerator,
  validateWalletAddress,
  valuePatternGenerator,
} from '@/utils/tableData'
import { kycLevelTranslator } from '@/utils/translation'

const KycForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  // data
  const { address: editId } = useParams()
  const { data: editState, isLoading: kycIsLoading } =
    useGetCredentialByAddressQuery(editId || '', {
      skip: !editId,
    })
  const { data: KycLevels, isLoading: kycLevelsIsLoading } =
    useGetKycLevelListQuery()
  // api
  const [createCredential] = useCreateCredentialMutation()
  const [updateCredential] = useUpdateCredentialMutation()

  const [qualifyPublicKey, setQualifyPublicKey] = useState(!!editId)
  const [publicKey, setPublicKey] = useState('')

  const [showExistingKycPopup, setShowExistingKycPopup] = useState(false)

  const handleSaveData = async (data: KycCredential) => {
    const body = Object.assign({}, data)

    if (body.expired_date) {
      body.expired_date = formatTimeToUTC(data.expired_date)
    }
    if (editId && editState) {
      return await updateCredential({
        ...body,
        id: editState?.id,
      }).unwrap()
    } else {
      return await createCredential(body).unwrap()
    }
  }

  const handleOnSaveSuccess = () => {
    navigate({ pathname: '/kyc' })
  }

  const defaultValuesForCreate = useMemo<Partial<KycCredential>>(
    () => ({
      credential_level: 1,
      expired_date: dayjs().add(3, 'year').toISOString(),
    }),
    []
  )

  const editRowGroups = useMemo<FormRowGroup<KycCredential, any>[]>(
    () => [
      {
        warpComponent: (children: ReactNode) => <Paper>{children}</Paper>,
        rows: [
          [
            createFormColumn('customize', 'kyc:data.user-info', '', {
              hasRowDivider: true,
              columnSx: { py: 2, px: 4 },
              cell: () => (
                <Box
                  display="flex"
                  flexDirection="row"
                  gap={1}
                  alignItems="center"
                >
                  <Title>{t('kyc:data.user-info')}</Title>
                  <Subtitle>{t('common:required-info')}</Subtitle>
                </Box>
              ),
            }),
          ],
          [
            createFormColumn(
              '',
              'kyc:data.public-key',
              'walletUser.public_key',
              {
                rules: {
                  required: true,
                  validate: async (value: string) => {
                    if (editId) {
                      setQualifyPublicKey(true)
                      return true
                    }
                    if (validateWalletAddress(value)) {
                      try {
                        const duplicateKyc =
                          await kycApi.endpoints.getCredentialByAddress
                            .initiate(value)(store.dispatch, store.getState, {})
                            .unwrap()
                        if (duplicateKyc) {
                          setQualifyPublicKey(false)
                          setPublicKey(value)
                          setShowExistingKycPopup(true)
                          return 'common:validation.duplicate-wallet-address'
                        }
                        return true
                      } catch (error) {
                        setQualifyPublicKey(true)
                        return true
                      }
                    }
                    return 'common:validation.invalid-wallet-address'
                  },
                },
              }
            ),
          ],
          [
            createFormColumn('', 'kyc:data.username', 'walletUser.name', {
              disabled: !qualifyPublicKey,
              rules: {
                required: requiredErrorMessageGenerator('kyc:data', 'username'),
                pattern: valuePatternGenerator('username', 'string'),
              },
            }),
          ],
          [
            createFormColumn('', 'kyc:data.doc-number', 'document_id', {
              disabled: !qualifyPublicKey,
              rules: {
                required: requiredErrorMessageGenerator(
                  'kyc:data',
                  'doc-number'
                ),
              },
            }),
            createFormColumn('', 'kyc:data.ein-number', 'walletUser.ein', {
              disabled: !qualifyPublicKey,
              rules: {
                required: requiredErrorMessageGenerator(
                  'kyc:data',
                  'ein-number'
                ),
              },
            }),
          ],

          [
            createFormColumn('', 'kyc:data.email', 'walletUser.email', {
              disabled: !qualifyPublicKey,
              rules: {
                required: requiredErrorMessageGenerator('kyc:data', 'email'),
                pattern: valuePatternGenerator('user email', 'email'),
              },
            }),

            createFormColumn(
              '',
              'kyc:data.address',
              'walletUser.contact_address',
              {
                disabled: !qualifyPublicKey,
                rules: {
                  required: requiredErrorMessageGenerator(
                    'kyc:data',
                    'address'
                  ),
                },
              }
            ),
          ],
        ],
      },
      {
        warpComponent: (children) => <Paper sx={{ mt: 5 }}>{children}</Paper>,
        rows: [
          [
            createFormColumn('customize', 'kyc:data.info', '', {
              hasRowDivider: true,
              columnSx: { py: 2, px: 4 },
              cell: () => (
                <Box
                  display="flex"
                  flexDirection="row"
                  gap={1}
                  alignItems="center"
                  width="100%"
                  justifyContent="space-between"
                >
                  <Title>{t('kyc:data.info')}</Title>
                  <Box display="flex" flexDirection="row">
                    <Typography variant="body2" color="text.secondary">
                      {t('kyc:data.provider-name', { provider: '' })}
                    </Typography>
                    <Typography variant="body2">RegistryA</Typography>
                  </Box>
                </Box>
              ),
            }),
          ],
          [
            createFormColumn(
              'popupRadio',
              'wallet:wallet-kyc-level',
              'credential_level',
              {
                disabled: !qualifyPublicKey,
                editAble: true,
                rules: {
                  required: true,
                },
                options: KycLevels?.map((item) => {
                  return {
                    value: item.level,
                    label: kycLevelTranslator(
                      KycLevels || [],
                      item.level,
                      false
                    ),
                  }
                }),
              }
            ),
            createFormColumn('date', 'kyc:data.expiry-data', 'expired_date', {
              disabled: !qualifyPublicKey,
              minDate: dayjs(),
              rules: {
                required: true,
                validate: (value: string) => {
                  if (
                    dayjs(value).isBefore(dayjs()) ||
                    !dayjs(value).isValid()
                  ) {
                    return false
                  }
                  return true
                },
              },
            }),
          ],
        ],
      },
    ],
    [qualifyPublicKey, KycLevels, t, editId]
  )

  const reviewRowGroups = useMemo<FormRowGroup<KycCredential, string>[]>(
    () =>
      styleTableRowByRowGroups([
        {
          warpComponent: (children: ReactNode) => (
            <Paper sx={{ py: 4, pl: 4 }}>{children}</Paper>
          ),
          rows: createDetailRows([
            [
              ['title', 'kyc:data.user-info', ''],
              ['tableRow', 'kyc:data.public-key', 'walletUser.public_key'],
            ],

            [['tableRow', 'kyc:data.username', 'walletUser.name']],

            [['tableRow', 'kyc:data.doc-number', 'document_id']],

            [['tableRow', 'kyc:data.ein-number', 'walletUser.ein']],

            [['tableRow', 'kyc:data.email', 'walletUser.email']],

            [['tableRow', 'kyc:data.address', 'walletUser.contact_address']],

            [['divider'], ['divider']],
            [
              ['title', 'kyc:data.info', ''],

              [
                'tableRow',
                'wallet:wallet-kyc-level',
                'credential_level',
                {
                  cell: (value: any) =>
                    kycLevelTranslator(KycLevels || [], value),
                },
              ],
            ],

            [
              [
                'tableRow',
                'kyc:data.expiry-data',
                'expired_date',
                {
                  cell: (value: any) => formatTime(value),
                },
              ],
            ],
          ]),
        },
      ]),
    [KycLevels]
  )

  return (
    <>
      <EditForm
        isEdit={!!editId}
        editRowGroups={styleTableRowByRowGroups(editRowGroups)}
        reviewRowGroups={styleTableRowByRowGroups(reviewRowGroups)}
        defaultValues={editId ? editState : defaultValuesForCreate}
        editAbleList={kycEditAbleList}
        createFormTitle={'kyc:create'}
        onSave={async (data) => await handleSaveData(data as KycCredential)}
        onSaveSuccess={handleOnSaveSuccess}
        notDirtyFields={{
          'walletUser.public_key': true,
        }}
        isLoading={kycIsLoading || kycLevelsIsLoading}
      />
      {showExistingKycPopup && (
        <SubmitActionPopup
          title={t('common:alert.edit-existing.title', { key: 'kyc' })}
          onCloseOverlay={() => setShowExistingKycPopup(false)}
          onClose={() => setShowExistingKycPopup(false)}
          onSubmit={() => {
            setShowExistingKycPopup(false)
            navigate(`/kyc/edit/${publicKey}`)
            window.location.reload()
          }}
          submitBtnText={t('common:action.edit-existing', { key: 'kyc' })}
          closeBtnText="common:action.cancel"
        >
          <Typography id="alert.edit-existing.content" variant="body1">
            {t('common:alert.edit-existing.content', { key: 'kyc' })}
          </Typography>
        </SubmitActionPopup>
      )}
    </>
  )
}

export default KycForm
