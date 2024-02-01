/// <reference types="vite/client" />

import { ChainEnum } from './types/chia'

interface ImportMetaEnv {
  readonly VITE_DATA_LAYER_END_POINT: string
  readonly VITE_NETWORK: ChainEnum
  readonly VITE_API_CALL_TIMEOUT: string
  readonly VITE_ABLY_API_KEY: string
  readonly VITE_CLIMATE_TOKEN_DRIVER_URL: string
}

declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer
  }
}
