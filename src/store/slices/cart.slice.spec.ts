import {
  cartReducer,
  addOne,
  removeOne,
  removeItem,
  setQuantity,
  clearCart,
  selectCartItems,
  selectCartTotalItems,
  selectCartSubtotal,
  selectCartGrandTotal,
  selectCartItemQuantityByProductId,
  type CartState,
} from './cart.slice'

const productPayload = {
  id: 1,
  slug: 'test-product',
  name: 'Test Product',
  price: '10.00',
  productFee: '1.00',
  deliveryFee: '2.00',
  image: 'https://example.com/image.jpg',
}

describe('cart slice', () => {
  const initialState: CartState = {
    itemsById: {},
  }

  describe('addOne', () => {
    it('adds new product to cart with quantity 1', () => {
      const state = cartReducer(initialState, addOne(productPayload))
      expect(state.itemsById['1']).toEqual({
        productId: 1,
        slug: 'test-product',
        title: 'Test Product',
        price: '10.00',
        productFee: '1.00',
        deliveryFee: '2.00',
        image: 'https://example.com/image.jpg',
        quantity: 1,
      })
    })

    it('increments quantity when product already exists', () => {
      const stateWithItem = cartReducer(initialState, addOne(productPayload))
      const state = cartReducer(stateWithItem, addOne(productPayload))
      expect(state.itemsById['1']?.quantity).toBe(2)
    })
  })

  describe('removeOne', () => {
    it('decrements quantity when more than 1', () => {
      let state = cartReducer(initialState, addOne(productPayload))
      state = cartReducer(state, addOne(productPayload))
      state = cartReducer(state, removeOne(1))
      expect(state.itemsById['1']?.quantity).toBe(1)
    })

    it('removes item when quantity is 1', () => {
      let state = cartReducer(initialState, addOne(productPayload))
      state = cartReducer(state, removeOne(1))
      expect(state.itemsById['1']).toBeUndefined()
    })

    it('does nothing when product does not exist', () => {
      const state = cartReducer(initialState, removeOne(999))
      expect(state).toEqual(initialState)
    })
  })

  describe('removeItem', () => {
    it('removes item completely regardless of quantity', () => {
      let state = cartReducer(initialState, addOne(productPayload))
      state = cartReducer(state, addOne(productPayload))
      state = cartReducer(state, removeItem(1))
      expect(state.itemsById['1']).toBeUndefined()
    })
  })

  describe('setQuantity', () => {
    it('updates quantity for existing item', () => {
      let state = cartReducer(initialState, addOne(productPayload))
      state = cartReducer(state, setQuantity({ productId: 1, quantity: 5 }))
      expect(state.itemsById['1']?.quantity).toBe(5)
    })

    it('removes item when quantity is set to 0', () => {
      let state = cartReducer(initialState, addOne(productPayload))
      state = cartReducer(state, setQuantity({ productId: 1, quantity: 0 }))
      expect(state.itemsById['1']).toBeUndefined()
    })

    it('normalizes negative quantity to 0 and removes item', () => {
      let state = cartReducer(initialState, addOne(productPayload))
      state = cartReducer(state, setQuantity({ productId: 1, quantity: -5 }))
      expect(state.itemsById['1']).toBeUndefined()
    })

    it('does nothing when product does not exist', () => {
      const state = cartReducer(initialState, setQuantity({ productId: 999, quantity: 3 }))
      expect(state).toEqual(initialState)
    })
  })

  describe('clearCart', () => {
    it('removes all items', () => {
      let state = cartReducer(initialState, addOne(productPayload))
      state = cartReducer(state, addOne({ ...productPayload, id: 2, slug: 'other', name: 'Other' }))
      state = cartReducer(state, clearCart())
      expect(state.itemsById).toEqual({})
    })
  })
})

describe('cart selectors', () => {
  const stateWithItems = {
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
        '2': {
          productId: 2,
          slug: 'p2',
          title: 'Product 2',
          price: '5',
          productFee: '0.5',
          deliveryFee: '1',
          quantity: 1,
        },
      },
    },
    categories: { categories: [], loading: false },
    products: { products: [], loading: false },
    checkout: {
      currentStep: 'customer',
      customerInfo: {} as any,
      paymentInfo: {} as any,
      wompi: {} as any,
      isOrderCompleted: false,
      orderCode: null,
    },
    storeLoading: { activeLoadings: [] },
  } as any

  it('selectCartItems returns array of items', () => {
    const items = selectCartItems(stateWithItems)
    expect(items).toHaveLength(2)
    expect(items.map((i) => i.productId)).toContain(1)
    expect(items.map((i) => i.productId)).toContain(2)
  })

  it('selectCartTotalItems returns total quantity', () => {
    expect(selectCartTotalItems(stateWithItems)).toBe(3)
  })

  it('selectCartSubtotal calculates correctly', () => {
    expect(selectCartSubtotal(stateWithItems)).toBe(25) // 10*2 + 5*1
  })

  it('selectCartGrandTotal includes taxes and shipping', () => {
    const subtotal = 25
    const taxes = 2.5 // 1*2 + 0.5*1
    const shipping = 5 // 2*2 + 1*1
    expect(selectCartGrandTotal(stateWithItems)).toBe(subtotal + taxes + shipping)
  })

  it('selectCartItemQuantityByProductId returns quantity for product', () => {
    expect(selectCartItemQuantityByProductId(1)(stateWithItems)).toBe(2)
    expect(selectCartItemQuantityByProductId(2)(stateWithItems)).toBe(1)
    expect(selectCartItemQuantityByProductId(999)(stateWithItems)).toBe(0)
  })
})
