const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL
const rawWompiPublicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY
const rawWompiWidgetUrl = import.meta.env.VITE_WOMPI_WIDGET_URL

if (!rawApiBaseUrl) {
  throw new Error('Missing VITE_API_BASE_URL. Define it in your .env file.')
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '')
export const WOMPI_PUBLIC_KEY = rawWompiPublicKey ?? ''
export const WOMPI_WIDGET_URL = (rawWompiWidgetUrl ?? 'https://checkout.wompi.co/widget.js').trim()
