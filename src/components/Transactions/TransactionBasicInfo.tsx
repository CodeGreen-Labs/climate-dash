import { mojoToDisplayBalance } from '@/utils/CoinConverter'

import { ProjectInfo } from '../Info'

interface Props {
  projectName?: string
  unitVintageYear?: number
  currentRegistry?: string
  assetId?: string
  balance?: number
}

const TransactionBasicInfo = ({
  projectName,
  unitVintageYear,
  currentRegistry,
  assetId,
  balance,
}: Props) => {
  const projectInfoColumn = [
    {
      title: 'rule:data.project-name',
      field: projectName,
    },
    {
      title: 'rule:data.unit-vintage-year',
      field: unitVintageYear,
    },
    {
      title: 'rule:data.current-registry',
      field: currentRegistry,
    },
    ...(balance
      ? [
          {
            title: 'wallet:quantity-held',
            field: `${mojoToDisplayBalance(balance ?? 0, assetId)} tCO2e`,
          },
        ]
      : []),
  ]

  return <ProjectInfo column={projectInfoColumn} />
}

export default TransactionBasicInfo
