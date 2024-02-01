import { Box, Grid, Typography } from '@mui/material'
import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import Details from '@/components/Details'
import Form from '@/components/Form'
import useGetStagingData from '@/hooks/useGetStagedData'
import {
  useGetCredentialByAddressQuery,
  useGetKycLevelListQuery,
} from '@/services'
import { CommitTable, KycCredential, KycLevel } from '@/types/dataLayerTypes'
import { FormRowGroup } from '@/types/formTypes'
import type {
  KycColumnAccessorKey,
  KycCredentialListItem,
} from '@/types/kycTypes'
import { formatTime } from '@/utils/datetime'
import { createDetailRows, styleTableRowByRowGroups } from '@/utils/form'
import { kycLevelTranslator } from '@/utils/translation'

type TabType = 'common:info-tab'

const KycDetails = () => {
  const [tab, setTab] = useState<TabType>('common:info-tab')
  const { t } = useTranslation()
  const { address } = useParams()
  const { data: kycLevels, isLoading: kycLevelsIsLoading } =
    useGetKycLevelListQuery()

  const { data: editState, isLoading: dataIsLoading } =
    useGetCredentialByAddressQuery(address || '', {
      skip: !address,
    })
  const curLevel = useMemo(
    () =>
      kycLevels?.find(
        (level) =>
          level.level === (editState?.credential_level as unknown as number)
      ),
    [editState?.credential_level, kycLevels]
  )
  const { lockWriteFunc } = useGetStagingData({
    table: CommitTable.Wallet,
  })
  const navigate = useNavigate()

  const currentData = useMemo(():
    | Partial<KycCredentialListItem>
    | undefined => {
    if (editState)
      switch (tab) {
        case 'common:info-tab': {
          // return kycInfos
          return { ...editState }
        }
        default:
          return editState
      }
  }, [tab, editState])

  const rowGroups = useMemo<
    FormRowGroup<KycCredential, KycColumnAccessorKey>[]
  >(
    () =>
      styleTableRowByRowGroups([
        {
          warpComponent: (children: ReactNode) => (
            <Box sx={{ p: 4 }}>{children}</Box>
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
                    kycLevelsIsLoading
                      ? ''
                      : kycLevelTranslator(kycLevels as KycLevel[], value),
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
    [kycLevels, kycLevelsIsLoading]
  )

  const tabs = useMemo(
    () => [
      {
        label: 'common:info-tab',
        value: 'common:info-tab',
        children: (
          <Form
            rowGroups={rowGroups}
            defaultValue={editState || {}}
            withActionButtons={false}
            isLoading={kycLevelsIsLoading || dataIsLoading}
          />
        ),
      },
    ],
    [dataIsLoading, editState, kycLevelsIsLoading, rowGroups]
  )

  return (
    <Details
      onClickEdit={() =>
        navigate(`/kyc/edit/${currentData?.walletUser?.public_key}`)
      }
      isCommitting={lockWriteFunc}
      header={
        <Grid>
          <Typography
            variant="h5"
            key={currentData?.walletUser?.name}
            gutterBottom
            mb={2}
          >
            {currentData?.walletUser?.name}
          </Typography>
          <Grid container flexDirection="row" gap={1}>
            <Typography variant="body1" color="text.secondary">{`${t(
              'kyc:level'
            )}: `}</Typography>
            <Typography
              variant="body1"
              color="text.primary"
              key={curLevel?.name}
              gutterBottom
            >
              {`${t(
                kycLevelTranslator(kycLevels as KycLevel[], curLevel?.level)
              )}`}
            </Typography>
          </Grid>
          <Grid container flexDirection="row" gap={1}>
            <Typography variant="body1" color="text.secondary">{`${t(
              'common:last-updated-time'
            )}: `}</Typography>
            <Typography
              variant="body1"
              color="text.primary"
              key={curLevel?.name}
              gutterBottom
            >
              {`${formatTime(currentData?.updatedAt)}`}
            </Typography>
          </Grid>
        </Grid>
      }
      curTab={tab}
      setCurTab={setTab}
      tabs={tabs}
    />
  )
}

export default KycDetails
