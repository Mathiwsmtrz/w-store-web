import { fetchCategories, categoriesReducer } from './categories.slice'
import { getCategories } from '@/services/categories.service'

jest.mock('@/services/categories.service')

const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>

describe('categories slice', () => {
  beforeEach(() => {
    mockGetCategories.mockReset()
  })

  describe('fetchCategories', () => {
    it('fetches and stores categories on success', async () => {
      const categories = [{ id: 1, name: 'Electronics', slug: 'electronics' }]
      mockGetCategories.mockResolvedValue(categories)

      const dispatch = jest.fn()
      const getState = jest.fn()
      const thunk = fetchCategories()
      const result = await thunk(dispatch, getState, undefined)

      expect(mockGetCategories).toHaveBeenCalled()
      expect(result.type).toBe('categories/fetchCategories/fulfilled')
      expect(result.payload).toEqual(categories)
    })

    it('rejects with error message on failure', async () => {
      mockGetCategories.mockRejectedValue(new Error('Network error'))

      const dispatch = jest.fn()
      const getState = jest.fn()
      const thunk = fetchCategories()
      const result = await thunk(dispatch, getState, undefined)

      expect(result.type).toBe('categories/fetchCategories/rejected')
    })
  })

  describe('categoriesReducer', () => {
    const initialState = categoriesReducer(undefined, { type: 'init' })

    it('sets categories on fulfilled', () => {
      const categories = [{ id: 1, name: 'Tech', slug: 'tech' }]
      const state = categoriesReducer(initialState, {
        type: 'categories/fetchCategories/fulfilled',
        payload: categories,
      })
      expect(state.categories).toEqual(categories)
    })

    it('clears categories on rejected', () => {
      let state = categoriesReducer(initialState, {
        type: 'categories/fetchCategories/fulfilled',
        payload: [{ id: 1, name: 'A', slug: 'a' }],
      })
      state = categoriesReducer(state, { type: 'categories/fetchCategories/rejected' })
      expect(state.categories).toEqual([])
    })
  })
})
