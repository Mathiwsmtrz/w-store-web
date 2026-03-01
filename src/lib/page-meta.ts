const APP_NAME = 'Store Web'

const staticRouteLabels: Record<string, string> = {
  '/': 'Home',
  '/checkout': 'Checkout',
  '/tracking': 'Tracking',
}

function getSectionLabel(pathname: string): string | null {
  if (pathname.startsWith('/product/')) {
    return 'Product Detail'
  }

  return staticRouteLabels[pathname] ?? null
}

export function getDocumentTitle(pathname: string): string {
  const sectionLabel = getSectionLabel(pathname)
  return sectionLabel ? `${APP_NAME} - ${sectionLabel}` : APP_NAME
}

export function getBreadcrumbLabel(pathname: string): string {
  return getSectionLabel(pathname) ?? 'Home'
}
