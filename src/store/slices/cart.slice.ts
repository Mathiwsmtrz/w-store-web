import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/services/products.service'
import type { RootState } from '../store'

export interface CartItem {
  productId: number
  slug: string
  title: string
  price: string
  productFee: string
  deliveryFee: string
  image?: string
  quantity: number
}

export interface CartState {
  itemsById: Record<string, CartItem>
}

const initialState: CartState = {
  itemsById: {},
}

type CartProductPayload = Pick<
  Product,
  'id' | 'slug' | 'name' | 'price' | 'image' | 'productFee' | 'deliveryFee'
>

function toCartKey(productId: number | string): string {
  return String(productId)
}

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return 0
  }

  return Math.max(0, Math.floor(quantity))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<CartProductPayload>) => {
      const payload = action.payload
      const key = toCartKey(payload.id)
      const existing = state.itemsById[key]

      if (existing) {
        existing.quantity += 1
        return
      }

      state.itemsById[key] = {
        productId: payload.id,
        slug: payload.slug,
        title: payload.name,
        price: payload.price,
        productFee: payload.productFee,
        deliveryFee: payload.deliveryFee,
        image: payload.image,
        quantity: 1,
      }
    },
    removeOne: (state, action: PayloadAction<number | string>) => {
      const key = toCartKey(action.payload)
      const existing = state.itemsById[key]

      if (!existing) {
        return
      }

      if (existing.quantity <= 1) {
        delete state.itemsById[key]
        return
      }

      existing.quantity -= 1
    },
    removeItem: (state, action: PayloadAction<number | string>) => {
      const key = toCartKey(action.payload)
      delete state.itemsById[key]
    },
    setQuantity: (
      state,
      action: PayloadAction<{ productId: number | string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload
      const key = toCartKey(productId)
      const existing = state.itemsById[key]
      const nextQuantity = normalizeQuantity(quantity)

      if (!existing) {
        return
      }

      if (nextQuantity === 0) {
        delete state.itemsById[key]
        return
      }

      existing.quantity = nextQuantity
    },
    clearCart: (state) => {
      state.itemsById = {}
    },
  },
})

export const selectCartState = (state: RootState) => state.cart

export const selectCartItems = (state: RootState): CartItem[] =>
  Object.values(selectCartState(state).itemsById)

export const selectCartTotalItems = (state: RootState): number =>
  selectCartItems(state).reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state: RootState): number =>
  selectCartItems(state).reduce((total, item) => total + Number(item.price) * item.quantity, 0)

export const selectCartTaxesTotal = (state: RootState): number =>
  selectCartItems(state).reduce(
    (total, item) => total + Number(item.productFee) * item.quantity,
    0,
  )

export const selectCartShippingTotal = (state: RootState): number =>
  selectCartItems(state).reduce(
    (total, item) => total + Number(item.deliveryFee) * item.quantity,
    0,
  )

export const selectCartGrandTotal = (state: RootState): number =>
  selectCartSubtotal(state) + selectCartTaxesTotal(state) + selectCartShippingTotal(state)

export const selectCartItemQuantityByProductId =
  (productId: number | string) =>
  (state: RootState): number =>
    selectCartState(state).itemsById[toCartKey(productId)]?.quantity ?? 0

export const { addOne, removeOne, removeItem, setQuantity, clearCart } = cartSlice.actions
export const cartReducer = cartSlice.reducer
