import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategories, type ProductCategory } from '@/services/categories.service'
import { addLoading, removeLoading } from './store-loading.slice'
import { LOADING_CATEGORIES } from '@/lib/constants/loading.constants'

interface CategoriesState {
  categories: ProductCategory[]
}

const initialState: CategoriesState = {
  categories: [],
}

export const fetchCategories = createAsyncThunk<
  ProductCategory[],
  void,
  { rejectValue: string }
>('categories/fetchCategories', async (_, thunkApi) => {
  thunkApi.dispatch(addLoading(LOADING_CATEGORIES))
  try {
    return await getCategories()
  } catch (error) {
    return thunkApi.rejectWithValue(error instanceof Error ? error.message : 'Unexpected categories error.')
  } finally {
    thunkApi.dispatch(removeLoading(LOADING_CATEGORIES))
  }
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categories = []
      })
  },
})

export const categoriesReducer = categoriesSlice.reducer
