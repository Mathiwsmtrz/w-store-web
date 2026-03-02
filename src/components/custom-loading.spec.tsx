import { renderWithProviders, screen } from '@/__tests__/utils/test-utils'
import { CustomLoading } from './custom-loading'

describe('CustomLoading', () => {
  it('renders nothing when loading key not active', () => {
    const { container } = renderWithProviders(
      <CustomLoading watch={['products']} />,
      { preloadedState: { storeLoading: { activeLoadings: [] } } as any },
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders loading overlay when loading key is active', () => {
    renderWithProviders(<CustomLoading watch={['products']} />, {
      preloadedState: { storeLoading: { activeLoadings: ['products'] } } as any,
    })
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })
})
