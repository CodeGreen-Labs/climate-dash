import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { BackBtn } from '@/components/Button'
import { Unit } from '@/types/climateWarehouseTypes'
import { TransactionListItem } from '@/types/TransactionType'

export interface ViolatingDetails
  extends Omit<TransactionListItem, 'last_modified_time'>,
    Pick<Unit, 'vintageYear'> {
  time: string
}

const RuleViolatingDetails = () => {
  // const [curTab, setCurTab] = React.useState('info')

  const { t } = useTranslation()
  // commit out for now until the form is ready
  // create fake data base ont the ViolatingDetails interface
  // const data: ViolatingDetails = {
  //   type: 'transaction',
  //   status: 'violating',
  //   quantity: 100,
  //   transaction_id: '123456789',
  //   time: '2021-10-10 10:10:10',
  //   project_id: '123456789',
  //   project_name: 'project name',
  //   cat_id: '123456789',
  //   vintageYear: 2021,
  // }

  // const columns: FormColumn<ViolatingDetails>[] = [
  //   {
  //     type: 'title',
  //     accessorKey: 'transaction-info',
  //     header: 'rule:data.transaction-info',
  //   },
  //   {
  //     accessorKey: 'type',
  //     type: 'view',
  //     header: 'wallet:history.type',
  //     cell: () => t('wallet:history.type-is.transfer'),
  //   },
  //   {
  //     accessorKey: 'status',
  //     type: 'view',
  //     header: 'wallet:history.status',
  //     tooltip: t('wallet:history.status'),
  //     cell: () => t('wallet:history.violation-status.violating'),
  //   },
  //   {
  //     accessorKey: 'quantity',
  //     type: 'view',
  //     header: 'wallet:history.quantity',
  //     cell: (info) => info + ' ' + 'tCo2e',
  //   },
  //   {
  //     accessorKey: 'transaction_id',
  //     type: 'view',
  //     header: 'wallet:history.transaction-id',
  //     renderRowEndItem: (value: string) => (
  //       <CopyBtn name="wallet:history.transaction-id" value={value} />
  //     ),
  //   },
  //   {
  //     type: 'view',
  //     accessorKey: 'time',
  //     header: 'time',
  //     cell: (info) => formatTime(info as unknown as string),
  //     hasRowDivider: true,
  //   },
  //   {
  //     type: 'title',
  //     accessorKey: 'project-info',
  //     header: 'rule:data.project-info',
  //   },
  //   {
  //     accessorKey: 'project_name',
  //     type: 'view',
  //     header: 'rule:data.project-name',
  //   },
  //   {
  //     accessorKey: 'project_id',
  //     type: 'view',
  //     header: 'rule:data.project-id',
  //   },

  //   {
  //     accessorKey: 'vintageYear',
  //     type: 'view',
  //     header: 'rule:data.unit-vintage-year',
  //   },
  //   {
  //     accessorKey: 'cat_id',
  //     type: 'view',
  //     header: 'rule:data.cat-id',
  //     renderRowEndItem: (value: string) => (
  //       <CopyBtn name="rule:data.cat-id" value={value} />
  //     ),
  //   },
  // ]

  // const tabData = useMemo<TabInfo[]>(
  //   () => [
  //     {
  //       label: 'common:info-tab',
  //       value: 'info',
  //       children: (
  //         <></>
  //         // commit out for now until the form is ready
  //         // <Form
  //         //   columns={generateColumns(data, columns)}
  //         //   withActionButtons={false}
  //         // />
  //       ),
  //     },
  //   ],
  //   []
  // )

  return (
    <Grid>
      <Grid container justifyContent="space-between" mb={5}>
        <Grid item>
          <BackBtn />
        </Grid>
      </Grid>
      {/* header */}
      <Grid container ml={3} mb={2} spacing={3}>
        <Grid>
          <Typography variant="h6" gutterBottom>
            {t('wallet:history.violation-incidents')}
          </Typography>
        </Grid>
      </Grid>
      <Grid>
        {/* <TabForm
          curTab={curTab}
          setCurTab={setCurTab}
          tabs={tabData}
          tabStyles={{}}
        /> */}
      </Grid>
    </Grid>
  )
}

export default RuleViolatingDetails
