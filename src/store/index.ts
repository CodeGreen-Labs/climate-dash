import chiaApi, {
  api as chiaApiSlice,
  walletApi,
} from '@codegreen-labs/api-react'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import {
  climateExplorerApi,
  climateTokenDriverApi,
  climateWarehouseApi,
  dataLayerApi,
} from '@/services'
import { IStrayCat, IWallet } from '@/types/chiaApi'
import { prefix0x, removePrefix0x } from '@/utils/chia'

import { listenerMiddleware, startAppListening } from './listenerMiddleware'
import filterSlices from './slices/filterSlices'
import layoutSlices from './slices/layoutSlices'
import tableDataReducer from './slices/tableDataSlices'
import walletReducer, { decryptStoreSeed } from './slices/walletSlices'

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    layout: layoutSlices,
    tableData: tableDataReducer,
    filter: filterSlices,
    api: chiaApiSlice.default,
    [chiaApi.reducerPath]: chiaApi.reducer,
    [dataLayerApi.reducerPath]: dataLayerApi.reducer,
    [climateWarehouseApi.reducerPath]: climateWarehouseApi.reducer,
    [climateTokenDriverApi.reducerPath]: climateTokenDriverApi.reducer,
    [climateExplorerApi.reducerPath]: climateExplorerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .prepend(listenerMiddleware.middleware)
      .concat(
        chiaApi.middleware,
        dataLayerApi.middleware,
        climateWarehouseApi.middleware,
        climateTokenDriverApi.middleware,
        climateExplorerApi.middleware
      ),
})

// Decrypt store seed from local storage if it exists and store it in redux store
if (!store.getState().wallet.seed) {
  store.dispatch(decryptStoreSeed())
}

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
export default store

startAppListening({
  matcher: climateWarehouseApi.endpoints.getAllUnits.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    const units = action.payload
    const { data: wallets } = await listenerApi.dispatch(
      walletApi.endpoints.getWallets.initiate(undefined)
    )
    const { data: strayCats } = await listenerApi.dispatch(
      walletApi.endpoints.getStrayCats.initiate(undefined)
    )
    // prevent creating duplicate wallets if stray cats not updated accidentially
    const strayCatAssetIds = (strayCats || [])
      .filter(
        (cat) =>
          !wallets?.find(
            (wallet) =>
              (wallet as IWallet).meta.assetId === (cat as IStrayCat).assetId
          )
      )
      .map((cat) => prefix0x(cat.assetId))
    const strayClimateTokens = units.filter((unit) =>
      strayCatAssetIds?.includes(prefix0x(unit.marketplaceIdentifier || ''))
    )
    for (const climateToken of strayClimateTokens) {
      const { data: project } = await listenerApi.dispatch(
        climateWarehouseApi.endpoints.getProjectById.initiate(
          climateToken.issuance.warehouseProjectId
        )
      )
      if (!project || !climateToken.marketplaceIdentifier) continue
      const name = `${project.projectName}(${climateToken.vintageYear})`
      await listenerApi.dispatch(
        walletApi.endpoints.createNewWallet.initiate({
          walletType: 'cat_wallet',
          options: {
            mode: 'existing',
            name,
            asset_id: removePrefix0x(climateToken.marketplaceIdentifier),
          },
        })
      )
    }
  },
})
