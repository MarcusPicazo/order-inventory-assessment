# Senior Backend Engineer — Technical Assessment

## Welcome

This assessment simulates a real-world scenario: you've joined a team that owns an order and inventory management microservice. The service is in production but has been exhibiting issues under load. Your job is to stabilize it, then extend it with new functionality.

The system is built with **Node.js, TypeScript, Prisma, PostgreSQL, and Redis**, all running in Docker.

## Prerequisites

- Docker and Docker Compose installed
- A terminal with `bash` and `curl` available
- Git

No local Node.js installation is required — everything runs inside containers.

## Assessment Structure

| Phase | Type | Required | Time Guideline |
|---|---|---|---|
| Phase 1 | Bug Hunting | Yes | ~2 hours |
| Phase 2 | Build | Yes | ~2 hours |
| Phase 3 | Extend | Optional | ~2 hours |

### Phase 1 — Bug Hunting

The service in `phase-1-debugging/` has **5 runtime bugs**. These bugs do not cause compilation errors — the service starts and appears to work at first glance. They only surface when you actually run the system and exercise its functionality under realistic conditions.

A stress test script is provided to help you observe the symptoms. Start there, then trace each issue to its root cause. The bugs span different layers of the system — some are in application logic, some in configuration, and some in how components interact with each other.

See `phase-1-debugging/README.md` for setup instructions and API documentation.

### Phase 2 — Reporting API

After fixing Phase 1, the order system works correctly. Now build a reporting API in `phase-2-reporting/` that queries the same database and provides aggregated business insights. The route handlers are scaffolded — you need to implement the logic.

See `phase-2-reporting/README.md` for the full requirements.

### Phase 3 — Webhook System (Optional)

Extend the system with a webhook notification layer in `phase-3-webhooks/`. Merchants register URLs to receive event payloads with HMAC signatures, delivery tracking, and retry logic.

See `phase-3-webhooks/README.md` for the full requirements.

## Getting Started

1. Start the Phase 1 service:
   ```bash
   cd phase-1-debugging
   docker compose up --build
   ```

2. Run the stress test:
   ```bash
   chmod +x stress-test.sh
   ./stress-test.sh
   ```

3. Observe the output, investigate, fix the bugs, then move on to Phase 2.

## Deliverables

For each phase, provide:

1. **Phase 1:** Your fixes as targeted code changes, with a brief written explanation of each bug's root cause and why your fix addresses it
2. **Phase 2:** A working implementation of the three report endpoints
3. **Phase 3:** A working webhook system with delivery and retry logic

Commit your changes with clear messages explaining what you changed and why.

## Rules

- You may use any documentation or reference material
- Do not rewrite the entire service — make targeted, surgical changes
- Each bug requires understanding the runtime behavior, not just reading code
- The stress test is a starting point, not the complete picture — you may need to write your own tests or inspect logs and database state
