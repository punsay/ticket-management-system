# API Specification

REST API for the Core Support Ticket Management System. Express backend, JSON request and response bodies.

## Overview

Simple REST endpoints under `/api`. No authentication. The backend validates all input through dedicated validation modules and enforces ticket status transitions before persisting.

## Base URL

| Environment | Base URL |
|-------------|----------|
| Local API | `http://localhost:5000/api` |
| Local client | `http://localhost:5173` (Vite default) |

No API versioning for Core.

## Authentication

None. The client sends `createdBy` (user ID) on ticket and comment creation. The backend validates that the ID references an existing seeded user.

## Common Response Format

### Success

```json
{
  "success": true,
  "data": { }
}
```

Or for lists:

```json
{
  "success": true,
  "data": [ ]
}
```

### Error

```json
{
  "success": false,
  "error": {
    "message": "Human-readable description"
  }
}
```

| HTTP status | When |
|-------------|------|
| `400` | Validation failure, malformed ObjectId, or invalid request-body format |
| `404` | Ticket or user not found |
| `409` | Invalid status transition |
| `500` | Unexpected server error (generic message only) |

Stack traces and internal details are never returned to the client.

## Endpoints

### Users

#### `GET /api/users`

List all seeded users for the acting-user dropdown.

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Alice Johnson",
      "email": "alice.johnson@example.com",
      "role": "Requester"
    }
  ]
}
```

---

### Tickets

#### `GET /api/tickets`

List tickets. Supports **one** query mode at a time for Core (not combined).

If both `search` and `status` are provided, return **HTTP `400`**:

```json
{
  "success": false,
  "error": {
    "message": "Use either search or status filter, not both."
  }
}
```

| Query param | Type | Description |
|-------------|------|-------------|
| `search` | string | Case-insensitive partial match on title and description |
| `status` | string | Exact status match |
| _(none)_ | — | Return all tickets |

Examples:

- `GET /api/tickets` — all tickets
- `GET /api/tickets?search=printer` — keyword search
- `GET /api/tickets?status=Open` — status filter

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Printer not working",
      "description": "Cannot print from floor 2",
      "priority": "High",
      "status": "Open",
      "assignedTo": { "_id": "...", "name": "Bob Smith" },
      "createdBy": { "_id": "...", "name": "Alice Johnson" },
      "createdAt": "2026-07-13T10:00:00.000Z",
      "updatedAt": "2026-07-13T10:00:00.000Z"
    }
  ]
}
```

`assignedTo` is `null` when unassigned. Populated user objects are optional but recommended for the UI.

---

#### `GET /api/tickets/:id`

Get one ticket with comments (oldest first).

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "priority": "Medium",
    "status": "In Progress",
    "assignedTo": { "_id": "...", "name": "Carol Davis" },
    "createdBy": { "_id": "...", "name": "Alice Johnson" },
    "createdAt": "...",
    "updatedAt": "...",
    "comments": [
      {
        "_id": "...",
        "message": "Looking into this now.",
        "createdBy": { "_id": "...", "name": "Bob Smith" },
        "createdAt": "..."
      }
    ]
  }
}
```

**Response `404`:**

```json
{
  "success": false,
  "error": {
    "message": "Ticket not found"
  }
}
```

---

#### `POST /api/tickets`

Create a ticket.

**Request body:**

```json
{
  "title": "VPN access issue",
  "description": "Cannot connect to VPN from home",
  "priority": "Medium",
  "assignedTo": "...",
  "createdBy": "..."
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `title` | yes | Non-empty string |
| `description` | yes | Non-empty string |
| `priority` | yes | `Low`, `Medium`, or `High` |
| `assignedTo` | no | User ID of Bob Smith or Carol Davis |
| `createdBy` | yes | Valid seeded user ID |

Server sets `status` to `Open`. Rejects missing/invalid `createdBy`.

**Response `201`:**

```json
{
  "success": true,
  "data": { }
}
```

The `data` object is the created ticket.

**Response `400`:** Validation error, malformed ObjectId, or non-object request body (see Common Response Format).

---

#### `PUT /api/tickets/:id`

Update a ticket. No `createdBy` required — Core does not track who performs updates.

**Request body** (send only fields to change):

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "High",
  "assignedTo": "...",
  "status": "In Progress"
}
```

| Field | Rules |
|-------|-------|
| `title` | Non-empty if provided |
| `description` | Non-empty if provided |
| `priority` | `Low`, `Medium`, or `High` if provided |
| `assignedTo` | Bob or Carol user ID if provided; omit or `null` to unassign |
| `status` | Must be a valid transition from current status |

Status transition rules (backend-enforced):

| From | Allowed to |
|------|------------|
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | _(none)_ |
| Cancelled | _(none)_ |

**Response `200`:**

```json
{
  "success": true,
  "data": { }
}
```

The `data` object is the updated ticket.

**Response `400`:** Validation error, malformed ObjectId, or non-object request body (see Common Response Format).

**Response `404`:** Ticket not found (see Common Response Format).

**Response `409`:** Invalid status transition (see Common Response Format).

---

### Comments

#### `POST /api/tickets/:id/comments`

Add a comment to a ticket.

**Request body:**

```json
{
  "message": "Issue reproduced on my machine.",
  "createdBy": "..."
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `message` | yes | Non-empty string |
| `createdBy` | yes | Valid seeded user ID |

**Response `201`:**

```json
{
  "success": true,
  "data": { }
}
```

The `data` object is the created comment.

**Response `400`:** Validation error, malformed ObjectId, or non-object request body (see Common Response Format).

**Response `404`:** Ticket not found (see Common Response Format).

---

## Request and Response Formats

- Content-Type: `application/json`
- Dates: ISO 8601 strings
- Request bodies must be JSON objects
- IDs: valid MongoDB ObjectId strings
- Populated references (`assignedTo`, `createdBy`) return `{ _id, name }` at minimum

## Error Codes

Core uses HTTP status codes only — no custom error code enum.

| Status | Meaning | Example message |
|--------|---------|-----------------|
| `400` | Bad request | `"Title is required"` |
| `400` | Combined search and status | `"Use either search or status filter, not both."` |
| `409` | Invalid transition | `"Cannot transition from Open to Resolved"` |
| `400` | Invalid assignee | `"Assignee must be a support agent"` |
| `400` | Invalid createdBy | `"Invalid user"` |
| `404` | Not found | `"Ticket not found"` |
| `500` | Server error | `"Something went wrong"` |

## Rate Limiting

Not implemented in Core scope.

## Out of Scope

The following are **not** exposed by the API:

- User create, update, or delete
- Ticket delete
- Comment update or delete
- Combined `search` + `status` filtering (requests with both parameters are rejected with `400`)
- Pagination
- Authentication tokens or sessions

## References

- `system-design.md` — Architecture and data flow
- `database-design.md` — Collection and field definitions
- `tool-specific/cursor-workflow/spec.md` — Behavioural rules
- `tool-specific/cursor-workflow/acceptance-criteria.md` — AC-01 through AC-48
