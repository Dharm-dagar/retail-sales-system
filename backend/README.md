# Retail Sales Management System - Backend

Backend API service for the Retail Sales Management System built with Node.js and Express.

## Features

- RESTful API for sales data
- Full-text search on customer name and phone number
- Multi-select filtering with combined conditions
- Sorting by date, quantity, and customer name
- Pagination with configurable page size
- Summary statistics calculation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales` | Get paginated sales with filters |
| GET | `/api/sales/filters` | Get available filter options |
| GET | `/api/sales/stats` | Get data statistics |
| GET | `/api/sales/:id` | Get single transaction |
| GET | `/api/health` | Health check |

## Query Parameters for `/api/sales`

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search term for customer name/phone |
| customerRegion | string | Comma-separated regions |
| gender | string | Comma-separated genders |
| ageMin | number | Minimum age |
| ageMax | number | Maximum age |
| productCategory | string | Comma-separated categories |
| tags | string | Comma-separated tags |
| paymentMethod | string | Comma-separated payment methods |
| dateFrom | string | Start date (YYYY-MM-DD) |
| dateTo | string | End date (YYYY-MM-DD) |
| sortBy | string | Sort field (date, quantity, customerName) |
| sortOrder | string | asc or desc |
| page | number | Page number (default: 1) |
| pageSize | number | Items per page (default: 10) |

## Setup

```bash
npm install
npm run dev
```

## Data Setup

Place your CSV file at: `src/data/sales_data.csv`

The CSV should have these columns:
- Customer ID, Customer Name, Phone Number, Gender, Age, Customer Region, Customer Type
- Product ID, Product Name, Brand, Product Category, Tags
- Quantity, Price per Unit, Discount Percentage, Total Amount, Final Amount
- Date, Payment Method, Order Status, Delivery Type
- Store ID, Store Location, Salesperson ID, Employee Name
