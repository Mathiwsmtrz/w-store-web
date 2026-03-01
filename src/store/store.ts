import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { categoriesReducer } from './slices/categories.slice'
import { cartReducer } from './slices/cart.slice'
import { checkoutReducer } from './slices/checkout.slice'
import { productsReducer } from './slices/products.slice'
import { storeLoadingReducer } from './slices/store-loading.slice'

const rootReducer = combineReducers({
  categories: categoriesReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  products: productsReducer,
  storeLoading: storeLoadingReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'checkout'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
