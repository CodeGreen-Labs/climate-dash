import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MenuIcon from '@mui/icons-material/Menu'
import RefreshIcon from '@mui/icons-material/Refresh'
import { IconButton, Stack, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import AppBar from '@/components/AppHeaderBar'
import LanguageSelector from '@/components/LanguageSelector'
import { useAppDispatch, useTypedSelector } from '@/store'
import {
  handleCloseMainMenu,
  handleOpenMainMenu,
} from '@/store/slices/layoutSlices'

import PageHeading from './PageHeading'

const Header = ({ displayMenu }: { displayMenu: boolean }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const open = useTypedSelector((state) => state.layout.openMainMenu)

  const handleToggleMainMenu = () => {
    if (open) {
      dispatch(handleCloseMainMenu())
    } else {
      dispatch(handleOpenMainMenu())
    }
  }

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            sx={{
              width: 215,
              borderRight: (theme) => `1px ${theme.palette.grey[300]}  solid`,
            }}
          >
            {displayMenu ? (
              <IconButton
                color="inherit"
                onClick={handleToggleMainMenu}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <img
              src="./logo.png"
              alt="logo"
              style={{ cursor: 'pointer' }}
              width={150}
              onClick={() => {
                navigate('/')
              }}
            />
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            <PageHeading />
            <IconButton onClick={() => navigate(0)}>
              <RefreshIcon
                sx={{ color: (theme) => theme.palette.common.black }}
              />
            </IconButton>
          </Stack>
        </Stack>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
        >
          <LanguageSelector />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {}
export default Header
