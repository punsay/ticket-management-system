# Testing Report

Records test execution results, coverage metrics, and outstanding issues discovered during testing.

## Overview

Manual API validation has been completed in Postman for seeded users, ticket CRUD, comments, keyword search, status filtering, and ticket status transitions (valid and representative invalid). A dedicated ticket/comment validation layer is implemented in code; Postman regression for validation failure cases is still pending. Automated integration tests for ticket status transitions are implemented and passing; ticket/comment validation integration tests are still pending.

## Test Summary

| Area | Method | Status |
|------|--------|--------|
| Seeded-users API | Manual Postman validation | Passed |
| Ticket CRUD APIs | Manual Postman validation | Passed |
| Comments API | Manual Postman validation | Passed |
| Search and status filter | Manual Postman validation | Passed |
| Status transitions | Manual Postman validation + Jest integration | Passed (AC-28–AC-35, AC-45, AC-46) |
| Ticket/comment validation layer | Code review + Postman | Implemented in backend; validation-failure Postman regression pending |
| Frontend workflows | Not yet tested | Pending |

## Automated Integration Test Run

| Date | Command | Exit code | Result |
|------|---------|-----------|--------|
| 2026-07-17 | `cd server && npm test` | 0 | **14/14 passed** — `tests/integration/ticket-status-transitions.test.js` |

**Suite:** `ticket-status-transitions.test.js`

**Valid transitions (AC-28–AC-32, AC-45, NFR-04, BR-04):**

- Open → In Progress → Resolved → Closed (linear lifecycle on one ticket)
- Open → Cancelled
- In Progress → Cancelled

**Invalid transitions (AC-33–AC-35, AC-46, NFR-05, BR-05):**

- Open → Resolved, Open → Closed (409, unchanged on re-fetch)
- Open → Open no-op (200, unchanged)
- In Progress → Open, Resolved → Open, Resolved → In Progress
- Closed → In Progress, Cancelled → Open
- Invalid status string `NotAStatus` (400, VR-05)
- Terminal Closed → Cancelled, Cancelled → In Progress (409)

All cases assert `{ success, data | error }` envelope, readable `error.message` (no stack traces), and persistence via `GET /api/tickets/:id`.

## Coverage Report

Automated coverage is limited to the status-transition integration suite. Ticket and comment validation integration tests are not yet implemented.

### Databases

| Purpose | `MONGODB_URI` database name |
|---------|----------------------------|
| Development and manual Postman | `ticket_management_system` |
| Automated integration tests | `ticket_management_system_test` |

Backend default port for local API and Postman: `5001` (`server/.env.example`).

## Passed Tests

- Seeded users can be retrieved successfully.
- Ticket create, list, detail, and update endpoints were manually verified.
- Comments can be created for an existing ticket.
- Dedicated validation modules handle ticket/comment field checks, request-body type checks, and malformed ObjectIds.
- Keyword search was verified for case-insensitive partial matching on title and description.
- Status filtering was verified for exact allowed status values.
- Valid and representative invalid ticket status transitions were manually verified.
- Automated integration tests confirm all five valid transitions, representative invalid transitions, no-op same-status updates, invalid status string rejection, and terminal-state rejection with persistence checks.

## Failed Tests

No unresolved failures were recorded during completed manual API checks or the status-transition integration suite.

## Pending Tests

**Postman regression (validation layer)** — record pass/fail here after running:

- Reject null, undefined, array, or other non-object request bodies with `400`.
- Reject missing or blank ticket title and description.
- Reject invalid priority values.
- Reject malformed `createdBy` and `assignedTo` ObjectIds.
- Reject blank comment messages and malformed comment creator IDs.
- Confirm valid ticket creation, update, comment creation, and existing status transitions still work.

**Automated integration tests** — remaining planned file per `test-strategy.md`:

- `tests/integration/ticket-comment-validation.test.js` (ticket and comment validation)

## Known Issues

- Validation-layer Postman regression checks are still pending.
- Ticket/comment validation integration tests are still pending.
- Frontend workflow verification is still pending.

## Recommendations

Complete the validation-layer Postman regression checks, then add automated integration tests for ticket and comment validation. Frontend workflow verification remains pending.
