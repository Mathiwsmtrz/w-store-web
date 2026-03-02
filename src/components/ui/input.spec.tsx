import { render, screen, userEvent } from '@/__tests__/utils/test-utils'
import { Input } from './input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your name" />)
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })

  it('displays typed value', async () => {
    render(<Input placeholder="Search" />)
    const input = screen.getByPlaceholderText('Search')
    await userEvent.type(input, 'hello')
    expect(input).toHaveValue('hello')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('has data-slot attribute', () => {
    render(<Input placeholder="Test" />)
    expect(screen.getByPlaceholderText('Test')).toHaveAttribute('data-slot', 'input')
  })

  it('accepts type attribute', () => {
    render(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')
  })
})
