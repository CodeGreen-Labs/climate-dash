import { createTheme, SxProps } from '@mui/material'

const colors = {
  textPrimary: 'rgba(0, 0, 0, 0.87)',
}

const theme = createTheme({
  palette: {
    table: {
      row: {
        even: '#FFFFF',
        odd: '#F9F9F9',
        hover: '#f5f5f5',
      },
      error: {
        fill: '#2F2626',
      },
    },
    info: {
      main: '#096DD9',
    },
    error: {
      main: '#D32F2F',
      dark: '#BF2424',
    },

    primary: {
      main: '#03ADF4',
      light: '#35BDF6',
      dark: '#0398D7',
      contrastText: '#ffffff',
      background: '#03ADF414',
    },

    secondary: {
      main: '#FF7F1D',
      light: '#FF994A',
      dark: '#E0701A',
      contrastText: '#FFFFFF',
    },

    text: {
      primary: colors.textPrimary,
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },

    background: {
      default: '#eaeef1',
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '65px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&Mui-selected': {
            backgroundColor: '#E91E63',
            color: '#E91E63',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: colors.textPrimary,
          background: 'rgba(0, 0, 0, 0.08)',
        },
        colorError: {
          color: '#D32F2F',
          backgroundColor: '#FDEDED',
        },
        colorWarning: {
          color: '#E24700',
          backgroundColor: '#FFF4E5',
        },
        colorInfo: {
          color: '#1976D2',
          backgroundColor: '#E5F6FD',
        },
        colorSuccess: {
          color: '#388E3C',
          backgroundColor: '#E9F6EC',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const defaultStyle: SxProps = {
            ':hover': {
              opacity: 0.96,
            },
            ':selected': {
              opacity: 0.92,
            },
            ':focus': {
              opacity: 0.88,
            },
            ':focus-visible': {
              opacity: 0.7,
            },
          }
          if (ownerState?.color === 'inherit') {
            return {
              ...defaultStyle,
              ':hover': {
                opacity: 1,
                backgroundColor: '#E8E8E8',
              },
            }
          }

          return defaultStyle
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          borderWidth: '1px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#616161E5',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: '20px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          '&.Mui-disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // Apply styles to the root element of Typography
          color: colors.textPrimary,
        },
      },
    },
  },
})

export const WalletBgColor = '#F8F9FD'

export default theme
