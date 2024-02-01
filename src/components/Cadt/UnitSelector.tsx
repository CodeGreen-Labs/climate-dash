import { Grid, GridProps, Paper, SxProps, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import UnitRadioCell from '@/components/UnitRadioCell'
import theme from '@/constants/themeConfig'
import { Unit } from '@/types/climateWarehouseTypes'
import { UnitRadio } from '@/types/ruleTypes'

type Props = {
  units: Unit[]
} & UnitRadio

type RowProps = {
  title?: string
  value: any
  valueSx?: SxProps
} & GridProps

const Row = ({ title = '', value, valueSx, ...props }: RowProps) => {
  return (
    <Grid display="flex" direction="row" gap={1} {...props}>
      <Typography variant="body2" color="text.secondary">
        {`${title}${title ? ':' : ''}`}
      </Typography>
      <Typography variant="body2" sx={valueSx}>
        {value}
      </Typography>
    </Grid>
  )
}

const UnitSelector = ({ units, selectedUnitId, ...props }: Props) => {
  const { t } = useTranslation()
  return units.length > 0 ? (
    <Grid height="425px" flex={1} flexDirection="column">
      {units.map((unit) => {
        const isSelected = selectedUnitId === unit.warehouseUnitId
        return (
          <Grid
            item
            flex={0.8}
            container
            direction="row"
            spacing={2}
            p={2}
            mt={2}
            key={`unit-card-${unit.warehouseUnitId}`}
            height="150px"
            component={Paper}
            sx={{
              boxShadow: isSelected ? 'none' : '0px 0px 0px 1px #E0E0E0',
              borderRadius: '4px',
              mt: 2,
              ':first-child:': {
                mt: 0,
              },
            }}
            border={
              isSelected ? `1px solid ${theme.palette.primary.main}` : 'none'
            }
            bgcolor={
              isSelected
                ? theme.palette.primary.background
                : theme.palette.background.paper
            }
          >
            <Grid height="100%">
              <UnitRadioCell
                info={unit}
                selectedUnitId={selectedUnitId}
                {...props}
              />
            </Grid>
            <Grid height="100%" display="flex" direction="column" ml={2}>
              <Row
                id={`vintageYear`}
                value={unit?.vintageYear}
                valueSx={{
                  fontSize: '16px',
                  ml: -1,
                  mb: 1,
                }}
              />
              <Row
                id="serialNumberBlock"
                title={t('rule:data.serial-number-block')}
                value={unit.serialNumberBlock}
              />
              <Row
                id="unitCount"
                title={t('rule:data.unit-count')}
                value={unit.unitCount}
              />
              <Row
                id="unitOwner"
                title={t('rule:data.unit-owner')}
                value={unit.unitOwner}
              />
              <Row
                id="marketplaceIdentifier"
                title={t('rule:data.cat-id')}
                value={unit.marketplaceIdentifier}
              />
            </Grid>
          </Grid>
        )
      })}
    </Grid>
  ) : (
    <Typography> {t('empty')} </Typography>
  )
}

export default UnitSelector
