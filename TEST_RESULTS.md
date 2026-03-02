# Store Web - Test Results

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

## Coverage Threshold

**Minimum 85%** for statements, branches, lines, and functions.

## Test Structure

- **Unit tests**: `*.spec.ts` / `*.spec.tsx` alongside source files
- **Test utilities**: `src/__tests__/utils/test-utils.tsx` (Redux + Router wrapper)
- **Mocks**: `src/__mocks__/config/env.ts` (API env vars for tests)

## Tested Modules

| Module | Coverage |
|--------|----------|
| `lib/utils` | cn(), formatPrice() |
| `lib/page-meta` | getDocumentTitle(), getBreadcrumbLabel() |
| `lib/constants` | loading, location, payment |
| `store/slices` | cart, checkout, categories, products, store-loading |
| `store/hooks` | useAppDispatch, useAppSelector |
| `services` | categories, products, orders |
| `components` | cart-sheet, product-list, site-header, custom-loading |
| `components/ui` | button, input, sheet |
| `hooks` | use-mobile |
