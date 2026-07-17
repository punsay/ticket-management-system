# Testing Report

Records test execution results, coverage metrics, and outstanding issues discovered during testing.

## Overview

Manual API validation has been completed in Postman for seeded users, ticket CRUD, comments, keyword search, status filtering, and ticket status transitions (valid and representative invalid). A dedicated ticket/comment validation layer is implemented in code; Postman regression for validation failure cases is still pending. Automated integration testing (`tests/integration/`, Jest + supertest) has not started yet.

## Test Summary

| Area | Method | Status |
|------|--------|--------|
| Seeded-users API | Manual Postman validation | Passed |
| Ticket CRUD APIs | Manual Postman validation | Passed |
| Comments API | Manual Postman validation | Passed |
| Search and status filter | Manual Postman validation | Passed |
| Status transitions | Manual Postman validation | Passed (AC-28–AC-35); automated tests pending (AC-45, AC-46) |
| Ticket/comment validation layer | Code review + Postman | Implemented in backend; validation-failure Postman regression pending |
| Frontend workflows | Not yet tested | Pending |

## Coverage Report

Automated coverage metrics are not available yet because integration tests have not been implemented.

### Databases

| Purpose | `MONGODB_URI` database name |
|---------|----------------------------|
| Development and manual Postman | `ticket_management_system` |
| Automated integration tests (planned) | `ticket_management_system_test` |

Backend default port for local API and Postman: `5001` (`server/.env.example`).

## Passed Tests

- Seeded users can be retrieved successfully.
- Ticket create, list, detail, and update endpoints were manually verified.
- Comments can be created for an existing ticket.
- Existing validation and error responses were checked during earlier Postman testing.
- Dedicated validation modules now handle ticket/comment field checks, request-body type checks, and malformed ObjectIds.
- Keyword search was verified for case-insensitive partial matching on title and description.
- Status filtering was verified for exact allowed status values.
- Valid and representative invalid ticket status transitions were manually verified.

## Failed Tests

No unresolved failures were recorded during the completed manual API checks.

## Pending Tests

**Postman regression (validation layer)** — record pass/fail here after running:

- Reject null, undefined, array, or other non-object request bodies with `400`.
- Reject missing or blank ticket title and description.
- Reject invalid priority values.
- Reject malformed `createdBy` and `assignedTo` ObjectIds.
- Reject blank comment messages and malformed comment creator IDs.
- Confirm valid ticket creation, update, comment creation, and existing status transitions still work.

**Automated integration tests** — not yet implemented; planned files per `test-strategy.md`:

- `tests/integration/ticket-status-transitions.test.js` (valid and invalid transitions)
- `tests/integration/ticket-comment-validation.test.js` (ticket and comment validation)

## Known Issues

- Validation-layer Postman regression checks are still pending.
- Status-transition integration tests are still pending.
- Frontend workflow verification is still pending.

## Recommendations

Complete the validation-layer Postman regression checks, then add automated integration tests for backend validation and valid/invalid ticket status transitions.