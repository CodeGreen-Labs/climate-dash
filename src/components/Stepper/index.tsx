import { ChevronRight } from '@mui/icons-material'
import { Box, Step, StepLabel, Stepper } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  steps: string[]
  activeStep: number
}

const HorizontalLinearStepper = ({ steps, activeStep }: Props) => {
  const { t } = useTranslation()
  return (
    <Box>
      <Stepper activeStep={activeStep} connector={<ChevronRight />}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{t(label)}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </Box>
  )
}

export default HorizontalLinearStepper
