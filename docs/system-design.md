# System Design

High-level architecture for the Core Support Ticket Management System. Derived from `tool-specific/cursor-workflow/project-context.md`, `docs/requirement-analysis.md`, and `tool-specific/cursor-workflow/spec.md`.

## Overview

A small MERN application with a React frontend and an Express API backed by **MongoDB Atlas**. The client calls REST endpoints only — it never connects to MongoDB directly. The Express backend connects via the `MONGODB_URI` environment variable, validates incoming API data with **Zod**, enforces ticket status transitions, and persists through **Mongoose** (schema-level validation as a safeguard).

There is no authentication. Seeded users are selected in the UI and sent as `createdBy` on ticket and comment creation only.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Acting-user │  │ Ticket views │  │ Search / filter│ │
│  │  dropdown   │  │ forms/comments│  │   controls     │ │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘ │
│         │                │                   │          │
│         └────────────────┼───────────────────┘          │
│                          │ fetch (REST / JSON)          │
└──────────────────────────┼──────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                  Express API (Node.js)                    │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐ │
│  │  Routes  │→ │ Controllers  │→ │ Services / rules  │ │
│  └──────────┘  └──────────────┘  └─────────┬─────────┘ │
│                                             │           │
│  ┌──────────────────────────────────────────┘           │
│  │ Validation · Status transition engine · Errors      │
│  └──────────────────────────┬───────────────────────────┘ │
└─────────────────────────────┼────────────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │ MongoDB Atlas     │
                    │ (Mongoose)        │
                    │ users · tickets   │
                    │ · comments        │
                    └──────────────────┘
```

## Components

### Frontend (`client/`)

| Component area | Responsibility |
|----------------|----------------|
| **Acting-user selector** | Dropdown of seeded users; no default; required before create ticket/comment |
| **Ticket list** | Display all tickets; keyword search or status filter (used separately) |
| **Ticket detail** | Full ticket view with comments (oldest first) |
| **Ticket forms** | Create and update title, description, priority, assignee, status |
| **Comment form** | Add comment when acting user is selected |
| **Error display** | Show user-readable messages from API responses |

Built with React and Tailwind CSS. Uses `fetch` (or a thin wrapper) to call the REST API.

### Backend (`server/`)

| Layer | Responsibility |
|-------|----------------|
| **Routes** | Map HTTP methods and paths to controllers |
| **Controllers** | Parse requests, call services, return JSON responses |
| **Services** | Business logic: validation, status transitions, queries |
| **Models** | Mongoose schemas for User, Ticket, Comment |
| **Middleware** | JSON parsing, centralized error handler, CORS for local dev |
| **Seed script** | Insert three users and sample tickets/comments |

### Shared concerns

- **Status transition module** — Single source of truth for allowed transitions (BR-04); used by ticket update service and integration tests.
- **Validation module** — Reusable checks for priority, status, assignee, and `createdBy`.

## Data Flow

### Create ticket

1. User selects acting user, fills form, submits.
2. Client sends `POST /api/tickets` with title, description, priority, optional `assignedTo`, and `createdBy`.
3. Server validates fields, sets status to `Open`, saves to MongoDB.
4. Client refreshes ticket list or navigates to detail.

### Update ticket (including status)

1. User edits fields on ticket detail (no acting user required).
2. Client sends `PUT /api/tickets/:id` with changed fields.
3. Server validates input; if status changed, runs transition check against current status.
4. On success, returns updated ticket; on failure, returns error JSON.

### Add comment

1. User selects acting user, enters message, submits.
2. Client sends `POST /api/tickets/:id/comments` with message and `createdBy`.
3. Server validates ticket exists, message non-empty, `createdBy` valid; saves comment.
4. Client reloads ticket detail.

### Search or filter

1. User enters keyword **or** selects a status (not both for Core).
2. Client sends `GET /api/tickets?search=...` **or** `GET /api/tickets?status=...`.
3. Server queries MongoDB and returns matching tickets.
4. Client renders results or empty state.

## Technology Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | React, Tailwind CSS, Vite | Component-based UI for a small internal tool |
| Backend | Node.js, Express | Simple REST API |
| Database | MongoDB Atlas, Mongoose | Cloud document store; backend connects via `MONGODB_URI` |
| Testing | Integration test runner (e.g. Jest + supertest) | Status state-machine tests against live API |

## Security Considerations

- **No authentication in Core** — Trusted internal environment; `createdBy` validated as an existing seeded user only.
- **No secrets in repo** — `MONGODB_URI` and other config via environment variables; never commit real credentials.
- **Frontend isolation** — React calls the REST API only; no direct MongoDB or Mongoose access.
- **Backend is authoritative** — All business rules enforced server-side; Zod validates API input; Mongoose schemas add persistence-level checks.
- **Safe errors** — Error handler returns generic messages; no stack traces to client (NFR-03).
- **CORS** — Restrict to local dev origin in development.

## Deployment Overview

Local development only for Core:

1. Provision a MongoDB Atlas cluster; set `MONGODB_URI` in `server/.env` (see `.env.example` — placeholders only).
2. Start Express server (`server/`).
3. Start React dev server (`client/`).
4. Run seed script once to load users and sample data.

Production deployment is outside Core scope. Data persists across normal application and Atlas restarts.

## Project Structure (planned)

```
ticket-management-system/
├── client/          # React + Tailwind frontend
├── server/          # Express API + Mongoose models
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── scripts/     # seed script
├── docs/
└── tool-specific/
```

## References

- `docs/database-design.md` — Data model detail
- `docs/api-specification.md` — REST endpoint detail
- `tool-specific/cursor-workflow/spec.md` — Behavioural specification
