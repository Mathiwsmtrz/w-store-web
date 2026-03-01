import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type CheckoutStep = 'customer' | 'payment' | 'summary'
export type PaymentMethod = 'WOMPI' | 'COD'

export interface CheckoutCustomerInfo {
  fullname: string
  email: string
  address: string
  city: string
  state: string
  country: string
}

export interface CheckoutPaymentInfo {
  method: PaymentMethod
}

export interface CheckoutState {
  currentStep: CheckoutStep
  customerInfo: CheckoutCustomerInfo
  paymentInfo: CheckoutPaymentInfo
  isOrderCompleted: boolean
  orderCode: string | null
}

const initialState: CheckoutState = {
  currentStep: 'customer',
  customerInfo: {
    fullname: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
  },
  paymentInfo: {
    method: 'WOMPI',
  },
  isOrderCompleted: false,
  orderCode: null,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<CheckoutStep>) => {
      if (state.isOrderCompleted) {
        return
      }

      state.currentStep = action.payload
    },
    setCustomerInfo: (state, action: PayloadAction<CheckoutCustomerInfo>) => {
      state.customerInfo = action.payload
    },
    setPaymentInfo: (state, action: PayloadAction<CheckoutPaymentInfo>) => {
      state.paymentInfo = action.payload
    },
    markOrderCompleted: (state, action: PayloadAction<{ orderCode: string }>) => {
      state.isOrderCompleted = true
      state.orderCode = action.payload.orderCode
    },
    resetCheckout: () => initialState,
  },
})

export const selectCheckoutState = (state: RootState) => state.checkout

export const {
  setCurrentStep,
  setCustomerInfo,
  setPaymentInfo,
  markOrderCompleted,
  resetCheckout,
} = checkoutSlice.actions

export const checkoutReducer = checkoutSlice.reducer
