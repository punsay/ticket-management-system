# Database Design

Data model for the Core Support Ticket Management System using **MongoDB Community Edition locally** and Mongoose.

## Overview

Three collections: `users`, `tickets`, and `comments`. Status is a field on tickets, not a separate collection. References use MongoDB `ObjectId`. All data persists across application and MongoDB restarts.

The Express backend is the only layer that reads from or writes to the database, connecting via `MONGODB_URI`. The React frontend never accesses MongoDB or Mongoose directly.

## Connection

| Setting | Value |
|---------|-------|
| **Environment** | Local MongoDB Community Edition |
| **Connection string** | `mongodb://127.0.0.1:27017/ticket_management_system` through `MONGODB_URI` |
| **Credentials** | No authentication is required for the default local setup; secrets must still never be committed |

## Entity Relationship Diagram

```
┌─────────────┐
│    users    │
│─────────────│
│ _id         │◄──────────────┐
│ name        │               │
│ email       │         createdBy
│ role        │               │
└──────┬──────┘               │
       │                      │
       │ assignedTo           │
       │ (optional)           │
       ▼                      │
┌─────────────┐         ┌─────┴───────┐
│   tickets   │         │  comments   │
│─────────────│◄────────│─────────────│
│ _id         │ ticketId│ _id         │
│ title       │         │ message     │
│ description │         │ createdBy ──┘
│ priority    │
│ status      │
│ assignedTo  │──► users (Bob or Carol only)
│ createdBy   │──► users
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

## Collections

| Collection | Purpose |
|------------|---------|
| `users` | Pre-seeded internal users |
| `tickets` | Support requests |
| `comments` | Messages on tickets |

## Field Definitions

### users

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `name` | String | yes | Display name |
| `email` | String | yes | Unique among seed users |
| `role` | String | yes | `Requester` or `Support Agent` |

### tickets

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `title` | String | yes | Non-empty |
| `description` | String | yes | Non-empty |
| `priority` | String | yes | `Low`, `Medium`, or `High` |
| `status` | String | yes | `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled` |
| `assignedTo` | ObjectId | no | Ref to `users`; Bob Smith or Carol Davis only when set |
| `createdBy` | ObjectId | yes | Ref to `users`; set on create |
| `createdAt` | Date | auto | Set on insert |
| `updatedAt` | Date | auto | Updated on change |

New tickets default to status `Open`.

### comments

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `ticketId` | ObjectId | yes | Ref to `tickets` |
| `message` | String | yes | Non-empty |
| `createdBy` | ObjectId | yes | Ref to `users` |
| `createdAt` | Date | auto | Set on insert; sort ascending for display |

Comments are not updated or deleted in Core scope.

## Relationships

| From | To | Cardinality | Rule |
|------|-----|-------------|------|
| Ticket | User (`createdBy`) | many → one | Must reference existing seeded user |
| Ticket | User (`assignedTo`) | many → one (optional) | Bob Smith or Carol Davis only when provided |
| Comment | Ticket | many → one | Ticket must exist |
| Comment | User (`createdBy`) | many → one | Must reference existing seeded user |

## Indexes

Simple indexes for Core query patterns:

| Collection | Index | Purpose |
|------------|-------|---------|
| `users` | `{ email: 1 }` unique | Prevent duplicate seed emails |
| `tickets` | `{ status: 1 }` | Status filter |
| `tickets` | `{ title: "text", description: "text" }` or regex queries | Keyword search (case-insensitive partial match implemented in query layer) |
| `comments` | `{ ticketId: 1, createdAt: 1 }` | Fetch comments for a ticket, oldest first |

Full-text search index is optional; a case-insensitive regex on title and description is sufficient for Core volume.

## Seed Data

### Users (3)

| Name | Email | Role |
|------|-------|------|
| Alice Johnson | alice.johnson@example.com | Requester |
| Bob Smith | bob.smith@example.com | Support Agent |
| Carol Davis | carol.davis@example.com | Support Agent |

### Sample tickets

Seed a small set covering:

- Priorities: `Low`, `Medium`, `High`
- Statuses: at least `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`
- Assignees: Bob, Carol, and at least one unassigned
- Creators: mix of Alice, Bob, and Carol
- At least one ticket with two or more comments

The seed script is idempotent and can be rerun without creating duplicate seed records. Local setup steps are documented in `database/setup-notes.md`.

## Validation

| Layer | Tool | Responsibility |
|-------|------|----------------|
| **API boundary** | Dedicated validation modules | Validate request-body shape, required fields, enum values, and ObjectId formats |
| **Persistence** | Mongoose schemas | Types, enums, and required fields as a safeguard on save |
| **Business rules** | Services | Assignee rules, `createdBy` checks, status transitions |

Business rules enforced in services:

- `assignedTo` must reference Bob or Carol when provided
- `createdBy` must reference any existing seeded user
- Status transitions checked on update (see `api-contract.md`)
- No delete operations on tickets or comments

## References

- `system-design.md` — Architecture overview
- `api-contract.md` — How data is accessed via REST
- `tool-specific/cursor-workflow/spec.md` — Business rules
