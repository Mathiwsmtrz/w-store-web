import { apiClient } from '@/lib/api/http-client'
import type { ProductCategory } from './categories.service'

export interface Product {
  id: number
  name: string
  slug: string
  price: string
  image?: string
  description?: string
  productFee: string
  deliveryFee: string
  category: ProductCategory
}

export async function getProducts(category?: string): Promise<Product[]> {
  return apiClient.get<Product[]>('/list-products', {
    query: { category },
  })
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return apiClient.get<Product>(`/product/${slug}`)
}
