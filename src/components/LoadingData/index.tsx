import { CircularProgress, Typography } from '@mui/material'

interface Props {
  data: Record<string, any> | undefined
  isLoading: boolean
  paramKey: string
}

const LoadingData = ({ data, isLoading, paramKey }: Props) => {
  if (isLoading) {
    return <CircularProgress size={20} color="primary" />
  }

  return <Typography>{data?.[paramKey]}</Typography>
}

export default LoadingData
