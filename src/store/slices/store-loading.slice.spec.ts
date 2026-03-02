import {
  storeLoadingReducer,
  addLoading,
  removeLoading,
} from './store-loading.slice'

describe('store-loading slice', () => {
  const initialState = storeLoadingReducer(undefined, { type: 'init' })

  it('has empty activeLoadings initially', () => {
    expect(initialState.activeLoadings).toEqual([])
  })

  describe('addLoading', () => {
    it('adds loading key to activeLoadings', () => {
      const state = storeLoadingReducer(initialState, addLoading('products'))
      expect(state.activeLoadings).toEqual(['products'])
    })

    it('can add multiple loadings', () => {
      let state = storeLoadingReducer(initialState, addLoading('products'))
      state = storeLoadingReducer(state, addLoading('categories'))
      expect(state.activeLoadings).toEqual(['products', 'categories'])
    })
  })

  describe('removeLoading', () => {
    it('removes loading key', () => {
      let state = storeLoadingReducer(initialState, addLoading('products'))
      state = storeLoadingReducer(state, addLoading('categories'))
      state = storeLoadingReducer(state, removeLoading('products'))
      expect(state.activeLoadings).toEqual(['categories'])
    })

    it('does nothing when key not present', () => {
      const state = storeLoadingReducer(initialState, removeLoading('unknown'))
      expect(state.activeLoadings).toEqual([])
    })
  })
})
