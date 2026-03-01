import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProductBySlug, getProducts, type Product } from '@/services/products.service'
import { addLoading, removeLoading } from './store-loading.slice'
import { LOADING_PRODUCT_DETAIL, LOADING_PRODUCTS } from '@/lib/constants/loading.constants'

interface ProductsState {
  products: Product[]
  selectedProduct: Product | null
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
}

export const fetchProducts = createAsyncThunk<Product[], string | undefined>(
  'products/fetchProducts',
  async (category, thunkApi) => {
    const categoryQuery = category && category !== 'all' ? category : undefined
    thunkApi.dispatch(addLoading(LOADING_PRODUCTS))
    return getProducts(categoryQuery).finally(() => {
      thunkApi.dispatch(removeLoading(LOADING_PRODUCTS))
    })
  },
)

export const fetchProductBySlug = createAsyncThunk<Product, string>(
  'products/fetchProductBySlug',
  async (slug, thunkApi) => {
    thunkApi.dispatch(addLoading(LOADING_PRODUCT_DETAIL))
    return getProductBySlug(slug).finally(() => {
      thunkApi.dispatch(removeLoading(LOADING_PRODUCT_DETAIL))
    })
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.products = []
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.selectedProduct = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductBySlug.rejected, (state) => {
        state.selectedProduct = null
      })
  },
})

export const productsReducer = productsSlice.reducer
