import { Box, Container, styled } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { drawerWidth, headerHeight } from '@/constants/navigationConfig'
import Header from '@/layout/Header'
import Navigation from '@/layout/Navigation'
import { useTypedSelector } from '@/store'

interface Props {
  displayMenu?: boolean
  fullWidth?: boolean
}

const RootBox = styled(Box)(() => ({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
}))

export const StyledContainer = styled(Container)<{ fullWidth?: boolean }>(
  ({ theme, fullWidth }) => ({
    minWidth: fullWidth ? '100%' : 1200,
    maxWidth: fullWidth ? '100%' : 1336,
    height: '100%',
    paddingTop: fullWidth ? theme.spacing(0) : theme.spacing(3),
  })
)

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean
}>(({ theme, open }) => ({
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: 0,
  }),
  marginLeft: 0,
  marginTop: `${headerHeight}px`,

  flex: 1,
  flexGrow: 1,
  overflowY: 'auto', // Allow vertical scrolling if needed
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: 0,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}))

const Index = ({ displayMenu = true, fullWidth }: Props) => {
  const open = useTypedSelector((state) => state.layout.openMainMenu)

  return (
    <RootBox>
      <Header displayMenu={displayMenu} />
      {open && displayMenu && <Navigation />}
      <Main open={open && displayMenu}>
        <StyledContainer
          fullWidth={!!fullWidth}
          fixed
          maxWidth={!fullWidth ? 'xl' : false}
          disableGutters={!!fullWidth}
        >
          <Outlet />
        </StyledContainer>
      </Main>
    </RootBox>
  )
}

Index.propTypes = {}

export default Index
