# Implementation Prompts

Selected implementation prompts from the full append-only Cursor history in `prompt-history/history.md`.

## Prompt 1 — Scaffold the client and server only

**Date:** 2026-07-14

### Prompt summary

Create a Vite React frontend and Express backend with scripts, environment configuration, a health endpoint, and a basic client page. Do not implement database or feature logic.

### AI response summary

Cursor created `client/` and `server/`, configured Tailwind and development scripts, and added the health route.

### What I accepted

- JavaScript-only setup
- Separate client and server packages
- `server/src/server.js` entry point
- Vite development server
- Health endpoint

### What I changed

Database connection and full feature logic were kept for later tasks.

### What I rejected

Models, seed data, ticket APIs, and other premature implementation.

### Why

The implementation was intentionally split into small reviewable tasks.

---

## Prompt 2 — Add database models and repeatable seed data

**Date:** 2026-07-15

### Prompt summary

Create the User, Ticket, and Comment models, then seed the three required users, varied tickets, unassigned tickets, and comments without duplicates.

### AI response summary

Cursor created the Mongoose models and an idempotent seed script.

### What I accepted

- Required fields, enums, references, timestamps, and indexes
- `Open` default status
- Optional assignee
- Predictable sample data
- Repeatable seed execution

### What I changed

Assignee and transition business rules remained in services, and a deprecated Mongoose option was replaced later.

### What I rejected

Random seed generation and business logic inside schemas.

### Why

Predictable data and clear layer responsibilities support setup, testing, and review.

---

## Prompt 3 — Implement backend APIs task by task

**Date:** 2026-07-15

### Prompt summary

Implement seeded users, ticket CRUD, comments, search, status filtering, and status transitions in separate scoped tasks.

### AI response summary

Cursor followed the layered backend architecture and added each Core endpoint incrementally.

### What I accepted

- Small controllers
- Service-layer business rules
- Populated user references
- Oldest-first comments
- Case-insensitive partial search
- Exact status filtering
- Standard response envelopes
- Clear invalid-transition errors

### What I changed

A later status-transition prompt verified existing logic instead of duplicating it.

### What I rejected

Duplicate code and automatic continuation into unrelated tasks.

### Why

Inspecting the current repository before editing prevented unnecessary changes.

---

## Prompt 4 — Add missing backend validation

**Date:** 2026-07-17

### Prompt summary

Review the implemented backend and add only missing ticket/comment validation while preserving APIs and transition behaviour.

### AI response summary

Cursor introduced focused validation helpers and modules and kept database/business checks in services.

### What I accepted

- Safe handling of malformed request objects
- ObjectId validation
- Existing error messages and API behaviour
- No transition logic changes

### What I changed

Validation responsibilities were separated from the service without rewriting the feature.

### What I rejected

Broader API redesign or unrelated production changes.

### Why

The change closed confirmed validation gaps with minimal risk.

---

## Prompt 5 — Implement the frontend Core incrementally

**Date:** 2026-07-17

### Prompt summary

Implement the acting-user selector, ticket list/detail, create/update flows, status control, comments, and independent search/status filtering as separate tasks.

### AI response summary

Cursor implemented all mandatory frontend flows using the existing API, shared services, React context, focused components, and visible loading/empty/error states.

### What I accepted

- No default acting user
- Create/comment acting-user enforcement
- Optional Bob/Carol assignee
- Detail-first views
- Backend-authoritative status transitions
- Oldest-first comments
- Independent search and status filter
- Responsive Tailwind styling

### What I changed

Create and update forms were hidden behind explicit actions, update no-op submissions stopped producing success toasts, and UI errors were centralized.

### What I rejected

Authentication, delete actions, combined filters, routing abstractions, and other Stretch scope.

### Why

The frontend needed to satisfy Core behaviour while staying simple and consistent.

---

## Prompt 6 — Refine UI without changing behaviour

**Date:** 2026-07-17

### Prompt summary

Improve form presentation and error-message consistency while preserving APIs and existing behaviour.

### AI response summary

Cursor added a create-ticket slide-over, expandable edit form, focused status/comment controls, reusable inline errors, and success-only toasts.

### What I accepted

- List and detail remain primary views
- Accessible explicit actions
- Inline retry/error details
- Toasts only for brief successful actions
- `lucide-react` and `sonner` as the approved UI dependencies

### What I changed

A no-change update now returns without an API call or success toast.

### What I rejected

Decorative UI expansion and additional component libraries.

### Why

The refinements improved usability without expanding product scope.
