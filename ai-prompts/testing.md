# Testing Prompts

Selected testing and validation prompts from the full append-only Cursor history in `prompt-history/history.md`.

## Prompt 1 — Define the testing strategy

**Date:** 2026-07-17

### Prompt summary

Create a simple strategy covering manual Postman checks and mandatory backend integration tests for status transitions and ticket/comment validation.

### AI response summary

Cursor defined Postman regression coverage and a Jest/Supertest integration tier using an isolated local MongoDB test database.

### What I accepted

- State-machine tests as mandatory
- Ticket and comment validation coverage
- Deterministic fixtures and cleanup
- Persistence and non-persistence assertions
- Manual checks kept separate from automated evidence

### What I changed

Optional unit, component, frontend E2E, CI, and Docker testing were excluded from Core.

### What I rejected

Treating manual Postman verification as a replacement for integration tests.

### Why

The assignment explicitly requires integration tests proving valid and invalid transition rules.

---

## Prompt 2 — Assess integration-test readiness

**Date:** 2026-07-17

### Prompt summary

Review the backend and test setup without modifying files and report blockers, mismatches, and minimal setup changes.

### AI response summary

Cursor confirmed that the backend was testable but Jest, Supertest, test database lifecycle, test files, and documentation alignment were missing.

### What I accepted

- Backend ready as implemented
- Test-only setup required
- Separate development and test databases
- Two planned integration test files

### What I changed

Test filenames, database examples, ports, task status, and pending evidence were aligned before test implementation.

### What I rejected

Production code changes without a failing test proving a defect.

### Why

The test harness should exercise the real app without altering working production behaviour unnecessarily.

---

## Prompt 3 — Implement state-transition integration tests

**Date:** 2026-07-17

### Prompt summary

Add the minimal Jest/Supertest setup and implement only the ticket status-transition suite with persistence checks.

### AI response summary

Cursor added the shared test setup, isolated database, deterministic fixtures, and 14 status-transition tests.

### What I accepted

- All five valid paths
- Representative invalid, backward, and terminal transitions
- Invalid status and same-status cases
- Re-fetch assertions proving persisted or unchanged status
- No production code changes

### What I changed

A small HTTP helper was used to avoid an environment-specific Supertest dependency-resolution issue.

### What I rejected

Validation tests in the same task.

### Why

The mandatory signature test tier was implemented first and kept reviewable.

---

## Prompt 4 — Implement ticket and comment validation tests

**Date:** 2026-07-17

### Prompt summary

Add only the required ticket create/update and comment-create validation integration tests using the existing setup.

### AI response summary

Cursor added 30 validation tests covering successful requests, representative invalid input, expected responses, and persistence/non-persistence.

### What I accepted

- Ticket create and update validation
- Comment validation
- Standard response-envelope assertions
- No invalid database writes
- Reuse of shared fixtures and cleanup

### What I changed

Jest was configured with `maxWorkers: 1` because both suites share one isolated test database and parallel execution caused race conditions.

### What I rejected

Optional test tiers and unrelated production changes.

### Why

Serial execution made the existing isolated database setup deterministic without adding unnecessary infrastructure.

---

## Final automated result

```text
Test suites: 2 passed
Tests:       44 passed
Command:     cd server && npm test
Exit code:   0
```

The completed coverage consists of 14 status-transition tests and 30 ticket/comment validation tests. Detailed evidence remains in `test-results.md`.
