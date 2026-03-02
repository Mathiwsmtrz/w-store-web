import { renderWithProviders, screen, userEvent } from '@/__tests__/utils/test-utils'
import { CartSheet } from './cart-sheet'

describe('CartSheet', () => {
  const onOpenChange = jest.fn()

  beforeEach(() => {
    onOpenChange.mockClear()
  })

  it('shows empty message when cart is empty', () => {
    renderWithProviders(<CartSheet open={true} onOpenChange={onOpenChange} />)
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('shows cart items when cart has items', () => {
    renderWithProviders(<CartSheet open={true} onOpenChange={onOpenChange} />, {
      preloadedState: {
        cart: {
          itemsById: {
            '1': {
              productId: 1,
              slug: 'p1',
              title: 'Product 1',
              price: '10',
              productFee: '1',
              deliveryFee: '2',
              quantity: 2,
            },
          },
        },
      } as any,
    })
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('clear cart button is disabled when empty', () => {
    renderWithProviders(<CartSheet open={true} onOpenChange={onOpenChange} />)
    expect(screen.getByRole('button', { name: /clear cart/i })).toBeDisabled()
  })

  it('dispatches clearCart when clear button clicked', async () => {
    const { store } = renderWithProviders(<CartSheet open={true} onOpenChange={onOpenChange} />, {
      preloadedState: {
        cart: {
          itemsById: {
            '1': {
              productId: 1,
              slug: 'p1',
              title: 'P1',
              price: '10',
              productFee: '1',
              deliveryFee: '2',
              quantity: 1,
            },
          },
        },
      } as any,
    })
    await userEvent.click(screen.getByRole('button', { name: /clear cart/i }))
    const state = store.getState()
    expect(state.cart.itemsById).toEqual({})
  })

  it('has link to checkout', () => {
    renderWithProviders(<CartSheet open={true} onOpenChange={onOpenChange} />)
    expect(screen.getByRole('link', { name: /go to checkout/i })).toHaveAttribute('href', '/checkout')
  })
})
