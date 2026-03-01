import { createSlice } from '@reduxjs/toolkit'

interface StoreLoadingState {
  activeLoadings: string[]
}

const initialState: StoreLoadingState = {
  activeLoadings: [],
}

const storeLoadingSlice = createSlice({
  name: 'storeLoading',
  initialState,
  reducers: {
    addLoading: (state, action: { payload: string }) => {
      state.activeLoadings.push(action.payload)
    },
    removeLoading: (state, action: { payload: string }) => {
      const idx = state.activeLoadings.indexOf(action.payload)
      if (idx !== -1) {
        state.activeLoadings.splice(idx, 1)
      }
    },
  },
})

export const { addLoading, removeLoading } = storeLoadingSlice.actions
export const storeLoadingReducer = storeLoadingSlice.reducer
