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

## Open Review Fixes

The following fixes are still pending and should be added after the related implementation or review is completed.

- [ ] Add centralized error handling for feature APIs, if not already implemented.
- [ ] Add mandatory integration tests for valid and invalid ticket status transitions.
- [ ] Add automated tests for backend validation and important failure cases.
- [ ] Review frontend ticket creation, update, comment, search, filter, and status-transition behaviour.
- [ ] Confirm meaningful frontend error states for rejected backend operations.
- [ ] Run the final acceptance-criteria review.
- [ ] Record final test results in `test-results.md`.
- [ ] Update this file with any fixes made during frontend, automated-testing, and final-integration review.

## Summary

The completed review fixes have mainly improved:

- consistency between design documents and implementation,
- local database reproducibility,
- seed-script reliability,
- backend business-rule enforcement,
- API validation,
- documentation accuracy, and
- traceability between review findings and commits.

The most important remaining review fix is to add and pass the mandatory state-machine integration tests.
