import {
  Box,
  Button,
  Divider,
  Paper,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { CopyBtn } from '@/components/Button'
import { ProjectInfo } from '@/components/Info'
import TabForm from '@/components/TabForm'
import { kycLevels } from '@/constants/kyc'
import useGetIssuanceInfoByAssetId from '@/hooks/useGetIssuanceInfoByAssetId'
import { StyledContainer } from '@/layout'
import { CommitStatus } from '@/types/dataLayerTypes'
import { formatDate, formatTime } from '@/utils/datetime'
import { commitStatusTranslator } from '@/utils/translation'

const ShadowlessButton = styled(Button)(() => ({
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}))

const ExplorerDetail = () => {
  const { t } = useTranslation()
  const { assetId } = useParams<{ assetId: string }>()

  const [value, setValue] = useState('0')

  const { issuanceInfo, isLoading: isIssuanceInfoLoading } =
    useGetIssuanceInfoByAssetId({ assetId })

  const projectInfoColumn = useMemo(
    () => [
      {
        title: 'rule:data.unit-vintage-year',
        field: issuanceInfo.unit?.vintageYear,
      },
      {
        title: 'rule:data.project-id',
        field: issuanceInfo.project?.projectId,
      },
      {
        title: 'rule:data.current-registry',
        field: issuanceInfo.project?.currentRegistry,
      },
      {
        title: 'rule:data.project-link',
        field: issuanceInfo.project?.projectLink,
        link: true,
      },
      {
        title: 'rule:data.project-developer',
        field: issuanceInfo.project?.projectDeveloper,
      },
      {
        title: 'rule:data.program',
        field: issuanceInfo.project?.program,
      },
      {
        title: 'rule:data.sector',
        field: issuanceInfo.project?.sector,
      },
      {
        title: 'rule:data.project-type',
        field: issuanceInfo.project?.projectType,
      },
      {
        title: 'rule:data.project-status',
        field: issuanceInfo.project?.projectStatus,
      },
      {
        title: 'rule:data.project-status-date',
        field: formatDate(issuanceInfo.project?.projectStatusDate),
      },
    ],
    [issuanceInfo]
  )

  const issuanceInfoColumn = useMemo(
    () => [
      {
        title: 'rule:data.verification-period-start',
        field: formatTime(issuanceInfo.issuance?.startDate),
      },
      {
        title: 'rule:data.verification-period-end',
        field: formatTime(issuanceInfo.issuance?.endDate),
      },
      {
        title: 'rule:data.verification-report-date',
        field: formatDate(issuanceInfo.issuance?.verificationReportDate),
      },
      {
        title: 'rule:data.verification-body',
        field: issuanceInfo.issuance?.verificationBody,
      },
      {
        title: 'rule:data.unit-vintage-year',
        field: issuanceInfo.unit?.vintageYear,
      },
      {
        title: 'rule:data.unit-serial-number',
        field: issuanceInfo.unit?.serialNumberBlock,
      },
      {
        title: 'rule:data.unit-count',
        field: issuanceInfo.unit?.unitCount,
      },
      {
        title: 'rule:data.unit-owner',
        field: issuanceInfo.unit?.unitOwner,
      },
    ],
    [issuanceInfo]
  )

  const transactionInfoColumn = useMemo(
    () => [
      {
        title: 'rule:data.kyc-for-token-receiving',
        field: t(kycLevels[String(issuanceInfo.rule?.kyc_receiving)]?.label),
      },
      {
        title: 'rule:data.kyc-for-token-retirement',
        field: t(kycLevels[String(issuanceInfo.rule?.kyc_retirement)]?.label),
      },
      {
        title: 'rule:data.kyc-for-token-sending',
        field: t(kycLevels[String(issuanceInfo.rule?.kyc_sending)]?.label),
      },
    ],
    [issuanceInfo]
  )
  const blockchainInfoColumn = useMemo(
    () => [
      {
        title: 'wallet:history.status',
        field: t(
          commitStatusTranslator(
            issuanceInfo.rule?.commit_status as CommitStatus
          )
        ),
      },
    ],
    [issuanceInfo]
  )

  const tabs = [
    {
      label: 'explorer:project-info',
      value: '0',
      children: (
        <Box p={2}>
          <ProjectInfo column={projectInfoColumn} />
        </Box>
      ),
    },
    {
      label: 'explorer:issuance-info',
      value: '1',
      children: (
        <Box p={2}>
          <Typography gutterBottom sx={{ m: 1 }}>
            {t('rule:data.issuance-details')}
          </Typography>
          <ProjectInfo column={issuanceInfoColumn} />
          <Divider sx={{ mb: 3, mt: 3 }} />

          <Typography gutterBottom sx={{ m: 1 }}>
            {t('rule:data.transaction-rules')}
          </Typography>
          <ProjectInfo column={transactionInfoColumn} />
          <Divider sx={{ mb: 3, mt: 3 }} />

          <Typography gutterBottom sx={{ m: 1 }}>
            {t('commit:commit-status')}
          </Typography>
          <ProjectInfo column={blockchainInfoColumn} />
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ pb: 3 }}>
      <Box
        sx={{
          height: '180px',
          bgcolor: 'primary.background',
          p: (theme) => theme.spacing(3),
        }}
      >
        <StyledContainer fixed maxWidth="xl">
          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{ height: '100%' }}
          >
            <Typography variant="h4" gutterBottom>
              {isIssuanceInfoLoading ? (
                <Skeleton sx={{ height: 40, width: '60%' }} />
              ) : (
                issuanceInfo?.project?.projectName
              )}
            </Typography>

            <Stack direction="row" alignItems="center">
              <Typography gutterBottom>Asset ID:{assetId}</Typography>
              <CopyBtn
                name="rule:data.cat-id"
                value={assetId}
                sx={{ ml: 1 }}
                small
              />
            </Stack>
          </Stack>
        </StyledContainer>
      </Box>

      <StyledContainer fixed maxWidth="xl">
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          {tabs.map((item) => (
            <ShadowlessButton
              key={item.value}
              color={value === item.value ? 'primary' : 'inherit'}
              variant="contained"
              onClick={() => setValue(item.value)}
            >
              {t(item.label)}
            </ShadowlessButton>
          ))}
        </Stack>

        <TabForm
          curTab={value}
          setCurTab={setValue}
          tabs={tabs}
          displayTabs={false}
          warpComponent={Paper}
        />
      </StyledContainer>
    </Box>
  )
}

export default ExplorerDetail
