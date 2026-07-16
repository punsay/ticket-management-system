# Acceptance Criteria

Defines testable conditions that must be met for the Core scope to be considered complete and ready for review. Derived from `tool-specific/cursor-workflow/project-context.md` and `requirements-analysis.md`.

## Overview

Each criterion uses an **AC** ID and links to related **FR**, **BR**, **VR**, and **NFR** IDs from the requirement analysis. Criteria describe observable behaviour only — not implementation details.

## Feature Criteria

### Acting user selection

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-01** | **Given** the application has loaded, **when** the user views the acting-user control, **then** no seeded user is pre-selected. | FR-11, COD-01 |
| **AC-02** | **Given** the application has loaded, **when** the user opens the acting-user dropdown, **then** the three seeded users (Alice Johnson, Bob Smith, Carol Davis) are available for selection. | FR-10, FR-11, NFR-06 |
| **AC-03** | **Given** no acting user is selected, **when** the user attempts to create a ticket or comment, **then** the action is blocked and a meaningful validation error is shown. | FR-12, VR-11, NFR-02 |
| **AC-04** | **Given** no acting user is selected, **when** the user updates an existing ticket (title, description, priority, assignee, or status), **then** the update is not blocked by acting-user selection. | FR-12, COD-09 |

### Ticket creation

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-05** | **Given** an acting user is selected, **when** the user submits a ticket with a valid title, description, and priority (`Low`, `Medium`, or `High`) and no assignee, **then** the ticket is created with status `Open` and appears in the ticket list without an assignee. | FR-01, BR-01, BR-02, BR-06, COD-06 |
| **AC-06** | **Given** an acting user is selected, **when** the user submits a ticket with a valid title, description, priority, and assignee, **then** the ticket is created with status `Open` and appears in the ticket list. | FR-01, BR-01, BR-02, BR-06 |
| **AC-07** | **Given** an acting user is selected, **when** a ticket is created, **then** `createdBy` is the selected acting user. | BR-07 |
| **AC-08** | **Given** Alice Johnson is the acting user, **when** she creates a ticket assigned to Bob Smith, **then** the ticket is created successfully with `createdBy` as Alice and `assignedTo` as Bob. | BR-08, BR-09, COD-04 |
| **AC-09** | **Given** an acting user is selected, **when** the user submits a ticket with an empty title or empty description, **then** the backend rejects the request and the UI shows a meaningful validation error. | VR-02, VR-03, NFR-02 |
| **AC-10** | **Given** an acting user is selected, **when** the user submits a ticket with an invalid priority value, **then** the backend rejects the request. | VR-04 |
| **AC-11** | **Given** an acting user is selected, **when** the user submits a ticket with a provided `assignedTo` that is not Bob Smith or Carol Davis, **then** the backend rejects the request. | VR-06, BR-06 |

### Ticket listing and details

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-12** | **Given** persisted tickets exist, **when** the user views the ticket list, **then** all tickets are displayed. | FR-02 |
| **AC-13** | **Given** a ticket exists, **when** the user selects it, **then** the detail view shows title, description, priority, status, assignee, creator, and timestamps. | FR-03 |

### Ticket updates and assignment

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-14** | **Given** an existing ticket, **when** the user updates the title, description, or priority with valid values, **then** the changes are persisted and visible on reload. | FR-04, BR-02 |
| **AC-15** | **Given** an existing ticket, **when** the user assigns or reassigns it to a seeded support agent (Bob Smith or Carol Davis), **then** the assignment is saved and displayed. | BR-09, FR-04, COD-07 |
| **AC-16** | **Given** an existing ticket, **when** the user submits an update with an empty title or empty description, **then** the backend rejects the request and the UI shows a meaningful validation error. | VR-02, VR-03, NFR-02 |
| **AC-17** | **Given** an existing ticket, **when** the user submits an update with a provided `assignedTo` that is not Bob Smith or Carol Davis, **then** the backend rejects the request. | VR-06, BR-06 |

### Comments

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-18** | **Given** an acting user is selected and a ticket exists, **when** the user submits a non-empty comment, **then** the comment is saved with `createdBy` as the acting user. | FR-06, BR-07 |
| **AC-19** | **Given** a ticket has multiple comments, **when** the user views the ticket detail, **then** comments are displayed oldest first. | FR-07, COD-03 |
| **AC-20** | **Given** an acting user is selected, **when** the user submits an empty comment, **then** the backend rejects the request and the UI shows a meaningful validation error. | VR-09, NFR-02 |
| **AC-21** | **Given** a ticket exists, **when** the user views its comments, **then** no edit or delete controls are available for existing comments. | BR-11 |

### Keyword search

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-22** | **Given** tickets exist with known title or description text, **when** the user enters a keyword that partially matches (case-insensitive), **then** only matching tickets are shown. | FR-08, BR-12, COD-02 |
| **AC-23** | **Given** a ticket has comments containing searchable text not present in its title or description, **when** the user searches for that text, **then** the ticket is not returned. | BR-12 |
| **AC-24** | **Given** a search returns no matches, **when** results are displayed, **then** an empty state is shown (not an error). | Error Scenarios |

### Status filtering

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-25** | **Given** tickets exist with different statuses, **when** the user filters by a specific status, **then** only tickets with that exact status are shown. | FR-09, BR-13 |
| **AC-26** | **Given** a status filter returns no matches, **when** results are displayed, **then** an empty state is shown (not an error). | Error Scenarios |
| **AC-27** | **Given** tickets exist, **when** the user applies keyword search and status filtering separately (not combined), **then** each control works independently on the ticket list. | BR-14, COD-08 |

### Valid status transitions

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-28** | **Given** a ticket with status `Open`, **when** the status is changed to `In Progress`, **then** the transition succeeds and is persisted. | FR-05, BR-04 |
| **AC-29** | **Given** a ticket with status `Open`, **when** the status is changed to `Cancelled`, **then** the transition succeeds and is persisted. | FR-05, BR-04 |
| **AC-30** | **Given** a ticket with status `In Progress`, **when** the status is changed to `Resolved`, **then** the transition succeeds and is persisted. | FR-05, BR-04 |
| **AC-31** | **Given** a ticket with status `In Progress`, **when** the status is changed to `Cancelled`, **then** the transition succeeds and is persisted. | FR-05, BR-04 |
| **AC-32** | **Given** a ticket with status `Resolved`, **when** the status is changed to `Closed`, **then** the transition succeeds and is persisted. | FR-05, BR-04 |

### Invalid status transitions

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-33** | **Given** a ticket with status `Open`, **when** a direct transition to `Resolved`, `Closed`, or back to `Open` is attempted, **then** the backend rejects the request. | BR-05, VR-08 |
| **AC-34** | **Given** a ticket with status `Closed` or `Cancelled`, **when** any status change is attempted, **then** the backend rejects the request. | BR-05, VR-08 |
| **AC-35** | **Given** an invalid status transition is attempted through the UI, **when** the backend rejects it, **then** the UI displays a meaningful, user-readable error without internal stack traces. | NFR-02, NFR-03 |

### Backend validation

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-36** | **Given** any ticket or comment create or update request, **when** the request violates a validation rule or business rule, **then** the backend rejects it before persisting invalid data. | VR-01, VR-08 |
| **AC-37** | **Given** a ticket or comment create request with a `createdBy` that is not an existing seeded user, **when** the backend processes the request, **then** the request is rejected without requiring authentication. | VR-07, COD-10 |
| **AC-38** | **Given** a comment is submitted for a non-existent ticket, **when** the backend processes the request, **then** the request is rejected. | VR-10 |

### Meaningful UI errors

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-39** | **Given** a validation or business-rule failure (invalid input, invalid transition, missing acting user), **when** the error is shown in the UI, **then** the message is understandable to a user and does not expose stack traces or sensitive configuration. | NFR-02, NFR-03 |
| **AC-40** | **Given** the backend is unavailable or a persistence failure occurs, **when** the UI handles the failure, **then** a generic user-readable message is shown without internal details. | Error Scenarios, NFR-03 |

### Data persistence

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-41** | **Given** tickets and comments have been created, **when** the application and database are restarted, **then** all previously saved tickets and comments are still available. | FR-13, NFR-01 |

### Seed data

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-42** | **Given** a fresh database is seeded, **when** seeding completes, **then** three users exist: Alice Johnson (Requester), Bob Smith (Support Agent), and Carol Davis (Support Agent). | NFR-06 |
| **AC-43** | **Given** a fresh database is seeded, **when** seeding completes, **then** sample tickets exist covering different priorities, statuses, and assignees, and at least one ticket has comments. | NFR-06, COD-05 |
| **AC-44** | **Given** a new developer clones the repository, **when** they follow the documented setup and seed instructions, **then** they can load seeded users and sample tickets locally. | NFR-07 |

### State-machine integration tests

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-45** | **Given** the test suite runs, **when** integration tests for status transitions execute, **then** all five valid transitions defined in BR-04 pass. | NFR-04, BR-04 |
| **AC-46** | **Given** the test suite runs, **when** integration tests for invalid transitions execute, **then** representative invalid transitions (e.g. `Open` → `Resolved`, `Closed` → `In Progress`) are rejected by the backend. | NFR-05, BR-05 |

### Repository hygiene

| ID | Criterion | Related |
|----|-----------|---------|
| **AC-47** | **Given** the repository is reviewed, **when** tracked files are inspected, **then** no secrets, credentials, or API keys are committed; sensitive values use environment variables via `.env.example` placeholders. | NFR-08 |
| **AC-48** | **Given** the Core application UI, **when** a user looks for ticket or comment deletion, **then** no delete functionality is available. | BR-10, BR-11 |

## Definition of Done

Core scope is done when:

- All criteria **AC-01** through **AC-48** pass manual or automated verification
- Integration tests for the ticket status state machine pass (AC-45, AC-46)
- Seed data and setup instructions allow a fresh local environment to run the full workflow (AC-42, AC-43, AC-44)
- No open conflicts remain between project context, requirements, and acceptance criteria

## Verification Steps

1. **Seed and setup** — Run documented setup; confirm AC-42, AC-43, AC-44
2. **Acting user** — Load app; confirm AC-01, AC-02, AC-03, AC-04
3. **Ticket CRUD** — Create, list, view, update tickets; confirm AC-05 through AC-17
4. **Comments** — Add and view comments; confirm AC-18 through AC-21
5. **Search and filter** — Test keyword search and status filter separately; confirm AC-22 through AC-27
6. **Status machine** — Exercise all valid transitions (AC-28–AC-32) and invalid ones (AC-33–AC-35)
7. **Persistence** — Restart app and database; confirm AC-41
8. **Backend validation** — Send invalid requests; confirm AC-36, AC-37, AC-38, AC-39, AC-40
9. **Automated tests** — Run integration test suite; confirm AC-45, AC-46
10. **Repository review** — Inspect for secrets and out-of-scope delete UI; confirm AC-47, AC-48
