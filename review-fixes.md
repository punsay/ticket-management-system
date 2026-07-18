# Review Fixes

Records the changes made after code review, AI-assisted review, manual validation, and project-alignment checks.

## Overview

This document tracks review findings that resulted in an actual code, configuration, documentation, or workflow change. It complements `code-review-notes.md`, which records the review observations and remaining action items.

## Fixes Applied

### RF-01 — Backend folder structure aligned

**Review finding:**  
Backend files were not initially organized consistently with the documented layered architecture.

**Fix applied:**  
Moved and organized backend source files under `server/src/` using separate configuration, model, service, controller, route, validation, and middleware areas as applicable.

**Validation:**  
Confirmed the Express application starts successfully and the health endpoint continues to work.

**Related commit:**  
`feat(server): add MongoDB connection and align backend architecture`

**Status:** Completed

---

### RF-02 — API design and Cursor-rule conflicts resolved

**Review finding:**  
Some API response conventions and implementation guidance differed between the API documentation and Cursor workflow rules.

**Fix applied:**  
Reviewed the conflicting guidance, selected one consistent API approach, and updated the documentation and persistent Cursor instructions before continuing implementation.

**Validation:**  
Verified that later seeded-user, ticket, and comment endpoints follow the agreed structure.

**Related commits:**

- `docs: align API specification with validated Cursor rules`
- `docs: resolved API specification and Cursor rule conflicts`

**Status:** Completed

---

### RF-03 — MongoDB connection issue corrected

**Review finding:**  
The backend could not connect to MongoDB Atlas because the local environment contained an outdated database password.

**Fix applied:**  
Corrected the connection value in the local environment and documented the investigation and resolution without committing credentials.

**Validation:**  
Confirmed successful database connection and application startup.

**Related commit:**  
`docs: record MongoDB authentication fix`

**Status:** Completed

---

### RF-04 — Project database setup aligned to local MongoDB

**Review finding:**  
The updated project requirements expected a locally runnable database setup, while the initial implementation and documentation focused on MongoDB Atlas.

**Fix applied:**  

- Switched the documented development setup to MongoDB Community Edition.
- Kept the connection configurable through `MONGODB_URI`.
- Added local setup and MongoDB Compass verification instructions.
- Preserved `.env.example` without real credentials.

**Validation:**  
Confirmed the backend connects to local MongoDB and persisted data remains available after restart.

**Related commits:**

- `docs: document MongoDB Atlas and refine backend architecture rules`
- `fix(seed): replace deprecated mongoose option and document local database setup`

**Status:** Completed

---

### RF-05 — Mongoose seed-script deprecation removed

**Review finding:**  
The seed script used the deprecated `new: true` option in an update operation.

**Fix applied:**  
Replaced the deprecated option with:

```js
returnDocument: 'after'
```

**Validation:**  
Ran the seed process and confirmed that it completes without the previous deprecation warning.

**Related commit:**  
`fix(seed): replace deprecated mongoose option and document local database setup`

**Status:** Completed

---

### RF-06 — Seed process made repeatable

**Review finding:**  
Running seed data more than once could create duplicate records or produce inconsistent development data.

**Fix applied:**  
Used stable identifying fields and upsert-style seed operations so required users and sample records can be initialized repeatedly.

**Validation:**  
Ran the seed process multiple times and confirmed the required seed data was not duplicated.

**Related commit:**  
`feat(server): seed users, tickets, and comments`

**Status:** Completed

---

### RF-07 — Ticket status changes restricted to valid transitions

**Review finding:**  
Ticket status updates required an explicit backend state machine rather than unrestricted field updates.

**Fix applied:**  
Added backend transition checks for:

- `Open` → `In Progress`
- `Open` → `Cancelled`
- `In Progress` → `Resolved`
- `In Progress` → `Cancelled`
- `Resolved` → `Closed`

All other transitions are rejected with a clear error response.

**Validation:**  
Validated valid and invalid transition scenarios manually in Postman.

**Related commits:**

- `feat:(server): add ticket search filtering, status filtering, enforce ticket status transitions`
- `docs: update backend search and status transition progress`

**Status:** Completed

---

### RF-08 — Search behaviour clarified and documented

**Review finding:**  
The expected behaviour for keyword search, case sensitivity, partial matching, and status filtering needed to be explicit.

**Fix applied:**  

- Implemented case-insensitive keyword search.
- Allowed partial matching against ticket title and description.
- Implemented exact status filtering.
- Documented the observed and validated behaviour.

**Validation:**  
Checked keyword search and status-filter requests manually in Postman.

**Related commits:**

- `feat:(server): add ticket search filtering, status filtering, enforce ticket status transitions`
- `docs: update backend search and status transition progress`

**Status:** Completed

---

### RF-09 — Comment validation and ticket association verified

**Review finding:**  
Comment creation needed to reject invalid input and ensure each comment belongs to an existing ticket and seeded creator.

**Fix applied:**  
Added and reviewed validation for comment message, ticket reference, and creator reference.

**Validation:**  
Validated successful comment creation and expected failure responses in Postman.

**Related commits:**

- `feat(server): add ticket comments API`
- `docs: update comment API completion and Postman validation`

**Status:** Completed

---

### RF-10 — Documentation updated after implementation reviews

**Review finding:**  
Planning and lifecycle documents needed to reflect the actual implementation rather than the original plan only.

**Fix applied:**  
Updated API review notes, workflow documentation, debugging records, database setup guidance, and implementation progress after each completed backend phase.

**Validation:**  
Cross-checked the documentation against the implemented models, seed process, API routes, search/filter behaviour, and ticket transition rules.

**Related commits:**

- `docs: document backend foundation review and debugging outcomes`
- `docs: update API review, workflow, and project change summary`
- `docs: update comment API completion and Postman validation`
- `docs: update backend search and status transition progress`

**Status:** Completed

---

### RF-11 — Ticket and comment validation separated from services

**Review finding:**  
Ticket and comment field validation was mixed into the service layer, and null or non-object request bodies could produce an unexpected server error. Malformed user IDs were also not rejected before database lookup.

**Fix applied:**  

- Added shared validation helpers under `server/src/validation/`.
- Added dedicated ticket and comment validation modules.
- Added request-body object checks and MongoDB ObjectId format checks.
- Updated `ticketService.js` to delegate field validation while retaining database checks and business rules.
- Kept existing API routes, response shapes, error messages, and status-transition logic unchanged.

**Validation:**  
Code review and automated integration validation completed.

**Related commit:**  
`feat(server): add ticket and comment validation with document updates`

**Status:** Completed

### RF-12 — Mandatory integration tests added

**Review finding:**  
Manual Postman checks alone did not satisfy the assignment's mandatory automated state-machine test requirement.

**Fix applied:**  

- Added Jest and Supertest integration-test setup using the exported Express application.
- Added a dedicated local test database.
- Added valid and invalid ticket status-transition tests.
- Added focused ticket-create, ticket-update, and comment-create validation tests.
- Added persistence and non-persistence assertions.

**Validation:**  
Ran `cd server && npm test`; both suites passed with 44/44 tests.

**Related commits:**

- `docs(testing): manually refine Cursor-generated strategy for Core test scope`
- `docs(cursor): add testing rule and update rule documentation`
- `docs: align test setup documentation and configuration`
- `test(server): add ticket status transition integration tests`
- `test(server): add integration(ticket and comment) tests and update test documentation`

**Status:** Completed

---

### RF-13 — Frontend workflows completed and refined

**Review finding:**  
The Core required a complete frontend, and the first generated forms needed UI refinement so the ticket list remained the primary view and error feedback was clearer.

**Fix applied:**  

- Added acting-user selection, ticket list/detail, create, update, status change, comments, search, and status filtering.
- Opened create and update forms from explicit user actions rather than showing them permanently.
- Added meaningful loading, validation, success, empty, backend, and network states.
- Standardized brief action feedback with `sonner` and icons with `lucide-react`.

**Validation:**  
Manually verified the Core frontend workflows against the backend API and assignment acceptance criteria.

**Related commits:**

- `feat(client): add acting-user selector, UI guidelines(cursor rule and docs), and frontend dependencies(sonner and lucide-react)`
- `feat(client): add ticket list and detail views`
- `feat(client): add create ticket form`
- `feat(client): open create-ticket form from modal and refine form UI`
- `feat(client): open ticket update form from edit action and other validation improvements`
- `feat(client): add ticket status change control`
- `feat(client): add ticket comments`
- `feat(client): add ticket search and status filter`
- `feat(client): meaningful ui error messages`
- `style(client): improve error message UI`

**Status:** Completed

---

### RF-14 — Prompt history completed and curated

**Review finding:**  
The assignment requires enough prompt history to evaluate context setting, iteration, correction, testing, debugging, review, and documentation use.

**Fix applied:**  

- Added automatic prompt-history hooks.
- Manually backfilled the initial hook-setup interaction that occurred before the hooks existed.
- Aligned the curated `ai-prompts/` evidence with the final project history.

**Validation:**  
Reviewed the prompt-history and curated AI-prompt documents for traceability across the lifecycle.

**Related commits:**

- `Added Cursor hooks to auto-capture prompt history`
- `docs: backfill initial prompt history setup`
- `docs: align curated AI prompts with final project history`

**Status:** Completed

---

## Suggestions Reviewed but Not Applied

### Authentication

**Suggestion:** Add login, JWT authentication, and protected routes.

**Decision:** Rejected for the current Core implementation.

**Reason:** Authentication is optional and would expand the project beyond the mandatory scope. The project continues to use seeded users.

---

### Full user-management UI

**Suggestion:** Add user creation, editing, and role-management screens.

**Decision:** Rejected for the current Core implementation.

**Reason:** Users are seeded only, and user-management functionality is a Stretch feature.

---

### Additional filters, pagination, and sorting

**Suggestion:** Add priority and assignee filters, pagination, and sorting.

**Decision:** Deferred.

**Reason:** Keyword search and status filtering satisfy the Core requirement. Additional filters belong to Stretch scope.

---

### Moving application models into `database/`

**Suggestion:** Move Mongoose model files from the backend into the root `database/` folder.

**Decision:** Rejected.

**Reason:** Runtime Mongoose models belong to the backend application under `server/src/models/`. The root `database/` directory is reserved for setup, initialization, schema/migration evidence, seed data, and setup notes.

## Final Review Fixes

- [x] Confirmed centralized feature error handling and safe client-facing messages.
- [x] Added mandatory integration tests for valid and invalid ticket status transitions.
- [x] Added automated ticket and comment validation coverage.
- [x] Reviewed frontend ticket creation, update, comments, search, filtering, and status transitions.
- [x] Confirmed meaningful frontend validation, business-rule, loading, empty, and network error states.
- [x] Completed the final acceptance-criteria review.
- [x] Recorded the final 44/44 automated test result in `test-results.md`.

## Summary

The completed review fixes have mainly improved:

- consistency between design documents and implementation,
- local database reproducibility,
- seed-script reliability,
- backend business-rule enforcement,
- API validation,
- documentation accuracy, and
- traceability between review findings and commits.

All mandatory Core review fixes are complete. Optional frontend automation and CI remain outside Core scope.
