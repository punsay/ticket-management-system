# Debugging Prompts

Selected debugging prompts and corrections from the full append-only Cursor history in `prompt-history/history.md`.

## Issue 1 — Incorrect backend route import

### Prompt summary

Connect MongoDB before server startup while keeping the existing health endpoint working.

### AI response summary

Cursor found an incorrect relative import for the health route and corrected it while preserving the scoped database task.

### What I accepted

The import correction.

### What I changed

Updated the health-route import in `server/src/app.js`.

### What I rejected

Unrelated backend or feature changes.

### Why

The fix was directly required for the application to load and did not expand the task.

### What I validated

- The app loaded.
- The health endpoint returned the expected response.
- Database connection occurred before startup.

---

## Issue 2 — MongoDB authentication failure

### Prompt summary

Run and verify the seed script against the configured MongoDB database.

### AI response summary

AI helped distinguish an environment credential problem from a defect in the seed-script logic.

### What I accepted

Checking the local `MONGODB_URI` against the current database credentials.

### What I changed

Updated the local environment value only.

### What I rejected

Changing working seed logic or placing credentials in documentation.

### Why

The root cause was stale local configuration, not application code.

### What I validated

- Correcting the local value restored access.
- The seed completed successfully.
- No credentials were committed or copied into documentation.

---

## Issue 3 — Deprecated Mongoose option

### Prompt summary

Review warnings from the repeatable seed run and make only a small supported fix.

### AI response summary

AI identified `new: true` as deprecated and recommended `returnDocument: 'after'`.

### What I accepted

The supported Mongoose option replacement.

### What I changed

Replaced the deprecated option in the seed upsert helpers.

### What I rejected

Rewriting the seed process.

### Why

The existing seed behaviour was correct; only the deprecated option required correction.

### What I validated

- Seed results remained correct.
- Repeatable behaviour was preserved.
- The warning disappeared.

---

## Issue 4 — Contract and rule conflict

### Prompt summary

Review project documents and active Cursor rules for contradictions that would block implementation.

### AI response summary

Cursor found inconsistent API response envelopes, undefined simultaneous search/status behaviour, and mismatched frontend parsing guidance.

### What I accepted

All three blocking findings.

### What I changed

Aligned documentation and rules on `{ success, data | error }`, HTTP 400 for combined filters, and frontend parsing of `data` and `error.message`.

### What I rejected

Optional design changes unrelated to the blockers.

### Why

One consistent contract was required before backend and frontend implementation.

### What I validated

The same response envelope and combined-filter error could be consumed consistently across layers.

---

## Issue 5 — Status transition already implemented

### Prompt summary

Implement the next backend task for ticket status-transition rules.

### AI response summary

Cursor inspected the existing service and update flow and found that the transition rules were already implemented.

### What I accepted

Verification of the existing implementation instead of generating duplicate code.

### What I changed

Updated task and verification evidence only; no production code was changed.

### What I rejected

Duplicating the transition service or rewriting working logic.

### Why

Inspecting existing code first avoided unnecessary changes.

### What I validated

Valid, invalid, backward, terminal, same-status, and invalid-value scenarios.

---

## Issue 6 — Integration tests racing on one test database

### Prompt summary

Implement the ticket and comment validation integration suite using the existing isolated test setup.

### AI response summary

Cursor traced inconsistent full-suite results to parallel setup and cleanup against one shared test database.

### What I accepted

Running the two integration suites serially.

### What I changed

Added `maxWorkers: 1` to `server/jest.config.js`.

### What I rejected

Adding multiple databases or more test infrastructure.

### Why

A minimal configuration change made the existing setup deterministic.

### What I validated

Both suites completed reliably with 44 passing tests.

---

## Issue 7 — Success toast shown for an unchanged ticket

### Prompt summary

Correct the update flow so the success toast appears only when ticket data is actually changed.

### AI response summary

Cursor compared normalized submitted values with the current ticket before sending the update request.

### What I accepted

A no-change guard in the existing update form.

### What I changed

Added comparison logic in `UpdateTicketForm.jsx` so unchanged submissions return without an API request or toast.

### What I rejected

Backend changes or broader form refactoring.

### Why

The issue was frontend feedback accuracy and could be fixed locally with minimal risk.

### What I validated

- No-change submission makes no request and shows no toast.
- Real changes still persist and show success feedback.
