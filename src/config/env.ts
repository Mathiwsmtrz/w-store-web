const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawApiBaseUrl) {
  throw new Error('Missing VITE_API_BASE_URL. Define it in your .env file.')
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '')
