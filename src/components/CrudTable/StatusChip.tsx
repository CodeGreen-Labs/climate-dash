import { Chip, ChipProps, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { type KycLevel, CommitStatus } from '@/types/dataLayerTypes'
import { ImportTypeEnum } from '@/types/importDataTypes'
import { KycStatus } from '@/types/kycTypes'
import {
  commitStatusTranslator,
  kycStatusTranslator,
} from '@/utils/translation'

type Props = {
  data?: KycLevel[]
  value: any
  type?:
    | 'kycStatus'
    | 'commitStatus'
    | 'alert'
    | 'default'
    | ImportTypeEnum.UPDATE
} & ChipProps

const StyledChip = styled(Chip)(() => ({
  borderRadius: '4px',
}))

const StatusChip = ({ value, type = 'commitStatus', ...props }: Props) => {
  const { t } = useTranslation('common')
  const color = (() => {
    switch (value) {
      case 'alert':
      case KycStatus.Pending:
        return 'warning'
      case ImportTypeEnum.UPDATE:
      case KycStatus.Verified:
      case CommitStatus.Committed:
        return 'info'
      case CommitStatus.Committing:
        return 'success'
      case KycStatus.Expired:
      case 'import-data.error':
      case CommitStatus.Staged:
        return 'error'

      default:
        return 'default'
    }
  })()

  const label =
    type === 'commitStatus'
      ? commitStatusTranslator(value)
      : type === 'kycStatus'
      ? kycStatusTranslator(value)
      : t(value)

  return <StyledChip label={label} color={color} {...props} />
}

export default StatusChip
