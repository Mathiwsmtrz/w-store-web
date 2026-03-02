import { paymentMethodOptions } from './payment.constants'

describe('payment.constants', () => {
  describe('paymentMethodOptions', () => {
    it('has WOMPI and COD options', () => {
      const values = paymentMethodOptions.map((o) => o.value)
      expect(values).toContain('WOMPI')
      expect(values).toContain('COD')
    })

    it('each option has value, label and description', () => {
      paymentMethodOptions.forEach((option) => {
        expect(option).toHaveProperty('value')
        expect(option).toHaveProperty('label')
        expect(option).toHaveProperty('description')
        expect(typeof option.value).toBe('string')
        expect(typeof option.label).toBe('string')
        expect(typeof option.description).toBe('string')
      })
    })
  })
})
