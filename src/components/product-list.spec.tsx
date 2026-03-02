import { renderWithProviders, screen } from '@/__tests__/utils/test-utils'
import { ProductList } from './product-list'

jest.mock('@/store/slices/categories.slice', () => ({
  ...jest.requireActual('@/store/slices/categories.slice'),
  fetchCategories: jest.fn(() => ({ type: 'mock/fetchCategories' })),
}))

jest.mock('@/store/slices/products.slice', () => ({
  ...jest.requireActual('@/store/slices/products.slice'),
  fetchProducts: jest.fn(() => ({ type: 'mock/fetchProducts' })),
}))

const preloadedState = {
  categories: { categories: [] },
  products: { products: [], selectedProduct: null },
} as any

function renderProductList(stateOverrides?: object) {
  return renderWithProviders(<ProductList />, {
    preloadedState: stateOverrides
      ? { ...preloadedState, ...stateOverrides }
      : preloadedState,
  })
}

describe('ProductList', () => {
  it('renders catalog header', () => {
    renderProductList()
    expect(screen.getByText('Catalog')).toBeInTheDocument()
    expect(screen.getByText(/available products/i)).toBeInTheDocument()
  })

  it('shows All category button', () => {
    renderProductList()
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
  })

  it('shows no products message when empty', () => {
    renderProductList()
    expect(screen.getByText(/no products found/i)).toBeInTheDocument()
  })

  it('renders products when available', () => {
    const products = [
      {
        id: 1,
        name: 'Product 1',
        slug: 'product-1',
        price: '10',
        productFee: '1',
        deliveryFee: '2',
        category: { id: 1, name: 'Cat', slug: 'cat' },
      },
    ]
    renderProductList({
      categories: { categories: [{ id: 1, name: 'Cat', slug: 'cat' }] },
      products: { products, selectedProduct: null },
    })
    expect(screen.getByText('Product 1')).toBeInTheDocument()
  })
})
