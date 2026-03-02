import { getCategories } from './categories.service'
import { apiClient } from '@/lib/api/http-client'

jest.mock('@/lib/api/http-client')

const mockApiGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>

describe('categories.service', () => {
  beforeEach(() => {
    mockApiGet.mockReset()
  })

  it('fetches categories from API', async () => {
    const categories = [{ id: 1, name: 'Electronics', slug: 'electronics' }]
    mockApiGet.mockResolvedValue(categories)

    const result = await getCategories()
    expect(result).toEqual(categories)
    expect(mockApiGet).toHaveBeenCalledWith('/list-categories')
  })
})
