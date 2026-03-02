import {
  checkoutReducer,
  setCurrentStep,
  setCustomerInfo,
  setPaymentInfo,
  setWompiCheckoutSession,
  setWompiCheckoutStatus,
  setWompiCheckoutError,
  clearWompiCheckoutState,
  markOrderCompleted,
  resetCheckout,
  selectCheckoutState,
  type CheckoutCustomerInfo,
} from './checkout.slice'

const customerInfo: CheckoutCustomerInfo = {
  fullname: 'John Doe',
  email: 'john@example.com',
  address: '123 Main St',
  city: 'Medellin',
  state: 'Antioquia',
  country: 'Colombia',
}

describe('checkout slice', () => {
  const initialState = checkoutReducer(undefined, { type: 'init' })

  describe('setCurrentStep', () => {
    it('updates current step', () => {
      const state = checkoutReducer(initialState, setCurrentStep('payment'))
      expect(state.currentStep).toBe('payment')
    })

    it('does not update when order is completed', () => {
      let state = checkoutReducer(initialState, markOrderCompleted({ orderCode: 'ORD-123' }))
      state = checkoutReducer(state, setCurrentStep('payment'))
      expect(state.currentStep).toBe('customer')
    })
  })

  describe('setCustomerInfo', () => {
    it('sets customer info', () => {
      const state = checkoutReducer(initialState, setCustomerInfo(customerInfo))
      expect(state.customerInfo).toEqual(customerInfo)
    })
  })

  describe('setPaymentInfo', () => {
    it('sets payment info and resets wompi state', () => {
      let state = checkoutReducer(initialState, setWompiCheckoutSession({ reference: 'ref-1' }))
      expect(state.wompi.reference).toBe('ref-1')

      state = checkoutReducer(state, setPaymentInfo({ method: 'COD' }))
      expect(state.paymentInfo.method).toBe('COD')
      expect(state.wompi.reference).toBeNull()
    })
  })

  describe('setWompiCheckoutSession', () => {
    it('sets reference and transactionId', () => {
      const state = checkoutReducer(initialState, setWompiCheckoutSession({
        reference: 'ref-123',
        transactionId: 'tx-456',
      }))
      expect(state.wompi.reference).toBe('ref-123')
      expect(state.wompi.transactionId).toBe('tx-456')
      expect(state.wompi.status).toBe('PENDING')
    })

    it('handles null transactionId', () => {
      const state = checkoutReducer(initialState, setWompiCheckoutSession({ reference: 'ref' }))
      expect(state.wompi.transactionId).toBeNull()
    })
  })

  describe('setWompiCheckoutStatus', () => {
    it('updates status', () => {
      let state = checkoutReducer(initialState, setWompiCheckoutSession({ reference: 'ref' }))
      state = checkoutReducer(state, setWompiCheckoutStatus('PROCESSING'))
      expect(state.wompi.status).toBe('PROCESSING')
    })
  })

  describe('setWompiCheckoutError', () => {
    it('sets error and status to FAILED', () => {
      let state = checkoutReducer(initialState, setWompiCheckoutSession({ reference: 'ref' }))
      state = checkoutReducer(state, setWompiCheckoutError('Payment failed'))
      expect(state.wompi.error).toBe('Payment failed')
      expect(state.wompi.status).toBe('FAILED')
    })

    it('clears error when null and keeps status', () => {
      let state = checkoutReducer(initialState, setWompiCheckoutSession({ reference: 'ref' }))
      state = checkoutReducer(state, setWompiCheckoutError('Error'))
      state = checkoutReducer(state, setWompiCheckoutError(null))
      expect(state.wompi.error).toBeNull()
      expect(state.wompi.status).toBe('FAILED')
    })
  })

  describe('clearWompiCheckoutState', () => {
    it('resets wompi to initial state', () => {
      let state = checkoutReducer(initialState, setWompiCheckoutSession({ reference: 'ref', transactionId: 'tx' }))
      state = checkoutReducer(state, setWompiCheckoutError('err'))
      state = checkoutReducer(state, clearWompiCheckoutState())
      expect(state.wompi).toEqual(initialState.wompi)
    })
  })

  describe('markOrderCompleted', () => {
    it('sets order as completed with order code', () => {
      const state = checkoutReducer(initialState, markOrderCompleted({ orderCode: 'ORD-001' }))
      expect(state.isOrderCompleted).toBe(true)
      expect(state.orderCode).toBe('ORD-001')
    })
  })

  describe('resetCheckout', () => {
    it('resets to initial state', () => {
      let state = checkoutReducer(initialState, setCustomerInfo(customerInfo))
      state = checkoutReducer(state, setCurrentStep('payment'))
      state = checkoutReducer(state, resetCheckout())
      expect(state).toEqual(initialState)
    })
  })

  describe('selectCheckoutState', () => {
    it('returns checkout state from root', () => {
      const rootState = { checkout: initialState } as any
      expect(selectCheckoutState(rootState)).toEqual(initialState)
    })
  })
})
