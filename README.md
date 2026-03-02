# Store Web

Frontend built with React + TypeScript + Vite.

Includes:

- Tailwind CSS for styling.
- React Router for SPA navigation.
- shadcn/ui dashboard-style layout.
- Initial routes: `/`, `/product/:slug`, `/checkout`, and `/tracking`.

## Environment variables

Create a `.env` file in `store-web` based on `.env.example`:

```bash
cp .env.example .env
```

Required variables:

- `VITE_API_BASE_URL`: Base URL of the backend API (example: `http://localhost:80`).
- `VITE_PORT`: Dev server port (example: `80`).
- `VITE_WOMPI_PUBLIC_KEY`: Wompi public key (see `WOMPI_ENVIRONMENTS.md` in root).
- `VITE_WOMPI_WIDGET_URL`: Wompi checkout widget URL.

## Basic commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Run tests with coverage report
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Test Results

See [TEST_RESULTS.md](./TEST_RESULTS.md) for the latest test coverage report.
