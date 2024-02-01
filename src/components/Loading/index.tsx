import { CircularProgress, Grid, styled, SxProps } from '@mui/material'

export const Overlay = styled(Grid)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
})

interface ILoading {
  isLoading?: boolean
  sx?: SxProps
}
const Loading = ({ isLoading, ...props }: ILoading) => {
  return (
    <>
      {isLoading && (
        <Overlay {...props}>
          <CircularProgress />
        </Overlay>
      )}
    </>
  )
}

export default Loading
