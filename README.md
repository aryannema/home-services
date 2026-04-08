# Home Services Marketplace

A web-based marketplace where customers can post service requests (plumbing, electrical, tutoring) and providers can browse jobs and send quotes. Built as a project for a Web Programming class.

## Project Structure

```
home-services/
├── legacy/          # Original version (plain HTML, CSS & JavaScript)
│   ├── index.html
│   ├── customer.html
│   ├── provider.html
│   ├── styles.css
│   └── app.js
├── current/         # React rebuild (Vite + React)
│   ├── src/
│   │   ├── components/    # Header, Badge
│   │   ├── context/       # ThemeContext (dark/light mode)
│   │   ├── pages/         # HomePage, CustomerPage, ProviderPage
│   │   ├── utils/         # localStorage data layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Features

- **Two roles** — Customer and Provider dashboards
- **Job posts** — Customers create service requests with category, location, date, and budget
- **Quotes & offers** — Providers browse open jobs and send competitive quotes
- **Booking flow** — Customers accept an offer to confirm a booking
- **Reviews** — Customers leave ratings and comments after job completion
- **Dark / Light mode** — Toggle between Warm Terracotta light and dark themes
- **No backend** — All data persists in `localStorage`

## Tech Stack (Current)

- **React** (plain JSX, no TypeScript)
- **Vite** for bundling
- **React Router** for SPA navigation
- **react-icons** (Heroicons v2) for icons
- **pnpm** as package manager

## Getting Started

```bash
cd current
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:5173/`.

To build for production:

```bash
pnpm build
```

## Demo Tip

Open the Customer and Provider pages in two separate browser tabs to simulate real interactions between both roles.
