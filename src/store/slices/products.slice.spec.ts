import { fetchProducts, productsReducer } from './products.slice'
import { getProducts, getProductBySlug } from '@/services/products.service'

jest.mock('@/services/products.service')

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>
const mockGetProductBySlug = getProductBySlug as jest.MockedFunction<typeof getProductBySlug>

const mockProduct = {
  id: 1,
  name: 'Product 1',
  slug: 'product-1',
  price: '10',
  productFee: '1',
  deliveryFee: '2',
  category: { id: 1, name: 'Cat', slug: 'cat' },
}

describe('products slice', () => {
  beforeEach(() => {
    mockGetProducts.mockReset()
    mockGetProductBySlug.mockReset()
  })

  describe('fetchProducts', () => {
    it('fetches products with category', async () => {
      const products = [mockProduct]
      mockGetProducts.mockResolvedValue(products)

      const dispatch = jest.fn()
      const thunk = fetchProducts('electronics')
      await thunk(dispatch, jest.fn(), undefined)

      expect(mockGetProducts).toHaveBeenCalledWith('electronics')
    })

    it('fetches all products when category is all', async () => {
      mockGetProducts.mockResolvedValue([])
      const dispatch = jest.fn()
      await fetchProducts('all')(dispatch, jest.fn(), undefined)
      expect(mockGetProducts).toHaveBeenCalledWith(undefined)
    })

    it('stores products on fulfilled', () => {
      const initialState = productsReducer(undefined, { type: 'init' })
      const state = productsReducer(initialState, {
        type: 'products/fetchProducts/fulfilled',
        payload: [mockProduct],
      })
      expect(state.products).toEqual([mockProduct])
    })

    it('clears products on rejected', () => {
      let state = productsReducer(undefined, { type: 'init' })
      state = productsReducer(state, {
        type: 'products/fetchProducts/fulfilled',
        payload: [mockProduct],
      })
      state = productsReducer(state, { type: 'products/fetchProducts/rejected' })
      expect(state.products).toEqual([])
    })
  })

  describe('fetchProductBySlug', () => {
    it('clears selectedProduct on pending', () => {
      let state = productsReducer(undefined, { type: 'init' })
      state = productsReducer(state, {
        type: 'products/fetchProductBySlug/fulfilled',
        payload: mockProduct,
      })
      state = productsReducer(state, { type: 'products/fetchProductBySlug/pending' })
      expect(state.selectedProduct).toBeNull()
    })

    it('sets selectedProduct on fulfilled', () => {
      const initialState = productsReducer(undefined, { type: 'init' })
      const state = productsReducer(initialState, {
        type: 'products/fetchProductBySlug/fulfilled',
        payload: mockProduct,
      })
      expect(state.selectedProduct).toEqual(mockProduct)
    })

    it('clears selectedProduct on rejected', () => {
      let state = productsReducer(undefined, { type: 'init' })
      state = productsReducer(state, {
        type: 'products/fetchProductBySlug/fulfilled',
        payload: mockProduct,
      })
      state = productsReducer(state, { type: 'products/fetchProductBySlug/rejected' })
      expect(state.selectedProduct).toBeNull()
    })
  })
})
