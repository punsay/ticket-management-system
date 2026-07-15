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
- MongoDB Atlas connection
- User, Ticket, and Comment Mongoose models
- Seed script for users, tickets, and comments
- Related Cursor rules and design documentation

### Checks Performed

- Confirmed backend files follow the documented layered structure.
- Confirmed MongoDB Atlas is accessed only through the Express backend.
- Confirmed credentials are loaded from `MONGODB_URI` and are not committed.
- Confirmed model fields, references, enums, defaults, timestamps, and indexes match the database design.
- Confirmed new tickets default to `Open`.
- Confirmed `assignedTo` remains optional.
- Confirmed the seed script creates the three required users and varied sample data.
- Confirmed the seed script can be run multiple times without creating duplicates.
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

## Feedback Summary

### Positive

- Planning and design documents were completed before implementation.
- Backend source files were reorganized consistently under `server/src/`.
- Database validation is separated correctly:
  - Zod for API input
  - Mongoose for schema-level validation
  - services for business rules
- Seed data covers users, varied tickets, assignees, and comments.
- Secrets remain outside version control.

### Follow-up items

- Business rules such as valid assignees and ticket status transitions must remain in the service layer.
- Centralized error handling still needs to be implemented for feature APIs.
- Search, filter, and status-transition APIs still need implementation and review.
- Integration tests are still required for valid and invalid status transitions.

## Action Items

- [x] Keep all backend source code under `server/src/`.
- [x] Use MongoDB Atlas through `MONGODB_URI`.
- [x] Create User, Ticket, and Comment models.
- [x] Add repeatable seed data.
- [x] Review seeded users and ticket CRUD APIs.
- [x] Review comments API.
- [ ] Review remaining backend APIs after implementation.
- [ ] Review frontend behaviour after UI implementation.
- [ ] Review integration tests and final acceptance criteria.

## Resolved Items

- Resolved the backend folder-structure inconsistency.
- Resolved API response-format conflicts before implementation.
- Resolved MongoDB Atlas authentication failure caused by an outdated local password.
