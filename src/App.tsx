import { useEffect, type CSSProperties } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppSidebar } from './components/app-sidebar'
import { SiteHeader } from './components/site-header'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { TrackingPage } from './pages/TrackingPage.tsx'
import { getDocumentTitle } from './lib/page-meta'

function PageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = getDocumentTitle(pathname)
  }, [pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <PageTitle />
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 68)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App
