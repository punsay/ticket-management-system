# Implementation Plan

## Overview

The Support Ticket Management System is being implemented incrementally using a specification-driven Cursor workflow.

The project follows this order:

1. Define project context, requirements, acceptance criteria, and Core scope.
2. Create the system, database, and API designs.
3. Set up the React client and Express server.
4. Configure the local MongoDB database and seed data.
5. Implement and manually verify the backend APIs.
6. Build the frontend workflows.
7. Add the required integration tests.
8. Complete final validation, review, and submission documentation.

Detailed implementation tasks and progress are maintained in:

`tool-specific/cursor-workflow/tasks.md`

## Task Breakdown

### 1. Planning and specification

- [x] Create persistent project context.
- [x] Analyse requirements and define Core scope.
- [x] Define acceptance criteria.
- [x] Create the behavioural specification.
- [x] Create and maintain the implementation task tracker.
- [x] Add persistent Cursor rules and instructions.
- [x] Review planning documents for conflicts before implementation.

### 2. Design

- [x] Create the system design.
- [x] Create the database design.
- [x] Create the API contract.
- [x] Align API response formats and error behaviour.
- [x] Define search and status-filter behaviour.
- [x] Define ticket status-transition rules.

### 3. Project and database setup

- [x] Scaffold the React client.
- [x] Scaffold the Express server.
- [x] Organize backend application code under `server/src/`.
- [x] Configure environment variables and development scripts.
- [x] Configure MongoDB Community Edition for local development.
- [x] Add Mongoose models for User, Ticket, and Comment.
- [x] Add repeatable seed data.
- [x] Document local MongoDB installation, configuration, and seeding.
- [x] Verify the local database and seeded collections in MongoDB Compass.
- [x] Replace the deprecated Mongoose `new: true` seed option with `returnDocument: 'after'`.

### 4. Backend implementation

- [x] Add the Express server and health endpoint.
- [x] Add the seeded-users API.
- [x] Add ticket create, list, detail, and update APIs.
- [x] Add backend validation for ticket and comment inputs.
- [x] Add the comment creation API.
- [x] Return comments in oldest-first order.
- [x] Add case-insensitive partial keyword search on title and description.
- [x] Add exact status filtering.
- [x] Reject requests that combine search and status filters.
- [x] Enforce valid ticket status transitions.
- [x] Reject invalid status transitions with a clear API error.
- [x] Manually validate implemented APIs in Postman.

### 5. Frontend implementation

- [x] Add the acting-user selector.
- [ ] Add ticket list and ticket detail views.
- [ ] Add the create-ticket form.
- [ ] Add ticket field updates and reassignment.
- [ ] Add the ticket status-change control.
- [ ] Add comment creation and display.
- [ ] Add keyword-search and status-filter controls.
- [ ] Add meaningful loading, empty, and error states.

### 6. Testing

- [ ] Finalize the testing strategy.
- [ ] Add integration tests for all valid status transitions.
- [ ] Add integration tests for representative invalid transitions.
- [ ] Run the complete integration-test suite.
- [ ] Record test results.
- [ ] Verify that data persists after application and MongoDB restarts.

### 7. Review and final documentation

- [x] Record debugging issues and fixes progressively.
- [x] Record code-review observations progressively.
- [x] Update the PR description as features are completed.
- [x] Update the reflection and tool-workflow documents progressively.
- [ ] Complete frontend review.
- [ ] Complete integration-test review.
- [ ] Finalize README run and test instructions.
- [ ] Review prompt history for planning, implementation, testing, debugging, review, and documentation evidence.
- [ ] Complete final review against the acceptance criteria.
- [ ] Verify that no secrets are committed.
- [ ] Prepare the repository for submission.

## Milestones

### Milestone 1 — Planning and design

**Status:** Complete

Completed project context, requirements, acceptance criteria, specification, implementation tasks, system design, database design, API contract, and Cursor rules.

### Milestone 2 — Backend foundation and local database

**Status:** Complete

Completed the React and Express setup, local MongoDB Community Edition configuration, Mongoose models, seed data, environment setup, Compass verification, and repeatable database setup instructions.

### Milestone 3 — Core backend APIs

**Status:** Complete

Completed seeded users, ticket CRUD, comments, keyword search, status filtering, backend input validation, and enforced ticket status transitions. The implemented APIs were manually verified in Postman.

### Milestone 4 — Frontend Core workflows

**Status:** In progress

Build the required ticket-management UI, acting-user flow, comments, search, filtering, status changes, and meaningful error states.

### Milestone 5 — Mandatory testing

**Status:** Pending

Add integration tests proving that valid ticket status transitions succeed and invalid transitions are rejected.

### Milestone 6 — Final review and submission

**Status:** Pending

Complete final documentation, prompt-history review, acceptance-criteria verification, test results, and repository readiness checks.

## AI Usage Plan

Cursor is the primary AI-assisted development tool.

AI is used for:

- requirement analysis and clarification
- planning and design
- focused code generation
- debugging
- test planning and test implementation
- code review
- documentation updates

Persistent context is maintained in `tool-specific/cursor-workflow/` and `.cursor/rules/`.

Each implementation prompt is limited to one task. AI-generated changes are reviewed before acceptance and validated through local execution, MongoDB Compass, Postman, and automated tests where applicable.

## Risks

### Scope expansion

Optional features could distract from completing the mandatory Core and lifecycle artifacts.

### Documentation and implementation drift

Requirements, API behaviour, Cursor rules, and implementation could become inconsistent.

### Missing backend enforcement

Frontend-only validation could allow invalid data or invalid status transitions.

### Local setup failures

Another developer may be unable to reproduce the database and seed setup.

### Insufficient testing evidence

Manual API checks alone do not satisfy the required state-machine integration-test tier.

### Unreviewed AI output

AI-generated code or documentation may include incorrect assumptions, deprecated options, or unnecessary complexity.

## Mitigation

- Keep Stretch features outside the current implementation plan.
- Use the approved project context, specification, acceptance criteria, and Cursor rules as the source of truth.
- Update `tool-specific/cursor-workflow/tasks.md` as implementation progress changes.
- Enforce input validation and business rules in the backend.
- Keep local database setup in `README.md` and `database/setup-notes.md`.
- Keep the seed script repeatable and verify seeded data in MongoDB Compass.
- Add the mandatory valid and invalid status-transition integration tests before final submission.
- Review AI output, run the affected workflow, and document corrections and rejected suggestions.
