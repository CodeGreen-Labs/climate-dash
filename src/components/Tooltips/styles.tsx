import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    minWidth: 'fit-content',
    padding: '16px 24px',
  },
}))

export { LightTooltip }
