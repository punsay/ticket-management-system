# Debugging Prompts

Selected debugging prompts and corrections from the full append-only Cursor history in `prompt-history/history.md`.

## Issue 1 — Incorrect backend route import

### Context

The MongoDB connection task exposed an incorrect relative import for the health route.

### AI assistance

Cursor identified and corrected the import while preserving the endpoint.

### What I validated

- The app loaded.
- The health endpoint returned the expected response.
- Database connection occurred before startup.

### Final fix

Updated the import in `server/src/app.js`.

### Judgment applied

The fix was directly required by the scoped task and did not expand implementation.

---

## Issue 2 — MongoDB authentication failure

### Context

The seed command failed because the local `MONGODB_URI` contained outdated credentials.

### AI assistance

AI helped distinguish an environment problem from seed-script logic.

### What I validated

- Correcting the local value restored access.
- No credentials were committed or copied into documentation.

### Final fix

Updated the local environment only.

### Judgment applied

Sensitive values remained outside prompts and version control.

---

## Issue 3 — Deprecated Mongoose option

### Context

The seed script produced a warning for `new: true`.

### AI assistance

AI recommended `returnDocument: 'after'`.

### What I validated

- Seed results remained correct.
- Repeatable behaviour was preserved.
- The warning disappeared.

### Final fix

Replaced the deprecated option.

---

## Issue 4 — Contract and rule conflict

### Context

The API contract and active Cursor rules described different response shapes and did not define simultaneous search/status behaviour.

### AI assistance

A cross-document review found the conflict before frontend implementation.

### What I validated

One envelope and one combined-filter error could be consumed consistently across layers.

### Final fix

Aligned documentation and rules on `{ success, data | error }` and HTTP 400 for combined filters.

### Judgment applied

The documented contract was corrected rather than allowing layer-specific interpretations.

---

## Issue 5 — Status transition already implemented

### Context

A later task asked for transition rules that had already been added during ticket update implementation.

### AI assistance

Cursor inspected the service and update flow instead of writing duplicate code.

### What I validated

Valid, invalid, backward, terminal, same-status, and invalid-value scenarios.

### Final fix

No production change; task and evidence were updated.

### Judgment applied

Existing working code was verified rather than regenerated.

---

## Issue 6 — Integration tests racing on one test database

### Context

The two Jest integration suites shared the same isolated database and conflicted when run in parallel.

### AI assistance

Cursor traced inconsistent results to concurrent setup and cleanup.

### What I validated

Running the suites serially produced deterministic cleanup and 44 passing tests.

### Final fix

Added `maxWorkers: 1` to `server/jest.config.js`.

### Judgment applied

A minimal configuration fix was preferred over introducing more test infrastructure.

---

## Issue 7 — Success toast shown for an unchanged ticket

### Context

Submitting the update form without changing any values still called the API and displayed “Ticket updated.”

### AI assistance

Cursor compared normalized submitted values with the current ticket.

### What I validated

- No-change submission makes no request and shows no toast.
- Real changes still persist and show success feedback.

### Final fix

Added a no-change guard in `UpdateTicketForm.jsx`.

### Judgment applied

Success feedback now represents an actual user-visible change.
