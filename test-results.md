# Testing Report

Records test execution results, coverage metrics, and outstanding issues discovered during testing.

## Overview

Manual API validation has been completed in Postman for seeded users, ticket CRUD, comments, keyword search, status filtering, and ticket status transitions (valid and representative invalid). A dedicated ticket/comment validation layer is implemented and covered by automated integration tests. Automated integration tests for ticket status transitions and ticket/comment validation are implemented and passing.

## Test Summary

| Area | Method | Status |
|------|--------|--------|
| Seeded-users API | Manual Postman validation | Passed |
| Ticket CRUD APIs | Manual Postman validation | Passed |
| Comments API | Manual Postman validation | Passed |
| Search and status filter | Manual Postman validation | Passed |
| Status transitions | Manual Postman validation + Jest integration | Passed (AC-28–AC-35, AC-45, AC-46) |
| Ticket/comment validation layer | Code review + Jest integration | Passed (AC-09–AC-11, AC-16–AC-17, AC-20, AC-36–AC-38, VR-01–VR-07, VR-09–VR-10) |
| Frontend Core workflows | Manual browser verification | Passed |

## Automated Integration Test Run

| Date | Command | Exit code | Result |
|------|---------|-----------|--------|
| 2026-07-17 | `cd server && npm test` | 0 | **44/44 passed** — both integration suites |
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

**Suite:** `ticket-and-comment-validation.test.js`

**Ticket create validation (AC-09–AC-11, AC-36–AC-38, VR-01–VR-07):**

- Missing/empty title and description (400, no ticket created)
- Invalid priority; missing, malformed, and non-existent `createdBy` (400, no ticket created)
- Requester or malformed `assignedTo` (400, no ticket created)
- Array request body (400, VR-01)
- Valid create without assignee and with support-agent assignee (`201`, `status: Open`)

**Ticket update validation (AC-16–AC-17, VR-02–VR-04, VR-06):**

- Empty title/description when provided; invalid priority; invalid assignee (400, unchanged on re-fetch)
- Malformed and non-existent ticket `:id` (404)
- Valid field update (`200`, persisted)

**Comment create validation (AC-18, AC-20, AC-37–AC-38, VR-01, VR-07, VR-09–VR-10):**

- Valid message and `createdBy` (`201`, persisted on ticket detail)
- Missing/empty message; missing, malformed, and non-existent `createdBy` (400, no comment created)
- Malformed and non-existent ticket `:id` (404, no comment created)
- Array request body (400, VR-01)

## Coverage Report

Automated coverage includes the status-transition integration suite and the ticket/comment validation integration suite.

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
- Automated integration tests confirm ticket create/update and comment create validation, including persistence and non-persistence checks.

## Failed Tests

No unresolved failures were recorded during completed manual API checks or the automated integration suites.

## Frontend Manual Verification

The completed Core UI was manually checked for:

- acting-user loading, selection, and missing-user guidance;
- ticket listing, detail loading, creation, update, and reassignment;
- valid status-change controls and readable rejected-operation errors;
- comment creation and oldest-first display;
- keyword search, exact status filtering, empty results, and reset behaviour;
- loading, success, validation, backend, and network error states.

## Pending Tests

No mandatory Core tests are pending. Automated browser tests and CI are optional Stretch work.

## Known Issues

No unresolved Core test failures are recorded.

## Recommendations

Keep `npm test` passing after future backend changes. Add frontend automation only as optional follow-on work.
