import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Collapse,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  BasicNavigation,
  drawerWidth,
  navigationList,
} from '@/constants/navigationConfig'
import { defaultRole, permissions } from '@/constants/role'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const NavigationItem = ({
  title,
  icon,
  sub,
  path,
}: {
  title: ReactNode
  icon: ReactNode
  path: string
  sub?: BasicNavigation[]
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(true)
  const theme = useTheme()

  const isMainPathActive = location.pathname.startsWith(`/${path}`)
  const textColor = isMainPathActive
    ? theme.palette.primary.main
    : theme.palette.text.primary

  const { t } = useTranslation('nav')

  const handleToggleList = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItemButton
        onClick={() => {
          if (sub) {
            handleToggleList()
          } else {
            navigate(`/${path}`)
          }
        }}
        sx={{
          marginBottom: 1,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 34,
            color: textColor,
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={t(title as string)}
          primaryTypographyProps={{
            color: textColor,
          }}
        />
        {sub && <>{open ? <ExpandLess /> : <ExpandMore />}</>}
      </ListItemButton>
      {sub && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {sub.map((item, index) => {
              const isActiveThisPath =
                item.path ===
                (item?.isFuzzy
                  ? location.pathname.slice(0, item.path.length)
                  : location.pathname)

              return (
                <ListItemButton
                  key={index}
                  onClick={() => {
                    navigate(item.path)
                  }}
                  sx={{
                    backgroundColor: () =>
                      isActiveThisPath ? `#E6F5FC` : 'none',
                    color: isActiveThisPath
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    paddingLeft: '50px',
                    marginBottom: 1,
                    borderRight: (theme) =>
                      isActiveThisPath
                        ? `4px solid ${theme.palette.primary.main}`
                        : 'none',
                  }}
                >
                  <ListItemText primary={t(item.title as string)} />
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
      )}
    </>
  )
}

const Navigation = () => {
  const permission = permissions[defaultRole] || []

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
      open={true}
      transitionDuration={0}
    >
      <DrawerHeader></DrawerHeader>
      <Stack direction={'row'} sx={{ height: '100%' }}>
        <Grid
          container
          flexDirection="column"
          spacing={2}
          alignItems="center"
          justifyContent="flex-start"
          id="nav"
          sx={{
            paddingTop: '1em',
            paddingLeft: '1em',
            background: '#F9F9F9',
          }}
        >
          <List sx={{ width: '100%' }}>
            {navigationList
              .filter((item) => permission.includes(item.path))
              .map((item) => (
                <NavigationItem key={item.path} {...item} />
              ))}
          </List>
        </Grid>
      </Stack>
    </Drawer>
  )
}

export default Navigation
