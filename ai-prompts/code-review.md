# Code Review Prompts

Selected review prompts and decisions from the full append-only Cursor history in `prompt-history/history.md`.

## Review 1 — Cross-document implementation readiness

**Date:** 2026-07-13

### Prompt summary

Review the project context, requirements, specification, acceptance criteria, tasks, designs, API documentation, checklist, and Cursor rules and report only Core blockers.

### AI response summary

The review found conflicting response envelopes, undefined simultaneous search/status behaviour, and frontend parsing guidance that did not match the API contract.

### What I accepted

All three findings.

### What I changed

- Standardised success and error envelopes.
- Added the HTTP 400 combined-filter rule.
- Updated frontend API parsing guidance.

### What I rejected

Optional feature suggestions.

### Why

The review was intentionally limited to issues that blocked Core implementation.

---

## Review 2 — Backend foundation and APIs

### Prompt summary

Review the implemented Express and MongoDB backend for architecture, database configuration, models, seed data, validation, ticket APIs, comments, search/filter behaviour, and status-transition enforcement.

### AI response summary

Cursor confirmed that the layered backend was suitable, identified an incorrect route import and a deprecated Mongoose option, and recommended focused validation improvements without redesigning the APIs.

### What I accepted

- Routes, controllers, services, and models have distinct responsibilities.
- Business rules stay in services.
- Backend validation is authoritative.
- Seed data is representative and repeatable.
- Search and comments follow the documented behaviour.
- Invalid transitions return clear errors.

### What I changed

- Corrected database configuration and the route import.
- Replaced a deprecated Mongoose option.
- Added focused validation modules.
- Verified existing transition logic rather than duplicating it.

### What I rejected

Authentication, full user management, Docker, CI, and other Stretch work.

### Why

They were outside the mandatory project scope.

---

## Review 3 — Automated test implementation

### Prompt summary

Review integration-test readiness and implement only the mandatory status-transition and ticket/comment validation coverage using an isolated test database.

### AI response summary

Cursor confirmed the backend could be tested without production changes, added the minimal Jest setup, and identified a shared-database race when the two suites ran in parallel.

### What I accepted

- Jest and Supertest integration through the exported Express app
- Dedicated local test database
- Deterministic fixtures and cleanup
- 14 transition tests and 30 validation tests
- Persistence and non-persistence checks
- No production changes required

### What I changed

Jest execution was made serial after the shared-database race was found.

### What I rejected

Optional test tiers and changes to production code not supported by a confirmed failing test.

### Why

The test implementation needed to be reliable while staying within Core.

---

## Review 4 — Frontend Core and UI feedback

### Prompt summary

Review the completed frontend flows and refine usability and error feedback without changing the confirmed Core behaviour or backend APIs.

### AI response summary

Cursor kept the ticket list and detail views primary, hid forms behind explicit actions, centralised inline errors, retained success-only toasts, and prevented unchanged updates from producing false success feedback.

### What I accepted

- Focused React components and shared services
- No default acting user
- Acting user required only for create/comment
- Forms hidden behind explicit actions
- Inline actionable errors
- Success-only toasts
- No comment edit/delete or ticket delete UI

### What I changed

- Prevented success feedback for unchanged updates.
- Centralised error messages and reusable inline alerts.
- Kept ticket list/detail as the primary views.

### What I rejected

Authentication, combined filtering, extra UI libraries, and unnecessary abstractions.

### Why

The final frontend satisfies the confirmed Core behaviour without scope expansion.

---

## Review principles used

- Compare code with confirmed requirements and acceptance criteria.
- Inspect existing implementation before editing.
- Prefer minimal fixes over rewrites.
- Verify AI-generated output before committing.
- Record accepted, changed, and rejected suggestions.
- Keep review findings traceable to prompts, documents, tests, and commits.
