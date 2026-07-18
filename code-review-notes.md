# Code Review

Captures feedback from code reviews, action items, and decisions made during the review process.

## Overview

This document records the completed backend, frontend, testing, and final integration reviews.

## Review Sessions

### Review 1 — Project setup, database connection, models, and seed data

**Date:** 2026-07-15  
**Scope:**

- React and Express project setup
- Backend source structure under `server/src/`
- local MongoDB Community Edition connection
- User, Ticket, and Comment Mongoose models
- Seed script for users, tickets, and comments
- Related Cursor rules and design documentation

### Checks Performed

- Confirmed backend files follow the documented layered structure.
- Confirmed local MongoDB is accessed only through the Express backend.
- Confirmed credentials are loaded from `MONGODB_URI` and are not committed.
- Confirmed model fields, references, enums, defaults, timestamps, and indexes match the database design.
- Confirmed new tickets default to `Open`.
- Confirmed `assignedTo` remains optional.
- Confirmed the seed script creates the three required users and varied sample data.
- Confirmed the seed script can be run multiple times without creating duplicates.
- Confirmed the seed script uses `returnDocument: 'after'` instead of the deprecated `new: true` option.
- Confirmed local setup and Compass verification steps are documented.
- Confirmed the health endpoint still works after the database connection changes.

### Review 2 — Seeded users and ticket CRUD APIs

**Date:** 2026-07-15

- Reviewed `GET /api/users`
- Reviewed ticket create, list, detail, and update APIs
- Confirmed layered backend structure and documented response format
- Confirmed ticket creation defaults to `Open`
- Confirmed validation and update behaviour through Postman checks


### Review 3 — Comments API

**Date:** 2026-07-15

- Reviewed `POST /api/tickets/:id/comments`
- Confirmed comments are associated with the requested ticket
- Confirmed comment input and creator validation through Postman checks
- Confirmed successful creation and expected error responses


### Review 4 — Search, filtering, and status transitions

**Date:** 2026-07-15

- Reviewed keyword search and exact status filtering on `GET /api/tickets`
- Confirmed search is case-insensitive and matches partial title or description text
- Confirmed combined search and status parameters are rejected
- Confirmed valid status transitions succeed and invalid transitions are rejected
- Confirmed behaviour through manual Postman checks

### Review 5 — Ticket and comment input validation

**Date:** 2026-07-17

- Reviewed the new validation modules under `server/src/validation/`
- Confirmed ticket and comment field checks are separated from service-level business rules
- Confirmed null and non-object request bodies are rejected as validation errors
- Confirmed malformed `createdBy` and `assignedTo` ObjectIds are rejected before database lookup
- Confirmed existing API routes, response shapes, error messages, and status-transition logic remain unchanged
- Automated validation integration tests cover the implemented validation behaviour

## Feedback Summary

### Positive

- Planning and design documents were completed before implementation.
- Backend source files were reorganized consistently under `server/src/`.
- Validation responsibilities are separated correctly:
  - dedicated validation modules for API input
  - Mongoose for schema-level validation
  - services for database checks and business rules
- Seed data covers users, varied tickets, assignees, and comments.
- Secrets remain outside version control.

### Follow-up items

- Business rules such as valid assignees and ticket status transitions must remain in the service layer.
- Confirm centralized error handling covers all feature APIs during the final backend review.
- Mandatory status-transition integration tests are implemented and passing.
- Ticket and comment validation integration tests are implemented and passing.
- Frontend Core workflows and user-facing error states were reviewed after implementation.

## Action Items

- [x] Keep all backend source code under `server/src/`.
- [x] Use local MongoDB Community Edition through `MONGODB_URI`.
- [x] Create User, Ticket, and Comment models.
- [x] Add repeatable seed data.
- [x] Review seeded users and ticket CRUD APIs.
- [x] Review comments API.
- [x] Review search, filtering, and status-transition behaviour.
- [x] Review ticket and comment input validation structure.
- [x] Review frontend behaviour after UI implementation.
- [x] Review integration tests and final acceptance criteria.

## Resolved Items

- Resolved the backend folder-structure inconsistency.
- Resolved API response-format conflicts before implementation.
- Resolved MongoDB Atlas authentication failure caused by an outdated local password.
- Aligned the project with local MongoDB Community Edition setup requirements.
- Resolved repeated Mongoose deprecation warnings in the seed script.


### Review 6 — Frontend Core workflows

**Date:** 2026-07-17

- Reviewed acting-user selection, ticket list/detail, ticket creation and update, status changes, comments, search, status filtering, and error states.
- Confirmed the create and update forms open from explicit actions instead of remaining permanently visible.
- Confirmed acting-user selection is required only for ticket and comment creation.
- Confirmed concise success feedback and actionable inline error states are used consistently.

### Review 7 — Automated tests and final alignment

**Date:** 2026-07-18

- Reviewed both Jest/Supertest integration suites.
- Confirmed 44/44 tests pass against the isolated local test database.
- Confirmed valid and invalid status transitions, ticket validation, comment validation, and persistence/non-persistence checks are covered.
- Cross-checked the final root documentation against the completed Core implementation and assignment requirements.

## Commit Evidence

The Git history shows that the project was implemented incrementally rather than as one generated change:

| Phase | Representative commits |
|---|---|
| Project context and design | `docs: add project context, requirements, and acceptance criteria`; `docs: add system, database, API design and workflow artifacts`; `chore(cursor): added persistent workflow and cursor coding rules` |
| AI review and specification correction | `docs: validated AI suggestions and updated task plan`; `docs: align API specification with validated Cursor rules`; `docs: resolved API specification and Cursor rule conflicts` |
| Backend foundation and database | `feat(server): add MongoDB connection and align backend architecture`; `feat(server): add User, Ticket, and Comment models`; `feat(server): seed users, tickets, and comments` |
| Backend features | `feat(server): add seeded users API`; `feat(server): add ticket CRUD APIs`; `feat(server): add ticket comments API`; `feat:(server): add ticket search filtering, status filtering, enforce ticket status transitions` |
| Validation and testing | `feat(server): add ticket and comment validation with document updates`; `test(server): add ticket status transition integration tests`; `test(server): add integration(ticket and comment) tests and update test documentation` |
| Frontend delivery | `feat(client): add acting-user selector, UI guidelines(cursor rule and docs), and frontend dependencies(sonner and lucide-react)` through `feat(client): add ticket search and status filter` |
| Frontend refinement | `feat(client): open create-ticket form from modal and refine form UI`; `feat(client): open ticket update form from edit action and other validation improvements`; `feat(client): meaningful ui error messages`; `style(client): improve error message UI` |
| Prompt-history evidence | `Added Cursor hooks to auto-capture prompt history`; `docs: backfill initial prompt history setup`; `docs: align curated AI prompts with final project history` |

This sequence supports the review conclusion that planning, implementation, validation, UI refinement, testing, and documentation were completed as separate traceable steps.
