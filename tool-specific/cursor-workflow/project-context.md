# Project Context

Persistent background for AI-assisted development of the Support Ticket Management System. This document describes what the system should do — not how it will be built.

## Project Overview

The Support Ticket Management System is an internal web application that helps teams record, track, and resolve support requests. Users can create tickets, monitor progress through defined statuses, add comments, and find tickets using search or status filtering.

The **Core scope** is a functional internal ticket lifecycle tool: create, view, update, comment on, search, filter, and progress tickets through enforced status transitions.

Potential future enhancements such as authentication, role-based access, notifications, attachments, reporting, pagination, and API documentation are outside Core scope.

## Business Objective

Provide one reliable place for internal teams to log support issues, track resolution progress, and maintain clear communication history.

## Target Users

Internal staff who need to:

- Submit support requests
- Work on tickets by updating fields, status, assignee, and comments
- Find existing tickets and review progress

Users are pre-seeded for Core. There is no login, registration, or user-management UI.

## Core Entities

### User

Seeded internal user with:

- id
- name
- email
- role

### Ticket

Support request with:

- id
- title
- description
- priority — `Low`, `Medium`, or `High`
- status — `Open`, `In Progress`, `Resolved`, `Closed`, or `Cancelled`
- assignedTo — optional seeded User reference
- createdBy — seeded User reference
- createdAt
- updatedAt

### Comment

Ticket message with:

- id
- ticketId — Ticket reference
- message
- createdBy — seeded User reference
- createdAt

## Ticket Lifecycle

The backend enforces these transitions:

- Open → In Progress
- Open → Cancelled
- In Progress → Resolved
- In Progress → Cancelled
- Resolved → Closed

All other transitions are rejected. The frontend shows a meaningful error for rejected transitions.

## Core Features

- Create tickets with an acting user and optional assignee
- List persisted tickets
- View ticket details and comments
- Update title, description, priority, and assignee
- Change status only through valid transitions
- Add comments and display them oldest first
- Search ticket title and description
- Filter tickets by status
- Show meaningful UI loading, empty, validation, and error states

## Technology Stack

| Technology | Role |
|---|---|
| React | Frontend UI |
| JavaScript | Client and server language |
| Tailwind CSS | Frontend styling |
| Node.js | Server runtime |
| Express | Backend API |
| MongoDB Community Edition | Local development database |
| Mongoose | MongoDB modelling and persistence |

A dedicated local MongoDB test database is used for integration tests and remains separate from development data.

## Engineering Principles

- Prefer clear, maintainable solutions
- Validate requests and business rules before persistence
- Keep controllers thin and business rules in services
- Show user-readable errors without exposing internal details
- Complete Core before considering Stretch work
- Maintain prompt history and lifecycle documentation
- Use environment variables for configuration and commit no secrets
- Access MongoDB only through the Express API; the React client never connects directly

## Constraints and Assumptions

- Internal, single-team usage
- Seeded users only; no authentication
- Acting-user selection is required for ticket and comment creation only
- Ticket updates do not record who performed the update
- Assignee is optional and, when provided, must be Bob Smith or Carol Davis
- Search and status filtering work independently in Core
- Ticket and comment editing/deletion rules follow the specification
- Data volume is moderate and does not require pagination or advanced optimization

## Out of Scope

- Authentication, registration, and user management
- Ticket or comment deletion
- Comment editing
- Combined search and status filtering
- Priority or assignee filters, sorting, and pagination
- Notifications, attachments, reporting, and dashboards
- Multi-tenant support
- Real-time collaboration
- Docker, CI, and deployment work

## Success Criteria

Core is successful when a user can:

1. Create a valid ticket through the UI
2. View persisted tickets and ticket details
3. Update ticket fields and assignee
4. Add and view comments
5. Search by keyword or filter by status independently
6. Perform only valid status transitions
7. Receive meaningful validation and failure messages
8. Restart the application and database without losing persisted data

Additionally:

- Backend validation rejects invalid ticket and comment records
- Integration tests cover valid and representative invalid status transitions
- Integration tests cover ticket and comment validation
- Local MongoDB setup and seed instructions are documented
- Seed data includes Alice Johnson, Bob Smith, Carol Davis, sample tickets, and comments
- No secrets are committed

## Confirmed Core Decisions

- Alice Johnson — Requester
- Bob Smith — Support Agent
- Carol Davis — Support Agent
- No acting user is selected by default
- Acting user becomes `createdBy` for new tickets and comments
- Acting user is not required for ticket updates
- Bob or Carol may be selected as assignee
- Comments are displayed oldest first and cannot be edited or deleted
- Ticket deletion is not included
- Search covers title and description only
- Search and status filter are not combined in Core
