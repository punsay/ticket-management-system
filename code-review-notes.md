# Code Review

Captures feedback from code reviews, action items, and decisions made during the review process.

## Overview

This document records reviews of completed implementation phases. It is updated progressively as backend, frontend, testing, and final integration work are completed.

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
- Postman regression checks are pending

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
- Automated integration tests are still required for search, filtering, and status-transition behaviour.
- Integration tests are still required for valid and invalid status transitions.

## Action Items

- [x] Keep all backend source code under `server/src/`.
- [x] Use local MongoDB Community Edition through `MONGODB_URI`.
- [x] Create User, Ticket, and Comment models.
- [x] Add repeatable seed data.
- [x] Review seeded users and ticket CRUD APIs.
- [x] Review comments API.
- [x] Review search, filtering, and status-transition behaviour.
- [x] Review ticket and comment input validation structure.
- [ ] Review frontend behaviour after UI implementation.
- [ ] Review integration tests and final acceptance criteria.

## Resolved Items

- Resolved the backend folder-structure inconsistency.
- Resolved API response-format conflicts before implementation.
- Resolved MongoDB Atlas authentication failure caused by an outdated local password.
- Aligned the project with local MongoDB Community Edition setup requirements.
- Resolved repeated Mongoose deprecation warnings in the seed script.
