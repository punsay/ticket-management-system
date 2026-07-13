# Specification

Behavioural specification for the Core scope of the Support Ticket Management System. Describes what the system must do — not how it will be built. Derived from `tool-specific/cursor-workflow/project-context.md`, `docs/requirement-analysis.md`, and `tool-specific/cursor-workflow/acceptance-criteria.md`.

## Overview

The Core system is an internal web application for logging, tracking, and resolving support tickets. Users work with pre-seeded identities (no login), create and update tickets, add comments, search and filter the ticket list, and move tickets through a controlled status lifecycle.

**Entities:** User, Ticket, Comment. Status is a field on Ticket.

**Seeded users:**

| Name | Role |
|------|------|
| Alice Johnson | Requester |
| Bob Smith | Support Agent |
| Carol Davis | Support Agent |

## Main User Flows

### Flow 1 — Create a ticket

1. User opens the application and selects an acting user from the dropdown (no default selection).
2. User enters title, description, and priority (`Low`, `Medium`, or `High`).
3. User optionally selects an assignee (Bob Smith or Carol Davis).
4. User submits the ticket.
5. System creates the ticket with status `Open`, `createdBy` set to the acting user, and shows it in the ticket list.

### Flow 2 — View and work a ticket

1. User opens the ticket list and selects a ticket.
2. System shows full ticket detail including comments (oldest first).
3. User may update title, description, priority, assignee, or status without selecting an acting user. Core does not track who performs updates.
4. User may add a comment after selecting an acting user.

### Flow 3 — Find tickets

1. User applies keyword search **or** status filter on the ticket list (each works independently).
2. System shows matching tickets or an empty state when nothing matches.

### Flow 4 — Progress a ticket through its lifecycle

1. User opens a ticket and changes its status.
2. System allows only valid transitions; invalid attempts are rejected with a clear error.

## Acting User Selection

- A dropdown lists the three seeded users; no user is pre-selected on load.
- Selection is **required** before creating a ticket or adding a comment.
- Selection is **not required** for viewing, searching, filtering, or updating tickets. Core does not track who performs ticket updates.
- The selected user becomes `createdBy` on new tickets and comments.
- The backend validates that `createdBy` references an existing seeded user. No authentication is used.

## Ticket Creation, Viewing, and Updates

### Creation

- Required fields: title, description, priority.
- Optional field: assignee (`assignedTo`) — Bob Smith or Carol Davis only.
- New tickets always start with status `Open`.
- `createdBy` is the acting user; `createdBy` and assignee may differ (e.g. Alice creates, Bob is assigned).
- When assignee is provided, it must be Bob Smith or Carol Davis.

### Viewing

- The ticket list shows all persisted tickets.
- The detail view shows title, description, priority, status, assignee, creator, and timestamps.
- Tickets and comments cannot be deleted.

### Updates

- Users may update title, description, priority, and assignee on existing tickets. No acting user is required because Core does not record who made the update.
- Users may assign or reassign a ticket to Bob Smith or Carol Davis.
- When assignee is provided on update, it must be Bob Smith or Carol Davis.
- Status changes follow the transition rules in the next section.

## Comments

- Users add comments on the ticket detail view after selecting an acting user.
- Each comment has a non-empty message and `createdBy` set to the acting user.
- Comments are displayed oldest first.
- Comments cannot be edited or deleted after creation.
- Comment text is not included in keyword search.

## Search and Status Filtering

### Keyword search

- Searches ticket title and description only.
- Uses case-insensitive partial matching.
- Returns only tickets whose title or description contains the keyword.
- Shows an empty state (not an error) when no tickets match.

### Status filtering

- Filters the ticket list by a single status value (`Open`, `In Progress`, `Resolved`, `Closed`, or `Cancelled`).
- Shows only tickets with an exact status match.
- Shows an empty state when no tickets match.

### Independence

- Keyword search and status filtering each work on their own.
- Combined search-and-filter is outside Core scope.

## Ticket Status Transitions

### Allowed values

`Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`

### Valid transitions

| From | To |
|------|-----|
| Open | In Progress |
| Open | Cancelled |
| In Progress | Resolved |
| In Progress | Cancelled |
| Resolved | Closed |

### Rejected transitions

All transitions not listed above must be rejected by the backend. Examples:

- `Open` → `Resolved` or `Closed`
- `Resolved` → `Open` or `In Progress`
- `Closed` → any status
- `Cancelled` → any status

The UI must show a meaningful error when a rejected transition is attempted.

## Validation and Error Behaviour

The backend validates every ticket and comment create/update before persisting. Invalid requests are rejected; the UI shows a short, user-readable error message.

| Check | Behaviour |
|-------|-----------|
| Empty title or description | Reject |
| Invalid priority | Reject |
| Invalid status value | Reject |
| Invalid status transition | Reject |
| `assignedTo` provided but not Bob Smith or Carol Davis | Reject |
| Missing or invalid `createdBy` on ticket/comment create | Reject |
| Empty comment message | Reject |
| Comment on non-existent ticket | Reject |

Error messages must not expose stack traces or sensitive configuration. When the backend is unavailable, show a generic failure message. Client-side checks are optional; the backend is authoritative.

## Data Persistence

- Tickets and comments are stored in MongoDB.
- Persisted data remains available after normal application restarts and MongoDB restarts.
- No secrets or credentials are committed to the repository; sensitive values use environment variables.

## Seed Data

On a fresh setup, seed data must provide:

**Users (3):**

- Alice Johnson — Requester
- Bob Smith — Support Agent
- Carol Davis — Support Agent

**Sample tickets** covering:

- Different priorities (`Low`, `Medium`, `High`)
- Different statuses
- Different assignees
- At least one ticket with comments

The repository must include instructions for local database setup and seeding so a new developer can run the full workflow.

## Testing Expectations

### Integration tests — status state machine

- All five valid transitions must pass.
- Representative invalid transitions must be rejected (e.g. `Open` → `Resolved`, `Closed` → `In Progress`).

### Manual verification

Core behaviour should be verifiable against acceptance criteria AC-01 through AC-48 in `tool-specific/cursor-workflow/acceptance-criteria.md`.

### Repository checks

- No committed secrets (AC-47).
- No ticket or comment delete functionality in the UI (AC-48).

## Out of Scope

The following are not part of this specification:

- Authentication, registration, and user management
- Ticket or comment deletion
- Comment editing
- Combined search-and-filter
- Filters other than status (assignee, priority, date)
- Search across comments
- Role-based permissions
- Pagination, notifications, attachments, reporting, and other optional enhancements

## References

| Document | Purpose |
|----------|---------|
| `tool-specific/cursor-workflow/project-context.md` | Long-term project background and confirmed decisions |
| `docs/requirement-analysis.md` | FR, BR, VR, and NFR IDs |
| `tool-specific/cursor-workflow/acceptance-criteria.md` | Testable AC-01 through AC-48 |
| `tool-specific/cursor-workflow/spec.md` | Core behavioural specification (this document) |
