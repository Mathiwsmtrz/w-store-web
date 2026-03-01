import axios, { type AxiosRequestConfig, type Method } from 'axios'
import { API_BASE_URL } from '@/config/env'

type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue>

interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data'> {
  method: Method
  query?: QueryParams
  body?: unknown
}

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const { query, body, method, ...restOptions } = options

  try {
    const response = await httpClient.request<T>({
      url: path,
      method,
      params: query,
      data: body,
      ...restOptions,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const serverData = error.response?.data
      const serverMessage =
        typeof serverData === 'string'
          ? serverData
          : typeof serverData === 'object' &&
              serverData !== null &&
              'message' in serverData &&
              typeof serverData.message === 'string'
            ? serverData.message
            : error.message

      throw new Error(`API request failed${status ? ` (${status})` : ''}: ${serverMessage}`)
    }

    throw error instanceof Error ? error : new Error('Unexpected API error')
  }
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
