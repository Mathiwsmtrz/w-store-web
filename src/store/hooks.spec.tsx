import { renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { Provider } from 'react-redux'
import { createTestStore } from '@/__tests__/utils/test-utils'
import { useAppDispatch, useAppSelector } from './hooks'

describe('store hooks', () => {
  const store = createTestStore()

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(Provider, { store, children })

  it('useAppDispatch returns dispatch function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper })
    expect(typeof result.current).toBe('function')
  })

  it('useAppSelector returns state', () => {
    const { result } = renderHook(() => useAppSelector((s) => s.cart), { wrapper })
    expect(result.current).toEqual({ itemsById: {} })
  })
})
