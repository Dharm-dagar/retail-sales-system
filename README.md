# Retail Sales Management System

A full-stack retail sales management application with advanced search, filtering, sorting, and pagination capabilities. Built with Node.js/Express backend and React frontend, featuring a clean and responsive UI based on Figma design specifications.

## Overview

This system enables users to manage and analyze retail sales transactions through an intuitive dashboard. It supports full-text search across customer data, multi-select filtering on various dimensions, flexible sorting options, and efficient pagination for handling large datasets.

## Tech Stack

**Backend:**
- Node.js
- Express.js
- CSV-Parse (for data loading)
- CORS middleware

**Frontend:**
- React 18
- Vite (build tool)
- Custom CSS (no framework)
- Custom React Hooks

## Search Implementation Summary

The search functionality provides case-insensitive full-text search across:
- Customer Name
- Phone Number

Implementation details:
- Debounced input (300ms) to minimize API calls
- Centralized search logic in `filterUtils.js`
- Works in combination with all filters and sorting
- Returns partial matches for flexible searching

## Filter Implementation Summary

Multi-select and range-based filters implemented for:
- **Customer Region** - Multi-select dropdown
- **Gender** - Multi-select dropdown
- **Age Range** - Min/Max number inputs
- **Product Category** - Multi-select dropdown
- **Tags** - Multi-select dropdown (matches any tag)
- **Payment Method** - Multi-select dropdown
- **Date Range** - From/To date pickers

All filters:
- Work independently and in combination
- Maintain state with search and sorting
- Use backend processing for efficient filtering

## Sorting Implementation Summary

Sorting options available:
- **Date** - Newest First / Oldest First
- **Quantity** - High to Low / Low to High
- **Customer Name** - A-Z / Z-A

Implementation:
- Single sort field at a time
- Preserves active search and filters
- Server-side sorting for consistency

## Pagination Implementation Summary

- Fixed page size: 10 items per page
- Previous/Next navigation buttons
- Direct page number selection
- Shows current range and total count
- Retains all active search, filter, and sort states

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd retail-sales-system
```

2. Install dependencies:
```bash
npm run install:all
```
Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

3. **Add your dataset:**
Place your CSV file at:
```
backend/src/data/sales_data.csv
```

### Running the Application

**Development mode (both servers):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

```bash
npm run build:frontend
npm run start:backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/sales | Get paginated sales with filters |
| GET | /api/sales/filters | Get available filter options |
| GET | /api/sales/stats | Get data statistics |
| GET | /api/sales/:id | Get single transaction |
| GET | /api/health | Health check |

## Project Structure

```
📁 root/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── routes/          # API routes
│   │   ├── data/            # CSV data file location
│   │   └── index.js         # Entry point
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── utils/           # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── styles/          # CSS styles
│   │   ├── main.jsx         # Entry point
│   │   └── App.jsx          # Main component
│   ├── public/
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
├── README.md
└── package.json
```
