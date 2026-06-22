# Phase 2 — Reporting API

## Overview

After fixing the bugs in Phase 1, the order and inventory system works correctly. Your task is to build a reporting API that connects to the same database and provides aggregated insights.

## Prerequisites

Phase 1's services must be running (`docker compose up` in `phase-1-debugging/`).

## Getting Started

```bash
docker compose up --build
```

The reporting service will be available at `http://localhost:3001`.

## Requirements

Implement the following three endpoints. The route handlers and service stubs are already scaffolded — you need to fill in the logic.

### 1. `GET /api/reports/sales`

Returns aggregated sales data.

**Query parameters:**
- `startDate` (string, ISO date) — filter start
- `endDate` (string, ISO date) — filter end
- `groupBy` (`day` | `week` | `month`) — aggregation period, defaults to `day`
- `page` (number) — pagination, defaults to 1
- `limit` (number) — results per page, defaults to 20

**Expected response:**
```json
[
  {
    "period": "2026-03-11",
    "orderCount": 3,
    "totalRevenue": 324.47,
    "averageOrderValue": 108.16
  }
]
```

**Requirements:**
- Revenue values must use proper decimal precision (2 decimal places)
- Date grouping must account for timezone correctly
- Must support pagination

### 2. `GET /api/reports/inventory`

Returns current inventory status for all products.

**Expected response:**
```json
[
  {
    "productId": "uuid",
    "productName": "Wireless Keyboard",
    "sku": "KB-001",
    "currentStock": 10,
    "reserved": 2,
    "available": 8,
    "lowStock": true
  }
]
```

**Requirements:**
- `lowStock` should be `true` when available stock is below 10 units
- Results sorted by available stock ascending (lowest first)

### 3. `GET /api/reports/top-products`

Returns best-selling products.

**Query parameters:**
- `limit` (number) — how many products to return, defaults to 10

**Expected response:**
```json
[
  {
    "productId": "uuid",
    "productName": "Wireless Keyboard",
    "sku": "KB-001",
    "unitsSold": 42,
    "totalRevenue": 2099.58
  }
]
```

**Requirements:**
- Only count confirmed orders
- Sort by `unitsSold` descending
- Revenue must use proper decimal precision

## Architecture

```
src/
├── config/       # Environment configuration
├── lib/          # Prisma client
├── routes/       # Express route handlers (scaffolded)
├── services/     # Business logic (implement here)
└── types/        # TypeScript interfaces (provided)
```

## Evaluation Criteria

- Correctness of SQL queries and aggregations
- Proper handling of decimal arithmetic
- Timezone awareness in date-based grouping
- Clean, readable code
- Proper error handling
