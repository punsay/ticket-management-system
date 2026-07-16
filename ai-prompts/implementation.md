# Implementation Prompts

Selected implementation prompts from the full append-only Cursor history.

## Prompt 1 — Scaffold the client and server only

**Date:** 2026-07-14

### Prompt summary

Create a Vite React frontend and Express backend with the agreed folder structure, scripts, environment configuration, a health endpoint, and a basic client-running page. Do not implement database or feature logic.

### AI response summary

Cursor created `client/` and `server/`, added development scripts, set up Tailwind, and implemented a basic health route.

### What I accepted

- JavaScript-only setup
- Separate client and server packages
- `server/src/server.js` as the backend entry point
- Vite development server
- Health endpoint
- Placeholder folders for later layers

### What I changed

Database connection and full error handling were intentionally left for later tasks.

### What I rejected

Models, seed data, tickets, comments, and other premature implementation.

### Why

The prompt was deliberately scoped to one task.

---

## Prompt 2 — Add the MongoDB connection only

**Date:** 2026-07-15

### Prompt summary

Connect through `MONGODB_URI`, establish the database connection before starting Express, and keep the health endpoint working. Do not add models or APIs.

### AI response summary

Cursor added the Mongoose connection module, changed server startup order, and corrected a health-route import.

### What I accepted

- Environment-only connection string
- Connect-before-listen startup
- Clear startup failure
- No hardcoded credentials
- Fix to the incorrect route import

### What I changed

The project was later realigned from Atlas-focused instructions to a local MongoDB setup while keeping `MONGODB_URI` configurable.

### What I rejected

Models, seeds, or feature APIs in the same task.

### Why

Each implementation step was kept small and reviewable.

---

## Prompt 3 — Create Mongoose models

**Date:** 2026-07-15

### Prompt summary

Create User, Ticket, and Comment models from the documented database design, including fields, references, enums, defaults, timestamps, and indexes.

### AI response summary

Cursor created the three models and exported ticket enums.

### What I accepted

- User role enum
- Ticket priority/status enums
- `Open` default status
- Optional `assignedTo`
- Required `createdBy`
- Comment ticket and creator references
- Oldest-first comment index
- Mongoose schema safeguards

### What I changed

Assignee business validation and status-transition enforcement remained in services instead of schemas.

### What I rejected

Putting business rules directly into route handlers or models.

### Why

The documented architecture assigns business rules to services.

---

## Prompt 4 — Create repeatable seed data

**Date:** 2026-07-15

### Prompt summary

Seed Alice Johnson, Bob Smith, Carol Davis, varied tickets, unassigned tickets, and a ticket with multiple comments. Make it safe to run repeatedly.

### AI response summary

Cursor created an idempotent seed script using upsert-style operations and added an npm command.

### What I accepted

- Three required users
- Varied priority/status/assignee data
- Unassigned samples
- Multiple comments
- Repeatable execution

### What I changed

The deprecated Mongoose `new: true` option was later replaced with `returnDocument: 'after'`.

### What I rejected

Random or non-repeatable seed generation.

### Why

Local setup and test evidence require predictable sample data.

---

## Prompt 5 — Implement backend APIs task by task

**Dates:** 2026-07-15

### Prompt summary

Implement seeded users, ticket creation/listing, ticket detail/update, comments, keyword search, status filtering, and ticket transitions in separate tasks.

### AI response summary

Cursor followed the layered architecture and added each backend feature incrementally.

### What I accepted

- Small controllers
- Service-layer validation and business rules
- Populated user references
- Oldest-first comments
- Case-insensitive partial search
- Exact status filtering
- Explicit invalid-transition errors
- Standard response envelopes

### What I changed

The status-transition task was not reimplemented because it had already been added during the ticket-update task. Cursor was asked to verify it instead.

### What I rejected

Duplicating existing logic and proceeding automatically to the next task.

### Why

The workflow requires checking current implementation state before modifying code.
