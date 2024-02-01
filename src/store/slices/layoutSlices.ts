import { createSlice } from '@reduxjs/toolkit'

interface State {
  openMainMenu: boolean
}

const initialState: State = {
  openMainMenu: true,
}

const layoutSlices = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    handleOpenMainMenu: (state) => {
      state.openMainMenu = true
    },
    handleCloseMainMenu: (state) => {
      state.openMainMenu = false
    },
  },
})

export const { handleOpenMainMenu, handleCloseMainMenu } = layoutSlices.actions

export default layoutSlices.reducer
