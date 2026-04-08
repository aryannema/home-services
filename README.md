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

## Prerequisites

- **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
- A package manager: **pnpm** (recommended) or **npm** (comes with Node.js)

### Installing pnpm (if you don't have it)

```bash
npm install -g pnpm
```

Verify installation:

```bash
pnpm --version
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/aryannema/home-services.git
cd home-services
```

### Setup with pnpm (recommended)

```bash
cd current
pnpm install
pnpm dev
```

### Setup with npm

```bash
cd current
npm install
npm run dev
```

The dev server starts at `http://localhost:5173/`.

## Building for Production

### With pnpm

```bash
cd current
pnpm build
pnpm preview    # preview the production build locally
```

### With npm

```bash
cd current
npm run build
npm run preview    # preview the production build locally
```

The production files are output to `current/dist/`.

## Live Demo

The React app is deployed via GitHub Pages at:
**https://aryannema.github.io/home-services/**

## Demo Tip

Open the Customer and Provider pages in two separate browser tabs to simulate real interactions between both roles.
