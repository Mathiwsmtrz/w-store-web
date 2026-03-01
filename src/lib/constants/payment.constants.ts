import type { PaymentMethod } from '@/store/slices/checkout.slice'

export interface PaymentMethodOption {
  value: PaymentMethod
  label: string
  description: string
}

export const paymentMethodOptions: PaymentMethodOption[] = [
  {
    value: 'WOMPI',
    label: 'WOMPI',
    description: 'Pay online with Wompi and get immediate confirmation.',
  },
  {
    value: 'COD',
    label: 'Cash on Delivery',
    description: 'Pay when the order is delivered to your address.',
  },
]
