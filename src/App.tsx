import { api as chiaApiSlice } from '@codegreen-labs/api-react'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import theme from '@/constants/themeConfig'
import router from '@/router'
import store from '@/store'

const waitForConfig = async () => {
  for (;;) {
    const config = window.ipcRenderer.invoke('getConfig')
    if (config) {
      return config
    }
  }
}

function App() {
  const [isReady, setIsReady] = useState<boolean>(false)
  const initialize = async () => {
    const config = await waitForConfig()
    const { url, cert, key } = config

    store.dispatch(
      chiaApiSlice.initializeConfig({
        url,
        cert,
        key,
        webSocket: window.require('ws'),
      })
    )
    setIsReady(true)
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <Provider store={store}>
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {isReady ? <RouterProvider router={router} /> : <></>}
          </LocalizationProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </Provider>
  )
}

export default App
