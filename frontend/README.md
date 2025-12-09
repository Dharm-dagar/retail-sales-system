# Retail Sales Management System - Frontend

React frontend for the Retail Sales Management System built with Vite.

## Features

- Modern, responsive UI following Figma design
- Real-time search with debouncing
- Multi-select filter dropdowns
- Range filters for age and date
- Sorting by multiple fields
- Pagination with page navigation
- Summary statistics cards
- Copy-to-clipboard for phone numbers

## Tech Stack

- React 18
- Vite
- Custom CSS (no framework dependencies)
- Custom hooks for state management

## Components

| Component | Description |
|-----------|-------------|
| Sidebar | Navigation sidebar with menu items |
| SearchBar | Search input with debounced search |
| FilterPanel | All filter dropdowns and sort control |
| FilterDropdown | Reusable dropdown for multi-select/range filters |
| SummaryCards | Statistics summary cards |
| DataTable | Transaction data table |
| Pagination | Page navigation controls |

## Setup

```bash
npm install
npm run dev
```

The app runs on http://localhost:3000 and proxies API requests to the backend on port 5000.

## Building for Production

```bash
npm run build
```

Output will be in the `dist` folder.
