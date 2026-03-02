import {
  LOADING_GLOBAL,
  LOADING_PRODUCTS,
  LOADING_CATEGORIES,
  LOADING_PRODUCT_DETAIL,
} from './loading.constants'

describe('loading.constants', () => {
  it('exports expected loading keys', () => {
    expect(LOADING_GLOBAL).toBe('global')
    expect(LOADING_PRODUCTS).toBe('products')
    expect(LOADING_CATEGORIES).toBe('categories')
    expect(LOADING_PRODUCT_DETAIL).toBe('product-detail')
  })
})
