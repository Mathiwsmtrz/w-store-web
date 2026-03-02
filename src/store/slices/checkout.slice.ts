import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type CheckoutStep = 'customer' | 'payment' | 'summary'
export type PaymentMethod = 'WOMPI' | 'COD'
export type WompiCheckoutStatus = 'IDLE' | 'PENDING' | 'PROCESSING' | 'FAILED'

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

export interface WompiCheckoutState {
  reference: string | null
  transactionId: string | null
  status: WompiCheckoutStatus
  error: string | null
}

export interface CheckoutState {
  currentStep: CheckoutStep
  customerInfo: CheckoutCustomerInfo
  paymentInfo: CheckoutPaymentInfo
  wompi: WompiCheckoutState
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
  wompi: {
    reference: null,
    transactionId: null,
    status: 'IDLE',
    error: null,
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
      state.wompi = initialState.wompi
    },
    setWompiCheckoutSession: (
      state,
      action: PayloadAction<{ reference: string; transactionId?: string | null }>,
    ) => {
      state.wompi.reference = action.payload.reference
      state.wompi.transactionId = action.payload.transactionId ?? null
      state.wompi.status = 'PENDING'
      state.wompi.error = null
    },
    setWompiCheckoutStatus: (state, action: PayloadAction<WompiCheckoutStatus>) => {
      state.wompi.status = action.payload
    },
    setWompiCheckoutError: (state, action: PayloadAction<string | null>) => {
      state.wompi.error = action.payload
      state.wompi.status = action.payload ? 'FAILED' : state.wompi.status
    },
    clearWompiCheckoutState: (state) => {
      state.wompi = initialState.wompi
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
  setWompiCheckoutSession,
  setWompiCheckoutStatus,
  setWompiCheckoutError,
  clearWompiCheckoutState,
  markOrderCompleted,
  resetCheckout,
} = checkoutSlice.actions

export const checkoutReducer = checkoutSlice.reducer
