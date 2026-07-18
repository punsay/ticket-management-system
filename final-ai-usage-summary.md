# Final AI Usage Summary

## Project

**Project:** Support Ticket Management System  
**Primary AI Tool:** Cursor  
**Technology Stack:** React, JavaScript, Tailwind CSS, Node.js, Express, MongoDB  
**Project Scope:** Mandatory Core implementation with selected reusable workflow practices

## Overview

AI was used throughout the software-development lifecycle as a support tool for requirement analysis, planning, design, implementation guidance, testing preparation, debugging, code review, documentation, and reflection.

The project was not completed by copying AI output directly. AI suggestions were reviewed against the project requirements, existing documentation, implementation state, and manual validation results before being accepted. Suggestions that expanded the scope unnecessarily or conflicted with the agreed architecture were rejected or deferred.

## How AI Was Used

### 1. Requirement Analysis

AI helped to:

- break the project brief into functional, validation, business-rule, and non-functional requirements;
- identify the mandatory Core features and separate them from optional Stretch work;
- define the User, Ticket, and Comment entities;
- clarify ticket lifecycle rules;
- identify backend validation and frontend error-handling expectations;
- convert requirements into acceptance criteria and traceable tasks.

The final understanding was recorded in project documents such as:

- `requirements-analysis.md`
- `acceptance-criteria.md`
- `tool-specific/cursor-workflow/project-context.md`
- `tool-specific/cursor-workflow/spec.md`
- `tool-specific/cursor-workflow/tasks.md`

### 2. Planning and Design

AI was used to propose and refine:

- the React, Express, and MongoDB architecture;
- separation between frontend, backend, database setup, documentation, and tests;
- backend layers such as routes, controllers, services, models, validation, configuration, and middleware;
- MongoDB model relationships;
- local database setup and seed-data strategy;
- API endpoints and response conventions;
- ticket state-transition handling;
- testing and validation strategy.

The design was reviewed before implementation and captured in:

- `design-notes.md`
- `system-design.md`
- `database-design.md`
- `data-model.md`
- `api-contract.md`
- `ui-flow.md`
- `test-strategy.md`

### 3. Persistent Cursor Context

Cursor was configured with persistent project context so that implementation prompts did not need to repeat the entire project scope.

The workflow used:

- `project-context.md`
- `spec.md`
- `tasks.md`
- `acceptance-criteria.md`
- `cursor-rules-or-instructions.md`

These files helped keep AI suggestions aligned with:

- the Core scope;
- the selected stack;
- the backend architecture;
- validation boundaries;
- naming conventions;
- the rule that business logic belongs in the service layer;
- the requirement to avoid implementing unrequested Stretch features.

### 4. Code Generation and Implementation Guidance

AI was used to support implementation of:

- initial React and Express setup;
- MongoDB connection handling;
- Mongoose models for User, Ticket, and Comment;
- repeatable seed data;
- seeded users API;
- ticket CRUD APIs;
- comments API;
- keyword search;
- status filtering;
- ticket status-transition enforcement;
- local MongoDB setup updates.

AI-generated or AI-suggested code was reviewed before use. Particular attention was given to:

- schema fields and references;
- enum values;
- required and optional fields;
- default ticket status;
- separation of API validation and business rules;
- prevention of duplicate seed records;
- clear error responses;
- preservation of the agreed API structure.

### 5. Validation of AI Output

AI output was validated through a combination of:

- manual code inspection;
- comparison with requirements and acceptance criteria;
- Postman API checks;
- repeated seed runs;
- backend startup checks;
- MongoDB Compass inspection;
- restart and persistence checks;
- review of generated documentation;
- commit-by-commit implementation review.

AI suggestions were not treated as correct by default.

Examples of validation included:

- confirming seeded users were returned correctly;
- checking ticket creation, list, detail, and update APIs;
- testing valid and invalid comment requests;
- confirming case-insensitive partial keyword search;
- confirming exact status filtering;
- testing allowed status transitions;
- confirming invalid transitions were rejected;
- verifying local MongoDB connectivity;
- confirming data remained available after restart;
- checking that seed scripts could run repeatedly.

### 6. Testing Support

AI was used to:

- identify the mandatory integration-test requirement;
- prepare test cases for valid and invalid status transitions;
- identify backend validation scenarios;
- define expected API responses;
- document manual Postman validation;
- plan the root `tests/` structure;
- prepare testing documentation and result-reporting structure.

The mandatory state-machine integration tests and focused ticket/comment validation integration tests were implemented with Jest and Supertest; the final run completed with 44/44 tests passing.

### 7. Debugging Support

AI supported investigation and documentation of issues including:

- MongoDB authentication failure caused by an outdated local password;
- alignment from Atlas-focused setup to local MongoDB Community Edition;
- backend folder-structure inconsistency;
- API documentation and Cursor-rule conflicts;
- deprecated Mongoose update options;
- seed-script repeatability;
- clarification of search and filtering behaviour.

For each issue, the suggested cause or fix was manually checked before the documentation was updated.

### 8. Code Review Support

AI was used to review completed implementation phases for:

- architecture consistency;
- model correctness;
- validation placement;
- service-layer business rules;
- database configuration;
- seed reliability;
- API behaviour;
- search and filtering;
- ticket status transitions;
- documentation consistency;
- remaining test and frontend gaps.

Review findings were recorded in:

- `code-review-notes.md`
- `review-fixes.md`

The review process included both accepted suggestions and rejected or deferred suggestions.

### 9. Documentation Support

AI helped create and refine lifecycle documents covering:

- requirements;
- acceptance criteria;
- implementation planning;
- system design;
- database design;
- API contracts;
- UI flow;
- testing strategy;
- test results;
- debugging notes;
- code review;
- review fixes;
- PR description;
- reflection;
- workflow;
- setup instructions;
- prompt history.

The documents were updated progressively so they reflected the actual implementation rather than only the original plan.

## Important AI Suggestions That Were Changed or Rejected

### Authentication

AI suggestions to add login, JWT authentication, protected routes, or role-based authorization were not included in the Core implementation.

**Reason:** Authentication is optional and belongs to Stretch scope.

### Full User Management

Suggestions to build user CRUD or role-management screens were rejected.

**Reason:** Users are seeded only in the mandatory Core scope.

### Extra Filters, Sorting, and Pagination

Suggestions to add priority filters, assignee filters, sorting, and pagination were deferred.

**Reason:** Keyword search and status filtering satisfy the Core requirement.

### Moving Runtime Models into the Root Database Folder

A possible restructuring suggestion to move Mongoose models into `database/` was rejected.

**Reason:** Runtime application models belong under `server/src/models/`. The root `database/` folder is for initialization, schema or migration evidence, seed data, and local setup notes.

### Implementing Features Too Early

Some AI-assisted planning risked introducing later tasks before the intended workflow step.

**Correction:** Later prompts and Cursor rules were tightened to ask for only the requested task and avoid unrelated implementation.

### Conflicting API Conventions

AI-generated documentation contained inconsistent response-format guidance.

**Correction:** The API contract and Cursor rules were reviewed and aligned before continuing implementation.

## Responsible AI Use

The following information was intentionally not shared unnecessarily with AI tools or committed to the repository:

- real database passwords;
- secret connection strings;
- private credentials;
- access tokens;
- organization-confidential information unrelated to the exercise;
- personal user data.

Environment-specific values were kept in local environment files, while `.env.example` contains only safe placeholders.

## Reusable Workflow Created

The following reusable workflow practices were established:

1. Define project context before implementation.
2. Convert requirements into acceptance criteria and tasks.
3. Keep persistent Cursor rules and specifications.
4. Ask AI for one scoped task at a time.
5. Review suggestions before applying them.
6. Validate APIs manually or automatically.
7. Record AI mistakes, corrections, and rejected suggestions.
8. Update lifecycle documents after implementation changes.
9. Keep prompt history grouped by development activity.
10. Trace requirements through design, code, tests, and review.

This workflow can be reused in future projects by replacing the project-specific context while keeping the same structure for planning, validation, debugging, review, and documentation.

## Evidence in the Repository

AI usage is visible through:

- `tool-workflow.md`
- `ai-prompts/`
- `prompt-history/`
- `tool-specific/cursor-workflow/`
- `requirements-analysis.md`
- `acceptance-criteria.md`
- `implementation-plan.md`
- `design-notes.md`
- `debugging-notes.md`
- `code-review-notes.md`
- `review-fixes.md`
- `test-results.md`
- `reflection.md`
- `pr-description.md`
- Git commit history

## Commit-History Evidence

The commit history provides concrete evidence of how AI was used and reviewed across the lifecycle:

- Planning was committed before feature implementation, including project context, requirements, acceptance criteria, system design, database design, API design, and Cursor rules.
- AI-generated inconsistencies were reviewed and corrected in dedicated commits such as `docs: validated AI suggestions and updated task plan`, `docs: align API specification with validated Cursor rules`, and `docs: resolved API specification and Cursor rule conflicts`.
- Backend work was delivered incrementally through separate database, model, seed, users API, ticket CRUD, comments, search/filter, transition, and validation commits.
- Testing was added after the test strategy and Cursor testing rule were refined, with separate commits for status-transition tests and ticket/comment validation tests.
- Frontend work was split into acting-user selection, ticket list/detail, create, update, status, comments, search/filter, and later usability/error-state refinements.
- Prompt history was automated early, then manually backfilled and curated at the end to preserve complete evidence.

This progression shows that AI was used as part of an iterative engineering workflow rather than as a single code-generation step.

## Final Assessment of AI Contribution

AI was most useful for:

- turning the project brief into structured engineering artifacts;
- maintaining consistency across requirements, design, implementation, and documentation;
- accelerating backend implementation;
- identifying validation and lifecycle edge cases;
- supporting debugging and review;
- making the development process traceable.

Human judgment remained necessary for:

- deciding what belonged in Core versus Stretch;
- resolving conflicting suggestions;
- validating code behaviour;
- protecting sensitive information;
- reviewing architecture decisions;
- rejecting unnecessary complexity;
- confirming that the final implementation matched the actual requirements.

## Final Completion

The mandatory Core implementation, automated integration tests, frontend review, acceptance-criteria review, README setup guidance, test-result documentation, reflection, and repository consistency review are complete. Any later maintenance changes should follow the same scoped prompting, review, and validation workflow.
