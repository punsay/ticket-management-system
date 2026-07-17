# Tests

## Overview

Automated tests for the Support Ticket Management System will be stored in this root-level `tests/` directory.

The backend APIs completed so far have been manually validated using Postman. Automated integration tests will be implemented according to `test-strategy.md` and the project testing rule.

## Manual Validation Completed

The following backend behaviour has been manually verified:

- seeded users API
- ticket creation
- ticket listing
- ticket detail retrieval
- ticket field updates
- comment creation
- comments returned in oldest-first order
- case-insensitive partial keyword search
- exact status filtering
- rejection of combined `search` and `status` parameters
- valid ticket status transitions
- invalid ticket status transitions

Manual validation details are recorded in:

- `test-results.md`
- `pr-description.md`
- `code-review-notes.md`

## Planned Test Structure

```text
tests/
├── helpers/
│   ├── fixtures.js
│   ├── http.js
│   └── setup.js
├── integration/
│   ├── ticket-status-transitions.test.js
│   └── ticket-comment-validation.test.js
└── README.md
```

Additional helpers may be added only when required by the test implementation.

## Test database

Development and manual Postman checks use the seeded database:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ticket_management_system
```

Automated integration tests must use a separate local database so dev/seed data is not modified:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ticket_management_system_test
```

Run automated tests with `NODE_ENV=test` and the test `MONGODB_URI` above.

**Prerequisites:** MongoDB running locally.

From `server/`:

```bash
npm test
```

The `npm test` script sets `NODE_ENV=test` and `MONGODB_URI=mongodb://127.0.0.1:27017/ticket_management_system_test`, then runs Jest against `tests/integration/` via `server/jest.config.js`. Shared setup connects to the test database and drops it after the suite.

## Mandatory Integration Test Coverage

The required integration test tier will verify ticket status transitions, ticket validation, and comment validation through the backend API.

### Valid transitions

- `Open` → `In Progress`
- `Open` → `Cancelled`
- `In Progress` → `Resolved`
- `In Progress` → `Cancelled`
- `Resolved` → `Closed`

### Invalid transitions

Representative invalid transitions will include:

- `Open` → `Resolved`
- `Open` → `Closed`
- `Resolved` → `Open`
- `Closed` → `In Progress`
- `Cancelled` → `Open`

The tests must confirm that:

- valid transitions succeed and are persisted
- invalid transitions are rejected by the backend
- the expected HTTP response and user-readable error are returned
- no invalid status value is written to the database

### Ticket and comment validation

Integration tests will also cover the required ticket and comment validation cases defined in `test-strategy.md`.

The tests must confirm that:

- valid requests return the expected HTTP response and are persisted
- invalid requests return the expected validation response
- invalid ticket or comment data is not persisted

## Current Status

- [x] Backend APIs manually validated in Postman
- [x] Valid status transitions manually verified
- [x] Invalid status transitions manually verified
- [x] Jest and Supertest integration test setup
- [x] Dedicated local MongoDB test database configuration
- [x] Automated valid-transition tests
- [x] Automated invalid-transition tests
- [ ] Automated ticket validation tests
- [ ] Automated comment validation tests
- [x] Deterministic fixture setup and cleanup
- [x] Test results documented (status-transition suite)

## Related Documents

- `test-strategy.md`
- `.cursor/rules/testing.mdc`
- `test-results.md`
- `tool-specific/cursor-workflow/spec.md`
- `tool-specific/cursor-workflow/acceptance-criteria.md`
- `tool-specific/cursor-workflow/tasks.md`
