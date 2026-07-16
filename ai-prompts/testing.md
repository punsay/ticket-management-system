# Testing Prompts

Selected testing and validation prompts from the full append-only Cursor history.

## Prompt 1 — Make state-machine tests part of acceptance criteria

**Date:** 2026-07-13

### Prompt summary

Create clear, testable acceptance criteria covering valid and invalid transitions, backend validation, persistence, seed data, meaningful UI errors, and mandatory state-machine integration tests.

### AI response summary

Cursor created acceptance criteria linked to requirement IDs and included valid/invalid transition test expectations.

### What I accepted

- Explicit testable criteria
- Coverage of all five valid transition paths
- Rejection of invalid transitions
- Backend validation criteria
- Persistence and seed checks

### What I changed

Acceptance criteria were later updated to reflect optional assignment, separate search/filter behaviour, and exact acting-user rules.

### What I rejected

Prompt-history traceability as a separate product acceptance criterion.

### Why

It is repository evidence, not application behaviour.

---

## Prompt 2 — Validate ticket creation and listing APIs

**Date:** 2026-07-15

### Prompt summary

Implement only ticket creation and listing and verify documented validation behaviour.

### AI response summary

Cursor reported checks for successful listing and creation, default `Open` status, invalid title, description, priority, creator, and assignee.

### What I accepted

Manual API verification in Postman as interim evidence.

### What I changed

Automated backend validation tests remain a separate later task.

### What I rejected

Treating manual checks as a replacement for the mandatory state-machine integration test tier.

### Why

The project brief explicitly requires integration tests for ticket transition rules.

---

## Prompt 3 — Validate comments API

**Date:** 2026-07-15

### Prompt summary

Implement comment creation and ensure detail responses return comments oldest first. Validate message, creator, ticket ID, and ticket existence.

### AI response summary

Cursor reported successful and failure checks for all documented scenarios.

### What I accepted

- Valid comment returns 201
- Missing message returns 400
- Invalid creator returns 400
- Missing ticket returns 404
- Oldest-first retrieval verified

### What I changed

These results were documented in the workflow and testing records.

### What I rejected

Comment editing and deletion tests.

### Why

Comment edit/delete are outside Core scope.

---

## Prompt 4 — Verify search and status filtering

**Date:** 2026-07-15

### Prompt summary

Implement keyword search and status filtering with minimal changes.

### AI response summary

Cursor manually checked:

- unfiltered listing;
- case-insensitive keyword matching;
- status filtering;
- combined query rejection;
- invalid status rejection;
- no-result behaviour.

### What I accepted

The manual scenarios and their expected status codes.

### What I changed

Automated search/filter tests were left as recommended additional coverage, while state-machine integration tests remained mandatory.

### What I rejected

Combined filtering support.

### Why

The confirmed Core contract requires independent search and status filtering.

---

## Prompt 5 — Verify status-transition implementation

**Date:** 2026-07-15

### Prompt summary

Implement the next status-transition task.

### AI response summary

Cursor detected that transition logic already existed, reviewed the source, and performed end-to-end checks instead of duplicating it.

### What I accepted

Verification of:

- `Open` → `In Progress`
- invalid `Open` → `Resolved`
- invalid backward transitions
- terminal-state rejection
- same-status no-op
- invalid status values

### What I changed

Only the task checklist was updated because the feature code already existed.

### What I rejected

Duplicate transition implementation.

### Why

Reviewing the existing code was safer and more accurate than blindly generating new code.

## Remaining testing work

- Add automated integration tests proving every valid transition succeeds.
- Add invalid-transition integration tests.
- Add backend validation failure tests.
- Record commands and final results in `test-results.md`.
