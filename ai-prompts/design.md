# Design Prompts

Selected design prompts from the full append-only Cursor history.

## Prompt 1 — Complete system, database, and API design

**Date:** 2026-07-13

### Prompt summary

Complete the system design, database design, and API specification for a small MERN application using React, Tailwind CSS, Express, MongoDB, Mongoose, REST APIs, and backend-enforced ticket transitions.

### AI response summary

Cursor proposed a layered backend, three MongoDB collections, references between entities, seed data, and the Core REST endpoints.

### What I accepted

- React client and Express API separation
- Routes → Controllers → Services → Mongoose Models
- User, Ticket, and Comment collections
- Backend-authoritative validation
- Ticket status logic in the service layer
- Simple REST endpoints
- No delete endpoints in Core

### What I changed

API response shapes and combined search/filter behaviour were refined later after a consistency review.

### What I rejected

Authentication, rate limiting, pagination, advanced filters, and other Stretch design.

### Why

They were not required for the mandatory Core scope.

---

## Prompt 2 — Resolve assignee and behaviour ambiguities

**Date:** 2026-07-13

### Prompt summary

Align project context, requirement analysis, and acceptance criteria with these decisions: assignee optional during creation, assign/reassign later, search and status filtering separate, validate `createdBy`, and require acting-user selection only for ticket and comment creation.

### AI response summary

Cursor updated the three documents and renumbered acceptance criteria to remove conflicts.

### What I accepted

- Optional assignee
- Seeded support agents as valid assignees
- No authentication
- Separate search and status-filter flows
- Explicit `createdBy` validation
- Updates not requiring an acting user

### What I changed

The later specification narrowed assignees to Bob Smith and Carol Davis only.

### What I rejected

Adding prompt-history acceptance criteria or expanding authorization behaviour.

### Why

Those were outside the simple product behaviour being specified.

---

## Prompt 3 — Review documents for blocking contradictions

**Date:** 2026-07-13

### Prompt summary

Read the project context, requirements, spec, acceptance criteria, tasks, designs, API contract, checklist, and Cursor rules. Report only contradictions that would block implementation.

### AI response summary

Cursor identified two important blockers:

- conflicting API response envelopes;
- undefined behaviour when both `search` and `status` were supplied.

It also identified a smaller frontend parsing mismatch.

### What I accepted

All three findings were valid and actionable.

### What I changed

The API contract and relevant Cursor rules were updated to use one standard response shape and an explicit HTTP 400 combined-filter response.

### What I rejected

No optional design changes were accepted during this review.

### Why

The review was intentionally restricted to implementation blockers.

---

## Prompt 4 — Resolve API contract conflicts

**Date:** 2026-07-13

### Prompt summary

Use one success/error envelope everywhere, reject simultaneous search and status parameters with HTTP 400, and update frontend rules to read `data` and `error.message`.

### AI response summary

Cursor aligned the API specification and backend/frontend rules.

### What I accepted

```json
{
  "success": true,
  "data": {}
}
```

```json
{
  "success": false,
  "error": {
    "message": ""
  }
}
```

and the exact error:

`Use either search or status filter, not both.`

### What I changed

No further changes were needed at that stage.

### What I rejected

Supporting combined filtering in Core.

### Why

The confirmed Core scope required the two capabilities to work independently.
