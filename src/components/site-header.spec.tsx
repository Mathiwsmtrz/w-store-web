import { SidebarProvider } from '@/components/ui/sidebar'
import { renderWithProviders, screen, userEvent } from '@/__tests__/utils/test-utils'
import { SiteHeader } from './site-header'

function renderSiteHeader(options?: { preloadedState?: object }) {
  return renderWithProviders(
    <SidebarProvider>
      <SiteHeader />
    </SidebarProvider>,
    options,
  )
}

describe('SiteHeader', () => {
  it('renders cart button', () => {
    renderSiteHeader()
    expect(screen.getByRole('button', { name: /open cart/i })).toBeInTheDocument()
  })

  it('shows Home as current page when at root', () => {
    renderSiteHeader()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('opens cart sheet when cart button clicked', async () => {
    renderSiteHeader()
    await userEvent.click(screen.getByRole('button', { name: /open cart/i }))
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('displays cart item count', () => {
    renderSiteHeader({
      preloadedState: {
        cart: {
          itemsById: {
            '1': {
              productId: 1,
              slug: 'p1',
              title: 'P1',
              price: '10',
              productFee: '1',
              deliveryFee: '2',
              quantity: 3,
            },
          },
        },
      } as any,
    })
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
