# Store Web

Frontend built with React + TypeScript + Vite.

Includes:

- Tailwind CSS for styling.
- React Router for SPA navigation.
- shadcn/ui dashboard-style layout.
- Initial routes: `/`, `/checkout`, and `/tracking`.

## Environment variables

Create a `.env` file in `store-web` based on `.env.example`:

```bash
cp .env.example .env
```

Required variables:

- `VITE_API_BASE_URL`: Base URL of the backend API (example: `http://localhost:80`).

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
```

## Test Results

See [TEST_RESULTS.md](./TEST_RESULTS.md) for the latest test coverage report.
