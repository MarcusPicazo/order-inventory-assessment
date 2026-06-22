# Phase 1 — Bug Hunting

## Overview

This is an event-driven order and inventory management service. It handles:

- Product inventory tracking with stock reservation
- Order creation with transactional guarantees
- Event-driven inventory updates via Redis pub/sub
- API key authentication
- Order caching for faster reads
- Daily sales reporting

The service has **5 bugs** that only manifest at runtime. The code compiles, the service starts, and basic requests may appear to work — but under realistic conditions, things break.

## Getting Started

```bash
docker compose up --build
```

This starts PostgreSQL, Redis, and the application server. The API will be available at `http://localhost:3000`.

## Running the Stress Test

```bash
chmod +x stress-test.sh
./stress-test.sh
```

The stress test exercises the main flows of the application and will help you observe the symptoms. Pay attention to:

- HTTP status codes returned by each step
- Whether inventory numbers make sense after concurrent operations
- Whether report totals match the expected values printed at the end
- What happens before and after the Redis restart
- Whether cached data produces valid calculations

## What You're Looking For

There are 5 bugs hidden across the service. They won't show up by reading the code in isolation — each one requires understanding how the system behaves at runtime under realistic conditions.

Start with the stress test, observe what fails or produces unexpected results, and trace each symptom back to its root cause. Some bugs will be immediately visible. Others will only appear under specific conditions or when you compare expected vs actual output.

## API Endpoints

All endpoints (except `/api/health`) require an `X-API-Key` header.

### Health
- `GET /api/health` — Service health check

### Orders
- `POST /api/orders` — Create an order
  ```json
  {
    "items": [
      { "productId": "<uuid>", "quantity": 1 }
    ]
  }
  ```
- `GET /api/orders` — List orders (supports `?page=1&limit=20`)
- `GET /api/orders/:id` — Get order by ID

### Inventory
- `GET /api/inventory` — List all inventory
- `GET /api/inventory/:productId` — Get inventory for a product
- `PATCH /api/inventory/:productId` — Update inventory quantity
  ```json
  { "quantity": 100 }
  ```

### Reports
- `GET /api/reports/daily-summary` — Daily sales summary (supports `?date=2026-03-11`)

## Test API Keys

- `sk_test_a1b2c3d4e5f6` (test-client)
- `sk_admin_x9y8z7w6v5u4` (admin-client)

## Seed Data

The database is seeded with:
- 5 products (keyboards, hubs, monitors, webcams)
- Inventory for each product (10-50 units)
- 5 sample orders placed on March 10-12, 2026 (Eastern Time)
- 3 API keys (2 active, 1 disabled)

## Architecture

```
src/
├── config/       # Environment and Redis configuration
├── lib/          # Prisma client and event bus
├── middleware/    # Authentication and error handling
├── routes/       # Express route handlers
├── services/     # Business logic
├── cache/        # Redis caching layer
├── events/       # Event handler registration
└── types/        # TypeScript interfaces
```

## Deliverables

For each bug:

1. A targeted code fix (do not rewrite the entire service)
2. A brief explanation of the root cause
3. Why your fix addresses it
