import { getProducts, getProductBySlug } from './products.service'
import { apiClient } from '@/lib/api/http-client'

jest.mock('@/lib/api/http-client')

const mockApiGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>

describe('products.service', () => {
  beforeEach(() => {
    mockApiGet.mockReset()
  })

  it('getProducts fetches with category query', async () => {
    const products = [{ id: 1, name: 'P1', slug: 'p1', price: '10', productFee: '1', deliveryFee: '2', category: { id: 1, name: 'C', slug: 'c' } }]
    mockApiGet.mockResolvedValue(products)

    const result = await getProducts('electronics')
    expect(result).toEqual(products)
    expect(mockApiGet).toHaveBeenCalledWith('/list-products', { query: { category: 'electronics' } })
  })

  it('getProducts fetches without category when undefined', async () => {
    mockApiGet.mockResolvedValue([])
    await getProducts(undefined)
    expect(mockApiGet).toHaveBeenCalledWith('/list-products', { query: { category: undefined } })
  })

  it('getProductBySlug fetches by slug', async () => {
    const product = { id: 1, name: 'P1', slug: 'p1', price: '10', productFee: '1', deliveryFee: '2', category: { id: 1, name: 'C', slug: 'c' } }
    mockApiGet.mockResolvedValue(product)

    const result = await getProductBySlug('p1')
    expect(result).toEqual(product)
    expect(mockApiGet).toHaveBeenCalledWith('/product/p1')
  })
})
