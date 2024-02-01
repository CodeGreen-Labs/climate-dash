import { Box, Grid, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import Details from '@/components/Details'
import Form from '@/components/Form'
import useGetStagingData from '@/hooks/useGetStagedData'
import { useGetKycLevelListQuery, useGetRuleByTokenIdQuery } from '@/services'
import { CommitTable } from '@/types/dataLayerTypes'
import { DetailFormRows, FormRow } from '@/types/formTypes'
import type { RuleEditForm, RuleEditFormKeys } from '@/types/ruleTypes'
import type { TabInfo } from '@/types/tabFormTypes'
import { removePrefix0x, shortenHash } from '@/utils/chia'
import { formatDate, formatTime } from '@/utils/datetime'
import {
  createDetailRows,
  styleTableRow,
  styleTableRowByRowGroups,
} from '@/utils/form'
import { kycLevelTranslator } from '@/utils/translation'

type TabType = 'rule:data.issuance-info-tab' | 'rule:data.project-info-tab'

const RuleDetails = () => {
  const [curTab, setCurTab] = useState<TabType>('rule:data.issuance-info-tab')
  const { catId } = useParams()
  const { data: kycLevels } = useGetKycLevelListQuery()
  const { data: editState, isLoading } = useGetRuleByTokenIdQuery(catId || '', {
    skip: !catId,
  })

  const navigate = useNavigate()

  const { t } = useTranslation()

  const initIssuanceInfoRows: FormRow<any, any>[] = useMemo(() => {
    const unitRows: DetailFormRows = [
      [['tableRow', 'rule:data.unit-vintage-year', 'unit.vintageYear']],
      [
        [
          'tableRow',
          'rule:data.cat-id',
          'unit.marketplaceIdentifier',
          {
            cell: () =>
              shortenHash(
                removePrefix0x(editState?.unit?.marketplaceIdentifier || '')
              ),
          },
        ],
      ],
      [['tableRow', 'rule:data.serial-number-block', 'unit.serialNumberBlock']],

      [['tableRow', 'rule:data.unit-count', 'unit.unitCount']],

      [['tableRow', 'rule:data.unit-type', 'unit.unitType']],

      [['tableRow', 'rule:data.unit-owner', 'unit.unitOwner']],
    ]

    const issuanceRows: DetailFormRows = [
      [
        ['title', 'rule:data.issuance-info', ''],
        [
          'tableRow',
          'rule:data.verification-period-start',
          'issuance.startDate',
          {
            cell: (info: unknown) => formatDate(info as unknown as string),
          },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-period-end',
          'issuance.endDate',
          {
            cell: (info: unknown) => formatDate(info as unknown as string),
          },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-body',
          'issuance.verificationBody',
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-approach',
          'issuance.verificationApproach',
        ],
      ],
    ]

    const styledIssuanceRows = createDetailRows([...issuanceRows, ...unitRows])

    const kycRows: DetailFormRows = [
      [['divider'], ['divider']],
      [
        ['title', 'rule:data.transaction-rules', ''],
        [
          'tableRow',
          'rule:data.kyc-for-token-sending',
          'kyc_sending',
          { cell: (level: any) => kycLevelTranslator(kycLevels || [], level) },
        ],
      ],
      [
        [
          'tableRow',
          'rule:data.kyc-for-token-receiving',
          'kyc_receiving',
          { cell: (level: any) => kycLevelTranslator(kycLevels || [], level) },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.kyc-for-token-retirement',
          'kyc_retirement',
          { cell: (level: any) => kycLevelTranslator(kycLevels || [], level) },
        ],
      ],
    ]

    const styledKycRows = createDetailRows(kycRows)

    return [...styledIssuanceRows, ...styledKycRows]
  }, [editState?.unit?.marketplaceIdentifier, kycLevels])

  const { lockWriteFunc } = useGetStagingData({
    table: CommitTable.Rule,
  })
  const initProjectInfoRows: FormRow<RuleEditForm, RuleEditFormKeys>[] =
    useMemo(() => {
      const projectExtensionRows: DetailFormRows = [
        [
          [
            'tableRow',
            'rule:data.project-developer',
            'project.projectDeveloper',
          ],
        ],

        [['tableRow', 'rule:data.program', 'project.program']],

        [['tableRow', 'rule:data.sector', 'project.sector']],

        [['tableRow', 'rule:data.project-type', 'project.projectType']],

        [['tableRow', 'rule:data.project-status', 'project.projectStatus']],

        [
          [
            'tableRow',
            'rule:data.project-status-date',
            'project.projectStatusDate',
            {
              cell: (info: unknown) => formatTime(info as unknown as string),
            },
          ],
        ],
      ]
      const projectRows: DetailFormRows = [
        [
          ['title', 'rule:data.project-info', ''],
          ['tableRow', 'rule:data.project-id', 'project.projectId'],
        ],

        [['tableRow', 'rule:data.project-name', 'project.projectName']],

        [
          [
            'tableRow',
            'rule:data.origin-project-id',
            'project.originProjectId',
          ],
        ],

        [['tableRow', 'rule:data.current-registry', 'project.currentRegistry']],

        [['tableRow', 'rule:data.project-link', 'project.projectLink']],
      ]
      return createDetailRows([
        ...projectRows,
        ...projectExtensionRows,
      ]) as FormRow<RuleEditForm, RuleEditFormKeys>[]
    }, [editState?.project])

  const tabData = useMemo<TabInfo[]>(
    () => [
      {
        label: 'rule:data.issuance-info-tab',
        value: 'rule:data.issuance-info-tab',
        children: (
          <Form
            rowGroups={[
              {
                warpComponent: (children) => (
                  <Box sx={{ p: 4 }}>{children}</Box>
                ),
                rows: styleTableRow(initIssuanceInfoRows, 0),
              },
            ]}
            withActionButtons={false}
            defaultValue={editState}
            isLoading={isLoading}
          />
        ),
      },
      {
        label: 'rule:data.project-info-tab',
        value: 'rule:data.project-info-tab',
        children: (
          <Form
            rowGroups={styleTableRowByRowGroups([
              {
                warpComponent: (children) => (
                  <Box sx={{ p: 4 }}>{children}</Box>
                ),
                rows: initProjectInfoRows,
              },
            ])}
            withActionButtons={false}
            defaultValue={editState}
            isLoading={isLoading}
          />
        ),
      },
    ],
    [initIssuanceInfoRows, initProjectInfoRows, isLoading]
  )
  return (
    <Details
      onClickEdit={() => navigate(`/rule/edit/${catId}`)}
      isCommitting={lockWriteFunc}
      header={
        <Grid>
          <Typography
            key={editState?.project?.projectName}
            gutterBottom
            mb={2}
            variant="h5"
          >
            {editState?.project?.projectName}
          </Typography>
          <Grid container flexDirection="row" gap={1}>
            <Typography variant="body1" color="text.secondary">{`${t(
              'rule:data.unit-vintage-year'
            )}: `}</Typography>
            <Typography
              variant="body1"
              color="text.primary"
              key={editState?.unit?.vintageYear}
              gutterBottom
            >
              {editState?.unit?.vintageYear}
            </Typography>
          </Grid>
          <Grid container flexDirection="row" gap={1}>
            <Typography variant="body1" color="text.secondary">{`${t(
              'common:last-updated-time'
            )}: `}</Typography>
            <Typography
              variant="body1"
              color="text.primary"
              key={editState?.updatedAt}
              gutterBottom
            >
              {`${formatTime(editState?.updatedAt)}`}
            </Typography>
          </Grid>
        </Grid>
      }
      curTab={curTab}
      setCurTab={setCurTab}
      tabs={tabData}
    />
  )
}

export default RuleDetails
