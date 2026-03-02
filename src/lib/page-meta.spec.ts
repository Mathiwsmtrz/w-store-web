import { getDocumentTitle, getBreadcrumbLabel } from '@/lib/page-meta'

describe('getDocumentTitle', () => {
  it('returns app name with Home for root path', () => {
    expect(getDocumentTitle('/')).toBe('Store Web - Home')
  })

  it('returns app name with Checkout for checkout path', () => {
    expect(getDocumentTitle('/checkout')).toBe('Store Web - Checkout')
  })

  it('returns app name with Tracking for tracking path', () => {
    expect(getDocumentTitle('/tracking')).toBe('Store Web - Tracking')
  })

  it('returns app name with Product Detail for product paths', () => {
    expect(getDocumentTitle('/product/some-slug')).toBe('Store Web - Product Detail')
  })

  it('returns only app name for unknown paths', () => {
    expect(getDocumentTitle('/unknown')).toBe('Store Web')
  })
})

describe('getBreadcrumbLabel', () => {
  it('returns Home for root path', () => {
    expect(getBreadcrumbLabel('/')).toBe('Home')
  })

  it('returns Checkout for checkout path', () => {
    expect(getBreadcrumbLabel('/checkout')).toBe('Checkout')
  })

  it('returns Product Detail for product paths', () => {
    expect(getBreadcrumbLabel('/product/some-slug')).toBe('Product Detail')
  })

  it('returns Home for unknown paths as fallback', () => {
    expect(getBreadcrumbLabel('/unknown')).toBe('Home')
  })
})
