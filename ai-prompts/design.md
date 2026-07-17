# Design Prompts

Selected design prompts from the full append-only Cursor history in `prompt-history/history.md`.

## Prompt 1 — Complete system, database, and API design

**Date:** 2026-07-13

### Prompt summary

Complete the system, database, and API design for a small MERN application with backend-enforced ticket transitions.

### AI response summary

Cursor proposed a React client, layered Express backend, MongoDB collections, entity references, seed data, and Core REST endpoints.

### What I accepted

- React client and Express API separation
- Routes → Controllers → Services → Mongoose Models
- User, Ticket, and Comment collections
- Backend-authoritative validation
- Status rules in the service layer
- No Core delete endpoints

### What I changed

API response envelopes and simultaneous search/status behaviour were refined after a consistency review.

### What I rejected

Authentication, pagination, advanced filters, rate limiting, and other Stretch design.

### Why

The mandatory Core needed a simple design that could be implemented and explained clearly.

---

## Prompt 2 — Resolve behavioural ambiguities

**Date:** 2026-07-13

### Prompt summary

Align project context, requirements, and acceptance criteria on optional assignment, reassignment, separate search/filter operation, `createdBy` validation, and acting-user requirements.

### AI response summary

Cursor updated the documents and removed conflicting acceptance criteria.

### What I accepted

- Optional assignee on create
- Bob or Carol as valid assignees
- Assign/reassign later
- No authentication
- Separate search and status-filter flows
- Acting user required only for ticket and comment creation

### What I changed

The specification later made the Bob/Carol assignee restriction explicit.

### What I rejected

Prompt-history criteria as product behaviour and expanded authorization rules.

### Why

Repository evidence and application acceptance criteria serve different purposes.

---

## Prompt 3 — Review for blocking contradictions

**Date:** 2026-07-13

### Prompt summary

Compare context, requirements, specification, acceptance criteria, design documents, API contract, checklist, and Cursor rules and report only implementation blockers.

### AI response summary

Cursor found conflicting API envelopes, undefined simultaneous search/status behaviour, and a frontend parsing mismatch.

### What I accepted

All three findings.

### What I changed

The API contract and rules were aligned on one response envelope and an HTTP 400 response for combined filters.

### What I rejected

Optional design improvements unrelated to the blockers.

### Why

Resolving contradictions before coding reduced rework and inconsistent implementation.

---

## Prompt 4 — Align the database environment

**Dates:** 2026-07-15 to 2026-07-17

### Prompt summary

Document database access through `MONGODB_URI`, backend-only MongoDB access, Zod input validation, Mongoose schema validation, and separate local development and test databases.

### AI response summary

Cursor updated architecture guidance, environment examples, database setup documentation, and test isolation instructions.

### What I accepted

- Configurable `MONGODB_URI`
- React never accesses MongoDB directly
- Local development database
- Dedicated local integration-test database
- No committed credentials

### What I changed

Earlier Atlas-focused wording was replaced with the final local MongoDB setup used by the project.

### What I rejected

Hardcoded connection values and tests sharing the development database.

### Why

The final setup needed to be reproducible, safe, and consistent with the implemented test strategy.
