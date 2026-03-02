import { createOrder, getOrderByCode, createWompiTransaction } from './orders.service'
import { apiClient } from '@/lib/api/http-client'

jest.mock('@/lib/api/http-client')

const mockApiPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>
const mockApiGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>

describe('orders.service', () => {
  beforeEach(() => {
    mockApiPost.mockReset()
    mockApiGet.mockReset()
  })

  it('createOrder posts to /new-order', async () => {
    mockApiPost.mockResolvedValue({ code: 'ORD-123' })

    const payload = {
      customer: { fullname: 'J', email: 'j@x.com', address: { address: 'A', city: 'C', state: 'S', country: 'Co' } },
      method: 'COD' as const,
      items: [{ productId: 1, quantity: 2 }],
    }
    const result = await createOrder(payload)
    expect(result).toEqual({ code: 'ORD-123' })
    expect(mockApiPost).toHaveBeenCalledWith('/new-order', payload)
  })

  it('getOrderByCode gets order by code', async () => {
    const order = { id: 1, code: 'ORD-1', status: 'PAID', method: 'WOMPI', date: '', total: '100', net: '95', fees: '5', deliveryCost: '0', customer: {}, details: [], payments: [] }
    mockApiGet.mockResolvedValue(order)

    const result = await getOrderByCode('ORD-1')
    expect(result).toEqual(order)
    expect(mockApiGet).toHaveBeenCalledWith('/orders/ORD-1')
  })

  it('createWompiTransaction posts payload', async () => {
    mockApiPost.mockResolvedValue({ orderCode: 'ORD-1', reference: 'ref', amountInCents: 10000, currency: 'COP', publicKey: 'pk', acceptanceToken: null, integritySignature: null, customerEmail: 'x@x.com' })

    const result = await createWompiTransaction({ orderCode: 'ORD-1' })
    expect(result.orderCode).toBe('ORD-1')
    expect(result.reference).toBe('ref')
    expect(mockApiPost).toHaveBeenCalledWith('/payments/wompi/transaction', { orderCode: 'ORD-1' })
  })
})
