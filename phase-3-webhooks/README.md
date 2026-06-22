# Phase 3 (Optional) — Webhook Notification System

## Overview

Extend the order system with a webhook notification layer. Merchants should be able to register URLs that receive event payloads when specific actions occur in the system.

## Prerequisites

Phase 1's services must be running (`docker compose up` in `phase-1-debugging/`).

## Getting Started

```bash
docker compose up --build
```

The webhook service will be available at `http://localhost:3002`.

## Requirements

### 1. Webhook Registration

Implement the CRUD operations for webhook endpoints:

- `POST /api/webhooks` — Register a new webhook endpoint
  ```json
  {
    "url": "https://example.com/hook",
    "events": ["order.created", "inventory.low"]
  }
  ```
  - Generate a random `secret` for HMAC signing
  - Return the endpoint with the secret (only shown once at creation)

- `GET /api/webhooks` — List all registered endpoints (without secrets)

- `DELETE /api/webhooks/:id` — Unregister an endpoint

### 2. Webhook Delivery

When events occur in the system, deliver them to all registered endpoints that subscribe to that event type.

**Delivery requirements:**
- Send an HTTP POST to the registered URL with the event payload as JSON body
- Sign the payload using HMAC-SHA256 with the endpoint's secret
- Include the signature in the `X-Webhook-Signature` header
- Store each delivery attempt in the `WebhookDelivery` table

### 3. Retry Logic

Failed deliveries must be retried with exponential backoff:

- Maximum 3 attempts
- Backoff schedule: 10s, 60s, 300s
- Mark delivery as `failed` after all attempts are exhausted
- Mark delivery as `delivered` on success

### 4. Event Subscription

Subscribe to events from Phase 1's Redis pub/sub:

- `order.created` — when a new order is placed
- `order.updated` — when an order status changes
- `inventory.low` — when a product's available stock drops below 10 units

### 5. Idempotency

Each delivery must include an `X-Webhook-Delivery-Id` header with the delivery record's UUID. Consumers can use this to deduplicate.

## Supported Event Types

| Event | Trigger | Payload |
|---|---|---|
| `order.created` | New order placed | `{ orderId, items, totalAmount }` |
| `order.updated` | Order status change | `{ orderId, oldStatus, newStatus }` |
| `inventory.low` | Available stock < 10 | `{ productId, productName, available }` |

## Architecture

```
src/
├── config/       # Environment configuration
├── lib/          # Prisma client, Redis connection
├── routes/       # Express route handlers (scaffolded)
├── services/     # Business logic (implement here)
└── types/        # TypeScript interfaces (provided)
```

## Evaluation Criteria

- Correct HMAC-SHA256 signature implementation
- Reliable retry mechanism with exponential backoff
- Proper error isolation (one failing endpoint must not block others)
- Idempotent delivery design
- Clean integration with Phase 1's event bus
