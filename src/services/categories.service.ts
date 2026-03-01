import { apiClient } from '@/lib/api/http-client'

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export async function getCategories(): Promise<ProductCategory[]> {
  return apiClient.get<ProductCategory[]>('/list-categories')
}
