# Store Web - Test Results

## Summary

| Metric | Result |
|--------|--------|
| Test Suites | 21 passed, 21 total |
| Tests | 113 passed, 113 total |
| Snapshots | 0 |
| Coverage Threshold | 85% (statements, branches, lines, functions) |

## Coverage Report

| File | % Stmts | % Branch | % Funcs | % Lines |
|------|---------|----------|----------|---------|
| **All files** | **95.4** | **85.39** | **87.71** | **95.06** |
| `__tests__/utils/test-utils.tsx` | 100 | 100 | 100 | 100 |
| `components/cart-sheet.tsx` | 85.18 | 83.33 | 60 | 83.33 |
| `components/custom-loading.tsx` | 100 | 75 | 100 | 100 |
| `components/product-list.tsx` | 86.11 | 75 | 66.66 | 84.37 |
| `components/site-header.tsx` | 100 | 50 | 100 | 100 |
| `components/ui/button.tsx` | 100 | 100 | 100 | 100 |
| `components/ui/input.tsx` | 100 | 100 | 100 | 100 |
| `components/ui/sheet.tsx` | 90.47 | 66.66 | 80 | 90.47 |
| `hooks/use-mobile.ts` | 92.3 | 100 | 75 | 91.66 |
| `lib/page-meta.ts` | 100 | 100 | 100 | 100 |
| `lib/utils.ts` | 100 | 100 | 100 | 100 |
| `lib/constants/loading.constants.ts` | 100 | 100 | 100 | 100 |
| `lib/constants/location.constants.ts` | 100 | 100 | 100 | 100 |
| `lib/constants/payment.constants.ts` | 100 | 100 | 100 | 100 |
| `services/categories.service.ts` | 100 | 100 | 100 | 100 |
| `services/orders.service.ts` | 100 | 100 | 100 | 100 |
| `services/products.service.ts` | 100 | 100 | 100 | 100 |
| `store/hooks.ts` | 100 | 100 | 100 | 100 |
| `store/slices/cart.slice.ts` | 98.33 | 92.85 | 100 | 98.14 |
| `store/slices/categories.slice.ts` | 100 | 50 | 100 | 100 |
| `store/slices/checkout.slice.ts` | 100 | 100 | 100 | 100 |
| `store/slices/products.slice.ts` | 86.36 | 100 | 80 | 86.36 |
| `store/slices/store-loading.slice.ts` | 100 | 100 | 100 | 100 |

## Setup

Jest is configured for the React + Vite + TypeScript frontend with:

- **ts-jest** - TypeScript and JSX support
- **@testing-library/react** - Component testing
- **@testing-library/jest-dom** - DOM matchers (toBeInTheDocument, toHaveClass, etc.)
- **@testing-library/user-event** - User interaction simulation

## Scripts

```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:cov    # Run tests with coverage report (85% threshold)
```

## Test Structure

- **Unit tests**: `*.spec.ts` / `*.spec.tsx` alongside source files
- **Test utilities**: `src/__tests__/utils/test-utils.tsx` (Redux + Router wrapper)
- **Mocks**: `src/__mocks__/config/env.ts` (API env vars for tests)
