import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { categoriesReducer } from '@/store/slices/categories.slice'
import { cartReducer } from '@/store/slices/cart.slice'
import { checkoutReducer } from '@/store/slices/checkout.slice'
import { productsReducer } from '@/store/slices/products.slice'
import { storeLoadingReducer } from '@/store/slices/store-loading.slice'
import type { RootState } from '@/store/store'

const rootReducer = combineReducers({
  categories: categoriesReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  products: productsReducer,
  storeLoading: storeLoadingReducer,
})

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: ReturnType<typeof createTestStore>
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
