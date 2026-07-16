# Data Model

## Overview

The Support Ticket Management System uses MongoDB Community Edition with Mongoose.

The Core data model contains three collections:

- `users`
- `tickets`
- `comments`

Ticket status is stored as a field on the `tickets` collection rather than as a separate entity.

The Express backend is the only application layer that reads from or writes to MongoDB.

Detailed database design is documented in:

`database-design.md`

## Entity Relationship Summary

```text
User
 ├── creates many Tickets
 ├── may be assigned many Tickets
 └── creates many Comments

Ticket
 ├── belongs to one creator
 ├── may belong to one assignee
 └── has many Comments

Comment
 ├── belongs to one Ticket
 └── belongs to one creator
```

## User

Represents one of the seeded internal users.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `_id` | ObjectId | Auto | Primary identifier |
| `name` | String | Yes | Display name |
| `email` | String | Yes | Unique seed-user email |
| `role` | String | Yes | `Requester` or `Support Agent` |

### Seeded users

| Name | Email | Role |
|---|---|---|
| Alice Johnson | `alice.johnson@example.com` | Requester |
| Bob Smith | `bob.smith@example.com` | Support Agent |
| Carol Davis | `carol.davis@example.com` | Support Agent |

No user-management UI or authentication is included in Core.

## Ticket

Represents an internal support request.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `_id` | ObjectId | Auto | Primary identifier |
| `title` | String | Yes | Must be non-empty |
| `description` | String | Yes | Must be non-empty |
| `priority` | String | Yes | `Low`, `Medium`, or `High` |
| `status` | String | Yes | Controlled status value |
| `assignedTo` | ObjectId | No | References Bob Smith or Carol Davis |
| `createdBy` | ObjectId | Yes | References an existing seeded user |
| `createdAt` | Date | Auto | Created on insert |
| `updatedAt` | Date | Auto | Updated on change |

### Default values

New tickets start with:

```text
status = Open
```

### Allowed status values

```text
Open
In Progress
Resolved
Closed
Cancelled
```

### Allowed status transitions

```text
Open -> In Progress
Open -> Cancelled
In Progress -> Resolved
In Progress -> Cancelled
Resolved -> Closed
```

All other status transitions are rejected by the backend.

## Comment

Represents a message added to a ticket.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `_id` | ObjectId | Auto | Primary identifier |
| `ticketId` | ObjectId | Yes | References an existing ticket |
| `message` | String | Yes | Must be non-empty |
| `createdBy` | ObjectId | Yes | References an existing seeded user |
| `createdAt` | Date | Auto | Used for oldest-first ordering |

Comments cannot be edited or deleted in Core.

## Relationships

| From | To | Cardinality | Rule |
|---|---|---|---|
| Ticket | User through `createdBy` | Many to one | Must reference an existing seeded user |
| Ticket | User through `assignedTo` | Many to one, optional | Must be Bob Smith or Carol Davis |
| Comment | Ticket through `ticketId` | Many to one | Ticket must exist |
| Comment | User through `createdBy` | Many to one | Must reference an existing seeded user |

## Validation Rules

### User

- `name` is required.
- `email` is required and unique.
- `role` must be `Requester` or `Support Agent`.

### Ticket

- `title` is required and cannot be empty.
- `description` is required and cannot be empty.
- `priority` must be `Low`, `Medium`, or `High`.
- `status` must be one of the supported status values.
- `createdBy` must reference an existing seeded user.
- `assignedTo`, when provided, must reference Bob Smith or Carol Davis.
- Invalid status transitions must be rejected before persistence.

### Comment

- `ticketId` must reference an existing ticket.
- `message` is required and cannot be empty.
- `createdBy` must reference an existing seeded user.

## Indexes

| Collection | Index | Purpose |
|---|---|---|
| `users` | `{ email: 1 }` unique | Prevent duplicate seeded users |
| `tickets` | `{ status: 1 }` | Support status filtering |
| `tickets` | title and description query support | Support case-insensitive partial keyword search |
| `comments` | `{ ticketId: 1, createdAt: 1 }` | Fetch ticket comments oldest first |

## Seed and Initialization

Mongoose models under `server/src/models/` define the application schema.

The repeatable seed script is located at:

`server/src/scripts/seed.js`

It creates:

- 3 users
- 6 tickets
- 5 comments

The seed script uses upserts, so it can be run multiple times without creating duplicate seed records.

Local database setup is documented in:

`database/setup-notes.md`

## Persistence

Data is stored in local MongoDB Community Edition.

Tickets and comments remain available after normal application and MongoDB restarts.

The backend connects using:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ticket_management_system
```

## Related Documents

- `database-design.md`
- `system-design.md`
- `api-contract.md`
- `database/setup-notes.md`
- `tool-specific/cursor-workflow/spec.md`
