# Architecture Document

## Overview

The Retail Sales Management System is a full-stack web application designed to manage and analyze retail sales transactions. It follows a client-server architecture with clear separation of concerns between the frontend and backend.

---

## Backend Architecture

### Technology Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Data Processing:** csv-parse library

### Architecture Pattern
The backend follows a **layered architecture** pattern:

```
┌─────────────────────────────────────────────────────┐
│                    Routes Layer                     │
│         (Route definitions & middleware)            │
├─────────────────────────────────────────────────────┤
│                 Controllers Layer                   │
│           (Request/Response handling)               │
├─────────────────────────────────────────────────────┤
│                  Services Layer                     │
│              (Business logic)                       │
├─────────────────────────────────────────────────────┤
│                   Utils Layer                       │
│        (CSV parsing, filtering, pagination)         │
├─────────────────────────────────────────────────────┤
│                   Data Layer                        │
│                (CSV file storage)                   │
└─────────────────────────────────────────────────────┘
```

### Module Responsibilities

| Module | File | Responsibility |
|--------|------|----------------|
| Entry Point | `index.js` | Server initialization, middleware setup, route mounting |
| Routes | `routes/salesRoutes.js` | API endpoint definitions |
| Controller | `controllers/salesController.js` | HTTP request handling, response formatting |
| Service | `services/salesService.js` | Business logic, data orchestration |
| CSV Parser | `utils/csvParser.js` | CSV file reading, data transformation |
| Filter Utils | `utils/filterUtils.js` | Search, filter, sort, pagination logic |

### Data Flow (Backend)

```
Request → Routes → Controller → Service → Utils → Response
                                    ↓
                              In-Memory Data
                                    ↑
                              CSV Parser (startup)
```

### API Design

The API follows RESTful conventions:

- `GET /api/sales` - Retrieve paginated, filtered, sorted sales
- `GET /api/sales/filters` - Retrieve filter options for UI
- `GET /api/sales/:id` - Retrieve single transaction
- `GET /api/sales/stats` - Retrieve basic statistics

Query parameters support:
- Search: `?search=term`
- Multi-select filters: `?customerRegion=North,South`
- Range filters: `?ageMin=18&ageMax=30`
- Sorting: `?sortBy=date&sortOrder=desc`
- Pagination: `?page=1&pageSize=10`

---

## Frontend Architecture

### Technology Stack
- **Library:** React 18
- **Build Tool:** Vite
- **Styling:** Custom CSS with CSS Variables

### Architecture Pattern
The frontend follows a **component-based architecture** with custom hooks for state management:

```
┌─────────────────────────────────────────────────────┐
│                   App Component                     │
│              (Main layout & composition)            │
├─────────────────────────────────────────────────────┤
│                    Components                       │
│  Sidebar | SearchBar | FilterPanel | DataTable     │
│         SummaryCards | Pagination                   │
├─────────────────────────────────────────────────────┤
│                   Custom Hooks                      │
│             (useSalesData - State management)       │
├─────────────────────────────────────────────────────┤
│                     Services                        │
│                 (API client layer)                  │
├─────────────────────────────────────────────────────┤
│                      Utils                          │
│            (Formatters, helpers)                    │
└─────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Sidebar
│   └── NavItem (repeated)
├── SearchBar
├── FilterPanel
│   └── FilterDropdown (repeated for each filter)
├── SummaryCards
├── DataTable
│   └── TableRow (repeated)
└── Pagination
```

### Module Responsibilities

| Module | Path | Responsibility |
|--------|------|----------------|
| App | `App.jsx` | Main layout, component composition |
| Sidebar | `components/Sidebar.jsx` | Navigation menu |
| SearchBar | `components/SearchBar.jsx` | Search input with debouncing |
| FilterPanel | `components/FilterPanel.jsx` | All filters and sort control |
| FilterDropdown | `components/FilterDropdown.jsx` | Reusable dropdown component |
| SummaryCards | `components/SummaryCards.jsx` | Statistics display |
| DataTable | `components/DataTable.jsx` | Transaction table |
| Pagination | `components/Pagination.jsx` | Page navigation |
| useSalesData | `hooks/useSalesData.js` | State management hook |
| API Service | `services/api.js` | Backend communication |
| Formatters | `utils/formatters.js` | Data formatting utilities |

### State Management

The `useSalesData` hook centralizes all state management:

```javascript
{
  // Data state
  data: [],           // Current page data
  summary: {},        // Statistics
  pagination: {},     // Pagination info
  filterOptions: {},  // Available filter values

  // User selections
  filters: {},        // Current filter values
  sort: {},           // Current sort settings
  page: 1,            // Current page

  // UI state
  loading: false,
  error: null
}
```

---

## Data Flow

### Complete Request Flow

```
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│  User    │      │   Frontend   │      │   Backend    │
│  Action  │      │              │      │              │
└────┬─────┘      └──────┬───────┘      └──────┬───────┘
     │                   │                     │
     │  1. Click filter  │                     │
     ├──────────────────>│                     │
     │                   │                     │
     │                   │  2. Update state    │
     │                   │     (useSalesData)  │
     │                   │                     │
     │                   │  3. API call        │
     │                   ├────────────────────>│
     │                   │                     │
     │                   │                     │  4. Process:
     │                   │                     │  - Search
     │                   │                     │  - Filter
     │                   │                     │  - Sort
     │                   │                     │  - Paginate
     │                   │                     │
     │                   │  5. JSON response   │
     │                   │<────────────────────┤
     │                   │                     │
     │                   │  6. Update state    │
     │                   │     & re-render     │
     │                   │                     │
     │  7. View update   │                     │
     │<──────────────────┤                     │
     │                   │                     │
```

### Filter Application Order

Backend applies operations in this order:
1. **Search** - Text matching on name/phone
2. **Filters** - Multi-select and range filters
3. **Summary Calculation** - Aggregate statistics
4. **Sorting** - Order by selected field
5. **Pagination** - Slice to page size

---

## Folder Structure

```
📁 retail-sales-system/
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   │   └── salesController.js    # HTTP handlers
│   │   │
│   │   ├── 📁 services/
│   │   │   └── salesService.js       # Business logic
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── csvParser.js          # Data loading
│   │   │   └── filterUtils.js        # Data processing
│   │   │
│   │   ├── 📁 routes/
│   │   │   └── salesRoutes.js        # Route definitions
│   │   │
│   │   ├── 📁 data/
│   │   │   └── sales_data.csv        # Dataset file
│   │   │
│   │   └── index.js                  # Server entry
│   │
│   ├── package.json
│   └── README.md
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── DataTable.jsx
│   │   │   └── Pagination.jsx
│   │   │
│   │   ├── 📁 services/
│   │   │   └── api.js                # API client
│   │   │
│   │   ├── 📁 utils/
│   │   │   └── formatters.js         # Utility functions
│   │   │
│   │   ├── 📁 hooks/
│   │   │   └── useSalesData.js       # State management
│   │   │
│   │   ├── 📁 styles/
│   │   │   └── index.css             # Global styles
│   │   │
│   │   ├── main.jsx                  # React entry
│   │   └── App.jsx                   # Root component
│   │
│   ├── 📁 public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── 📁 docs/
│   └── architecture.md               # This document
│
├── README.md
└── package.json                      # Monorepo config
```

---

## Design Decisions

### Why CSV instead of Database?
- Assignment requirement to use provided CSV dataset
- Simpler setup without database dependencies
- Data loaded into memory at startup for fast queries
- Suitable for the dataset size

### Why Custom Hooks over Redux?
- Application state is straightforward
- No global state sharing needed beyond sales data
- Simpler code with less boilerplate
- All state co-located with data fetching logic

### Why Custom CSS over Tailwind/Bootstrap?
- Complete control over design
- No unnecessary dependencies
- Smaller bundle size
- Matches Figma design precisely

### Why Backend Processing?
- All filtering, sorting, pagination done server-side
- Frontend only displays current page data
- Scales better with large datasets
- Single source of truth for data operations

---

## Edge Cases Handled

1. **No Search Results** - Empty state with message displayed
2. **Conflicting Filters** - Filters combine with AND logic
3. **Invalid Age Range** - Non-numeric values ignored
4. **Missing Fields** - Graceful fallbacks with defaults
5. **Large Filter Combinations** - All filters work together
6. **Page Out of Bounds** - Clamped to valid range
