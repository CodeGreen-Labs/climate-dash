import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { JacobianPoint } from '@rigidity/bls-signatures'

import { ChainEnum } from '@/types/chia'
import {
  Asset,
  Assets,
  EncryptedData,
  exportAssetDetail,
  WalletStorageKeyEnum,
} from '@/types/walletTypes'
import {
  bytesToString,
  decrypt,
  encrypt,
  generateSeedFromMnemonic,
  getWalletPublicKey,
  publicKeyToPuzzle,
  stringToBytes,
  validateMnemonicPhrase,
} from '@/utils/chia'
import { getStorage, removeStorage, setStorage } from '@/utils/storage'

import { startAppListening } from '../listenerMiddleware'

const assetsAdapter = createEntityAdapter<Asset>({
  selectId: (asset) => asset.assetId,
})

interface State {
  loadingSeed: boolean
  seed?: Uint8Array
  puzzleHash?: string
  assets: ReturnType<typeof assetsAdapter.getInitialState>
  publicKey?: JacobianPoint
  chain: ChainEnum
  exportAssetList: Record<string, exportAssetDetail>
}

const assets = getStorage<Assets>(WalletStorageKeyEnum.ASSETS) || {}

const initialState: State = {
  loadingSeed: false,
  seed: undefined,
  puzzleHash: undefined,
  publicKey: undefined,
  assets: assetsAdapter.getInitialState({
    ids: Object.keys(assets),
    entities: Object.values(assets),
  }),
  chain: import.meta.env.VITE_NETWORK,
  exportAssetList: {},
}

export const storeEncryptSeed = createAsyncThunk(
  'wallet/storeEncryptSeed',
  async ({ mnemonic }: { mnemonic: string }) => {
    if (!(await validateMnemonicPhrase(mnemonic))) {
      throw new Error('wallet:import.invalid')
    }

    const encryptedPassword = bytesToString(
      crypto.getRandomValues(new Uint8Array(64))
    )

    const seed = await generateSeedFromMnemonic(mnemonic)

    const encryptedData = await encrypt(encryptedPassword, bytesToString(seed))

    setStorage<EncryptedData>(WalletStorageKeyEnum.ENCRYPTED_DATA, {
      salt: encryptedData.salt,
      cipherText: encryptedData.cipherText,
      encryptedPassword,
    })
    return { seed }
  }
)

export const decryptStoreSeed = createAsyncThunk(
  'wallet/decryptStoreSeed',
  async () => {
    const encryptedData = getStorage<EncryptedData>(
      WalletStorageKeyEnum.ENCRYPTED_DATA
    )

    if (!encryptedData) {
      throw new Error('No encrypted data found')
    }

    const seedString = await decrypt(
      encryptedData.salt,
      encryptedData.cipherText,
      encryptedData.encryptedPassword
    )
    const seed = stringToBytes(seedString)

    return { seed }
  }
)

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWallet: (state) => {
      state.seed = undefined
      state.puzzleHash = undefined
      removeStorage(WalletStorageKeyEnum.ENCRYPTED_DATA)
      removeStorage(WalletStorageKeyEnum.ASSETS)
    },
    updatePuzzleHash: (state) => {
      if (state.seed === undefined) {
        return
      }
      const publicKey = getWalletPublicKey(state.seed)
      const puzzle = publicKeyToPuzzle(publicKey)

      const puzzleHash = puzzle.hashHex()
      state.puzzleHash = puzzleHash
      state.publicKey = publicKey
    },
    updateAssets: (state, action: PayloadAction<Assets>) => {
      assetsAdapter.upsertMany(state.assets, action.payload)
      const assets = Object.fromEntries(
        assetsAdapter
          .getSelectors()
          .selectAll(state.assets)
          .map((asset) => [asset.assetId, asset])
      )
      setStorage<Assets>(WalletStorageKeyEnum.ASSETS, assets)
    },
    updateExportAssets: (state, action: PayloadAction<exportAssetDetail>) => {
      const exportAssetList = {
        ...state.exportAssetList,
        [action.payload.assetId]: action.payload,
      }

      state.exportAssetList = exportAssetList
    },
  },
  extraReducers: (builder) => {
    builder
      // storeEncryptSeed
      .addCase(storeEncryptSeed.pending, (state) => {
        state.loadingSeed = true
      })
      .addCase(storeEncryptSeed.fulfilled, (state, action) => {
        state.loadingSeed = false
        state.seed = action.payload.seed
      })
      .addCase(storeEncryptSeed.rejected, (state) => {
        state.loadingSeed = false
      })
      // decryptStoreSeed
      .addCase(decryptStoreSeed.pending, (state) => {
        state.loadingSeed = true
      })
      .addCase(decryptStoreSeed.fulfilled, (state, action) => {
        state.loadingSeed = false
        state.seed = action.payload.seed
      })
      .addCase(decryptStoreSeed.rejected, (state) => {
        state.loadingSeed = false
      })
  },
})

export const {
  clearWallet,
  updatePuzzleHash,
  updateAssets,
  updateExportAssets,
} = walletSlice.actions

export const assetsSelectors = assetsAdapter.getSelectors<{ wallet: State }>(
  (state) => state.wallet.assets
).selectAll

export const assetByIdSelector = assetsAdapter.getSelectors<{
  wallet: State
}>((state) => state.wallet.assets).selectById

startAppListening({
  predicate: (action, currentState, previousState) => {
    return (
      currentState.wallet.seed !== previousState.wallet.seed &&
      !!currentState.wallet.seed
    )
  },
  effect: (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    listenerApi.dispatch(walletSlice.actions.updatePuzzleHash())
  },
})

export default walletSlice.reducer
