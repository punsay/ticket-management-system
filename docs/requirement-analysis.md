# Requirement Analysis

Documents the functional and non-functional requirements for the Support Ticket Management System (Core scope). Captures what the system must do before design and implementation begin.

## Overview

This analysis defines requirements for the Core release of an internal Support Ticket Management System. It is derived from `tool-specific/cursor-workflow/project-context.md` and records confirmed decisions where available.

## Problem Statement

Internal support requests are currently difficult to track consistently. Issues may be reported informally, progress is unclear, and discussion history is fragmented. Teams need a single place to log requests, assign ownership, track status through a defined lifecycle, collaborate via comments, and find existing tickets without duplication.

## Business Goals

- Provide one reliable system for logging and tracking internal support tickets
- Reduce lost requests and unclear ownership through assignee and status tracking
- Maintain a visible history of ticket updates and comments
- Enforce a consistent ticket lifecycle so status reflects real progress
- Support quick discovery of tickets through keyword search and status filtering

## Stakeholders

### Target Users

Internal staff operating in a trusted environment:

| User type | Need |
|-----------|------|
| **Requester** | Submit support requests and follow progress on their tickets |
| **Support Agent** | Work assigned tickets, update status, priority, assignee, and add comments |
| **Any internal user** | Search and filter tickets to check for duplicates or existing work |

For Core, all users are pre-seeded. There is no login, registration, or user-management interface. The UI provides a dropdown to select the acting seeded user.

### Confirmed seed users

| Name | Role |
|------|------|
| Alice Johnson | Requester |
| Bob Smith | Support Agent |
| Carol Davis | Support Agent |

The selected user is recorded as `createdBy` when creating tickets and comments.

## Functional Requirements

| ID | Requirement |
|----|-------------|
| **FR-01** | The system shall allow a user to create a ticket with title, description, priority, and an optional assignee. |
| **FR-02** | The system shall list all persisted tickets. |
| **FR-03** | The system shall display full detail for a single selected ticket. |
| **FR-04** | The system shall allow a user to update a ticket's title, description, priority, and assignee. |
| **FR-05** | The system shall allow a user to change a ticket's status only through valid lifecycle transitions. |
| **FR-06** | The system shall allow a user to add a comment to a ticket. |
| **FR-07** | The system shall display all comments for a ticket oldest first. |
| **FR-08** | The system shall allow case-insensitive partial keyword search across ticket title and description, independently of status filtering. |
| **FR-09** | The system shall allow filtering the ticket list by status, independently of keyword search. |
| **FR-10** | The system shall use pre-seeded users only; assignee and creator references must point to seeded users. |
| **FR-11** | The system shall provide a dropdown to select the acting seeded user without authentication; no user shall be pre-selected by default. |
| **FR-12** | The system shall require an acting user selection before creating a ticket or comment; acting-user selection is not required for ticket updates. |
| **FR-13** | The system shall persist tickets and comments so data remains available after application restart. |

## Business Rules

| ID | Rule |
|----|------|
| **BR-01** | New tickets shall be created with status `Open`. |
| **BR-02** | Ticket priority shall be one of: `Low`, `Medium`, `High`. |
| **BR-03** | Ticket status shall be one of: `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`. |
| **BR-04** | The only valid status transitions are: `Open` → `In Progress`; `Open` → `Cancelled`; `In Progress` → `Resolved`; `In Progress` → `Cancelled`; `Resolved` → `Closed`. |
| **BR-05** | All status transitions not listed in BR-04 shall be rejected. |
| **BR-06** | When provided, `assignedTo` shall reference a seeded support agent (Bob Smith or Carol Davis); assignee is optional on ticket creation. |
| **BR-07** | `createdBy` on a new ticket or comment shall be the currently selected acting user and must reference an existing seeded user. |
| **BR-08** | Any seeded user may create a ticket; `createdBy` and `assignedTo` may differ. |
| **BR-09** | A ticket may be assigned or reassigned to any seeded support agent through ticket updates. |
| **BR-10** | Tickets shall not be deletable in Core scope. |
| **BR-11** | Comments shall not be editable or deletable after creation in Core scope. |
| **BR-12** | Keyword search shall use case-insensitive partial matching on ticket title and description only; comments are not searchable in Core scope. |
| **BR-13** | Status filtering shall match tickets with the selected status value exactly. |
| **BR-14** | Keyword search and status filtering shall operate independently; combined search-and-filter is outside Core scope. |

## Validation Requirements

| ID | Requirement |
|----|-------------|
| **VR-01** | The backend shall validate all ticket create and update requests before persisting data. |
| **VR-02** | The backend shall require a non-empty ticket title. |
| **VR-03** | The backend shall require a non-empty ticket description. |
| **VR-04** | The backend shall reject priority values outside `Low`, `Medium`, `High`. |
| **VR-05** | The backend shall reject status values outside the allowed set defined in BR-03. |
| **VR-06** | The backend shall reject `assignedTo` values that are provided but do not reference Bob Smith or Carol Davis. |
| **VR-07** | The backend shall reject `createdBy` values that do not reference an existing seeded user; this validates identity without authentication. |
| **VR-08** | The backend shall reject status transition requests that violate BR-04 and BR-05. |
| **VR-09** | The backend shall require a non-empty comment message. |
| **VR-10** | The backend shall reject comment requests for tickets that do not exist. |
| **VR-11** | The backend shall reject ticket or comment create requests when no acting user is selected. |
| **VR-12** | The UI shall provide client-side checks where practical, but backend validation is authoritative. |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| **NFR-01** | Ticket and comment data shall persist across application restarts using a database. |
| **NFR-02** | The UI shall display meaningful, user-readable error messages when validation or business rules fail. |
| **NFR-03** | Error messages shall not expose internal stack traces or sensitive configuration. |
| **NFR-04** | Integration tests shall cover all valid status transitions defined in BR-04. |
| **NFR-05** | Integration tests shall cover representative invalid status transitions and confirm rejection. |
| **NFR-06** | Seed data shall provide the three confirmed users and a small set of sample tickets covering different priorities, statuses, assignees, and at least one ticket with comments. |
| **NFR-07** | The repository shall include instructions for local database setup and seeding. |
| **NFR-08** | No secrets or credentials shall be committed to the repository. |
| **NFR-09** | AI-assisted development activity shall remain traceable through project documentation and prompt history. |
| **NFR-10** | The system shall perform adequately for moderate internal ticket volume without specialized optimization. |

## Error Scenarios

The system shall handle the following error conditions with clear user-facing feedback:

| Scenario | Expected behaviour |
|----------|-------------------|
| Acting user not selected before create ticket or comment | Reject; show validation error |
| Ticket update without acting user selected | Allow; acting user not required for updates |
| Missing or empty ticket title on create/update | Reject; show validation error |
| Missing or empty ticket description on create/update | Reject; show validation error |
| Invalid priority value | Reject; show validation error |
| Invalid status value | Reject; show validation error |
| Invalid status transition (e.g. `Open` → `Resolved`) | Reject; show business rule error |
| Invalid status transition (e.g. `Closed` → `In Progress`) | Reject; show business rule error |
| `assignedTo` references a non-existent user | Reject; show validation error |
| `createdBy` references a non-existent user | Reject; show validation error |
| Empty comment message | Reject; show validation error |
| Comment on non-existent ticket | Reject; show not-found or validation error |
| Backend unavailable or persistence failure | Show generic failure message; do not expose internal details |
| Search or filter returns no matches | Show empty state; not an error |

## Constraints and Assumptions

### Constraints

- Core scope only; no Stretch or future enhancements in this document
- Internal users in a single-organization, trusted environment
- MERN-family stack: React, JavaScript, Tailwind CSS, Node.js, Express, MongoDB
- No authentication, registration, or user-management UI
- No ticket or comment deletion in Core scope

### Assumptions

- Users must explicitly select the acting seeded user from a dropdown before creating tickets or comments; no default is pre-selected
- Acting-user selection is not required for ticket updates
- Assignee is optional on ticket creation; when provided, it must reference a seeded support agent (Bob Smith or Carol Davis).
- Any seeded user may create a ticket and assign or reassign it to a seeded support agent
- Keyword search and status filtering work independently on the ticket list
- Search uses case-insensitive partial matching on title and description
- Comments are displayed oldest first
- Ticket volume is moderate and does not require advanced performance tuning
- A single team uses the system; multi-tenant isolation is not required

## Out of Scope

- User authentication, registration, and user-management interfaces
- Role-based permissions beyond seeded user labels used for demonstration
- Ticket deletion
- Comment editing and deletion
- Search across comments or fields other than title and description
- Combined keyword search and status filtering
- Filter criteria other than status (e.g. assignee, priority, date range)
- Pagination and other list optimizations
- External customer portal or public ticket submission
- Email, SMS, or push notifications
- SLA timers, escalation rules, or automated routing
- File or image attachments
- Advanced analytics, dashboards, or export reporting
- Multi-organization or multi-tenant support
- Mobile-native applications
- Real-time collaborative editing or live chat

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Status transition rules implemented only in the UI | Invalid data could be persisted | Backend enforcement required (VR-08, NFR-04, NFR-05) |
| Acting user not selected before create | Invalid or blocked create/comment actions | Require explicit selection (FR-12, VR-11); no default acting user |
| Scope creep into optional features | Delays Core delivery | Enforce Out of Scope list during specification and tasks |
| Missing or incomplete seed data | Hard to test end-to-end workflow | Seed users and varied sample tickets per NFR-06 |

## Confirmed Open Decisions

Former open decisions resolved for Core scope:

| ID | Decision | Resolution |
|----|----------|------------|
| **COD-01** | Default acting user on page load | No default acting user; the user must select one from the seeded-user dropdown |
| **COD-02** | Search matching rules | Case-insensitive partial matching across ticket title and description |
| **COD-03** | Comment display order | Oldest first |
| **COD-04** | Creator vs assignee on create | Any seeded user may create a ticket and assign it to a seeded support agent; `createdBy` and `assignedTo` may differ |
| **COD-05** | Initial seed ticket content | Seed the three confirmed users plus a small set of sample tickets covering different priorities, statuses, assignees, and at least one commented ticket |
| **COD-06** | Assignee on create | Optional; when provided, must reference Bob Smith or Carol Davis |
| **COD-07** | Assignment on update | Tickets may be assigned or reassigned later |
| **COD-08** | Search and filter interaction | Keyword search and status filtering work independently; combined use is outside Core scope |
| **COD-09** | Acting user for updates | Required only when creating tickets and comments, not when updating tickets |
| **COD-10** | `createdBy` validation | Backend validates `createdBy` as an existing seeded user; no authentication introduced |

Additional confirmed decisions from project context:

- Three seeded users: Alice Johnson (Requester), Bob Smith (Support Agent), Carol Davis (Support Agent)
- Acting user selected via UI dropdown without authentication
- Ticket deletion out of scope
- Comment editing and deletion out of scope
