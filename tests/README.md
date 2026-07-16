# Tests

## Overview

Automated tests for the Support Ticket Management System will be stored in this root-level `tests/` directory.

The backend APIs completed so far have been manually validated using Postman. Automated integration tests are still pending.

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
- `code-review-notes-notes.md`

## Planned Test Structure

```text
tests/
├── integration/
│   └── ticket-status-transitions.test.js
└── README.md
```

Additional helpers may be added only when required by the test implementation.

## Mandatory Integration Test Coverage

The required integration test tier will verify the ticket status state machine through the backend API.

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

## Current Status

- [x] Backend APIs manually validated in Postman
- [x] Valid status transitions manually verified
- [x] Invalid status transitions manually verified
- [ ] Integration test setup
- [ ] Automated valid-transition tests
- [ ] Automated invalid-transition tests
- [ ] Test results documented

## Related Documents

- `test-strategy.md`
- `test-results.md`
- `tool-specific/cursor-workflow/spec.md`
- `tool-specific/cursor-workflow/acceptance-criteria.md`
- `tool-specific/cursor-workflow/tasks.md`
