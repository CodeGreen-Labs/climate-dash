import { Grid, Paper } from '@mui/material'
import { ReactNode } from 'react'

import type { TabFormProps } from '@/types/tabFormTypes'

import { BackBtn } from '../Button'
import BtnWithTooltips from '../Button/BtnWithTooltips'
import TabForm from '../TabForm'

interface Props extends TabFormProps {
  onClickEdit: () => void
  header: ReactNode
  isCommitting: boolean
}

const Details = ({
  onClickEdit,
  header,
  tabs,
  curTab,
  setCurTab,
  isCommitting,
}: Props) => {
  return (
    <Grid container flex={1} flexDirection="column" gap={2} pb={5}>
      <Grid container flexDirection="column" gap={2}>
        {/* buttons */}
        <Grid container item justifyContent="space-between">
          <Grid item>
            <BackBtn />
          </Grid>
          <Grid item>
            <BtnWithTooltips onClick={onClickEdit} disabled={isCommitting} />
          </Grid>
        </Grid>
        {/* header */}
        <Grid container item>
          <Grid>{header}</Grid>
        </Grid>
      </Grid>
      <Grid item container flex={1} component={Paper}>
        <TabForm curTab={curTab} setCurTab={setCurTab} tabs={tabs} />
      </Grid>
    </Grid>
  )
}

export default Details
