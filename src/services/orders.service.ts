import { apiClient } from '@/lib/api/http-client'
import type { PaymentMethod } from '@/store/slices/checkout.slice'

export interface CreateOrderRequest {
  customer: {
    fullname: string
    email: string
    address: {
      address: string
      city: string
      state: string
      country: string
    }
  }
  method: PaymentMethod
  items: Array<{
    productId: number
    quantity: number
  }>
}

export interface CreateOrderResponse {
  code: string
}

export interface TrackedOrder {
  id: number
  code: string
  status: 'PENDING_PAID' | 'CANCEL' | 'PAID' | 'DELIVERED'
  method: PaymentMethod
  date: string
  total: string
  net: string
  fees: string
  deliveryCost: string
  customer: {
    fullname: string
    email: string
    addresses: Array<{
      id: number
      address: string
      city?: string
      state?: string
      country?: string
    }>
  }
  details: Array<{
    id: number
    price: string
    fee: string
    deliveryFee: string
    product: {
      id: number
      name: string
      slug: string
      image?: string
    }
  }>
  payments: Array<{
    id: number
    paymentRefCode: string
    status: 'COMPLETED' | 'CANCEL' | 'PENDING'
  }>
}

export async function createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
  return apiClient.post<CreateOrderResponse>('/new-order', payload)
}

export async function getOrderByCode(code: string): Promise<TrackedOrder> {
  return apiClient.get<TrackedOrder>(`/orders/${encodeURIComponent(code)}`)
}
