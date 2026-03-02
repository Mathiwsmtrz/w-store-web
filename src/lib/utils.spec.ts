import { cn, formatPrice } from '@/lib/utils'

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })

  it('merges tailwind classes without conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('handles empty and undefined inputs', () => {
    expect(cn(undefined, null, '')).toBe('')
  })
})

describe('formatPrice', () => {
  it('formats valid price as USD currency', () => {
    expect(formatPrice('19.99')).toBe('$19.99')
  })

  it('formats integer price', () => {
    expect(formatPrice('100')).toBe('$100.00')
  })

  it('returns original string for NaN', () => {
    expect(formatPrice('invalid')).toBe('invalid')
  })

  it('handles zero', () => {
    expect(formatPrice('0')).toBe('$0.00')
  })

  it('rounds to 2 decimal places', () => {
    expect(formatPrice('19.999')).toBe('$20.00')
  })
})
