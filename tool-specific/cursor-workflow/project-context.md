# Project Context

Persistent background for AI-assisted development of the Support Ticket Management System. This document describes what the system should do — not how it will be built.

## Project Overview

The Support Ticket Management System is an internal web application that helps teams record, track, and resolve support requests. Users can create tickets for issues or requests, monitor their progress through defined statuses, add comments for collaboration, and find tickets using search and filters.

The **core scope** for this project is a functional ticket lifecycle tool for internal users: create tickets, view and update them, manage status transitions, collaborate via comments, and search or filter the ticket list.

**Potential future enhancements** may include authentication, role-based access, notifications, file attachments, reporting, pagination, and API documentation. These are outside the current Core scope.

## Business Objective

Provide a single, reliable place for internal teams to log support issues, track resolution progress, and maintain a clear history of communication — reducing lost requests, duplicate effort, and unclear ownership.

## Target Users

Internal staff who need to:

- **Submit** support requests or report issues on behalf of themselves or their team
- **Work on** tickets by updating status, priority, assignee, and adding comments
- **Find** existing tickets quickly to avoid duplication and check progress

All users are internal. For Core, users are pre-seeded in the database — there is no login, registration, or user-management UI.

## Core Entities

Core scope includes three entities only. Status is a field on Ticket, not a separate entity.

### User

Seeded internal user. No user-management interface or authentication is required for Core.

Required fields:

- id
- name
- email
- role

### Ticket

Represents a support request.

Required fields:

- id
- title
- description
- priority — `Low`, `Medium`, or `High`
- status — `Open`, `In Progress`, `Resolved`, `Closed`, or `Cancelled`
- assignedTo — optional reference to a seeded User
- createdBy — reference to a seeded User
- createdAt
- updatedAt

### Comment

Represents a message added to a ticket.

Required fields:

- id
- ticketId — reference to a Ticket
- message
- createdBy — reference to a seeded User
- createdAt

## Ticket Lifecycle

Status is a controlled field on the Ticket entity. The backend must enforce these valid transitions:

- Open → In Progress
- Open → Cancelled
- In Progress → Resolved
- In Progress → Cancelled
- Resolved → Closed

All other transitions must be rejected by the backend. The frontend should display a clear error when a rejected transition is attempted.

## Core Features

- **Ticket creation** — Log a new support request with title, description, priority, creator, and an optional assignee
- **Ticket listing** — View all tickets in a browsable list
- **Ticket detail** — View full information for a single ticket
- **Ticket updates** — Edit title, description, priority, and assignee; change status only through valid transitions
- **Status transitions** — Move tickets through the allowed lifecycle states; reject all others
- **Comments** — Add and view discussion on a ticket
- **Search and filter** — Keyword search across ticket title and description, and status filtering on the ticket list; each works independently in Core scope

## Technology Stack

| Technology | Role | Why it fits |
|------------|------|-------------|
| **React** | Frontend UI | Component-based UI suited to interactive lists, forms, and detail views |
| **JavaScript** | Language (client and server) | Single language across the stack, lowering context-switching cost |
| **Tailwind CSS** | Styling | Utility-first styling for rapid, consistent internal-tool UI |
| **Node.js** | Server runtime | JavaScript on the server pairs naturally with the React frontend |
| **Express** | HTTP API layer | Lightweight, well-understood framework for REST-style APIs |
| **MongoDB** | Data store | Flexible document model fits evolving ticket and comment structures |

## High-Level Engineering Principles

- **Clarity over cleverness** — Prefer simple, readable, and maintainable solutions suitable for a small project
- **Validate at boundaries** — Validate incoming requests and enforce business rules before persisting data
- **Fail gracefully** — Surface meaningful errors to users without exposing internal details
- **Keep scope tight** — Deliver the core ticket workflow completely before considering enhancements
- **Document as you go** — Maintain design docs, prompt history, and testing records for traceability
- **No secrets in source** — Use environment variables for sensitive configuration

## Project Constraints

- Internal users only; no public or customer self-service portal in core scope
- Seeded users only; no authentication or user-management UI in core scope
- Time-boxed delivery: complete the end-to-end Core workflow before optional enhancements
- Use React, Node.js, Express, MongoDB, JavaScript, and Tailwind CSS
- AI-assisted development must remain traceable via project documentation and prompt history

## Assumptions

- Users operate within a trusted internal environment
- A single team or organization uses the system (no multi-tenant isolation required in core scope)
- Users are pre-seeded; the UI provides a simple user selector to choose the acting user without login
- Acting-user selection is required only when creating tickets and comments, not when updating tickets
- Assignee is optional on ticket creation; when provided, it must reference a seeded support agent (Bob Smith or Carol Davis).
- Ticket volume is moderate and does not require specialized performance optimization in the initial release

## Out-of-Scope Items

- User authentication, registration, and user-management interfaces
- External customer portal or public ticket submission
- Email, SMS, or push notifications
- SLA timers, escalation rules, or automated routing
- File or image attachments on tickets
- Advanced analytics, dashboards, or export reporting
- Multi-organization or multi-tenant support
- Mobile-native applications
- Real-time collaborative editing or live chat

## Success Criteria

The Core project is successful when an internal user can:

1. Create a valid ticket through the UI
2. View all persisted tickets and their comments
3. Open a ticket detail view
4. Update the title, description, priority, and assignee
5. Add and view comments
6. Search tickets by keyword (title and description) or filter by status, each independently
7. Perform only valid status transitions
8. Receive a meaningful error when an invalid transition or invalid input is submitted
9. Restart the application without losing persisted data

Additionally:

- The backend validates all ticket and comment input and rejects invalid records
- Integration tests cover the ticket status state machine, including both allowed and rejected transitions
- Seed data provides sample internal users and sample tickets for local testing
- The repository includes clear local database setup and seed instructions
- No secrets are committed to the repository

---

## Confirmed Core Decisions

- Seed three internal users:
  - Alice Johnson — Requester
  - Bob Smith — Support Agent
  - Carol Davis — Support Agent
- The UI will provide a simple dropdown to select the acting seeded user without authentication.
- Acting-user selection is required only when creating tickets and comments, not when updating tickets.
- The selected user will be used as `createdBy` when creating tickets and comments.
- Assignee is optional on ticket creation; when `assignedTo` is provided, it must reference a seeded support agent (Bob Smith or Carol Davis).
- A ticket may be assigned or reassigned later through ticket updates.
- Keyword search and status filtering work independently; combined search-and-filter is outside Core scope.
- The backend validates that `createdBy` references an existing seeded user; authentication is not required.
- Ticket deletion is outside the Core scope.
- Comment deletion and editing are outside the Core scope.