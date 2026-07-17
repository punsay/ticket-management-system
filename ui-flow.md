# UI Flow

## Overview

The Support Ticket Management System provides a small internal workflow for creating, viewing, updating, searching, filtering, commenting on, and progressing support tickets.

There is no login. Users work through one of three seeded identities selected from an acting-user dropdown.

Detailed behaviour is documented in:

- `tool-specific/cursor-workflow/spec.md`
- `tool-specific/cursor-workflow/acceptance-criteria.md`
- `system-design.md`

## Main Navigation Flow

```text
Application loads
    ↓
Ticket list is displayed
    ↓
User may:
    ├── select an acting user
    ├── create a ticket
    ├── search tickets
    ├── filter tickets by status
    └── open a ticket detail view
```

## Acting User Flow

```text
Application loads
    ↓
No acting user is selected
    ↓
User opens acting-user dropdown
    ↓
User selects Alice, Bob, or Carol
```

Rules:

- No user is selected by default.
- Selection is required before creating a ticket.
- Selection is required before adding a comment.
- Selection is not required for viewing, searching, filtering, or updating tickets.
- The selected user becomes `createdBy` for new tickets and comments.

When no acting user is selected and the user tries to create a ticket or comment, the UI blocks the action and shows a meaningful validation message.

## Ticket List Flow

```text
User opens application
    ↓
Frontend requests all tickets
    ↓
Ticket list is displayed
    ↓
User selects a ticket
    ↓
Ticket detail view opens
```

The ticket list should show persisted tickets from MongoDB.

Each ticket summary should make it easy to identify:

- title
- priority
- status
- assignee

Possible list states:

- loading state while tickets are fetched
- populated list when tickets exist
- empty state when no tickets exist
- error state when the backend is unavailable

## Create Ticket Flow

```text
User selects an acting user
    ↓
User opens create-ticket form
    ↓
User enters title, description, and priority
    ↓
User optionally selects Bob or Carol as assignee
    ↓
User submits
    ↓
Backend validates request
    ↓
Ticket is created with status Open
    ↓
UI returns to or refreshes the ticket list
```

Required inputs:

- title
- description
- priority
- acting user

Optional input:

- assignee

Expected success behaviour:

- ticket is created with status `Open`
- `createdBy` is the selected acting user
- ticket appears in the ticket list

Expected validation behaviour:

- empty title or description shows a meaningful error
- invalid priority is rejected
- invalid assignee is rejected
- missing acting user blocks submission

## Ticket Detail Flow

```text
User selects a ticket from the list
    ↓
Frontend loads ticket details and comments
    ↓
Detail view displays ticket information
```

The detail view shows:

- title
- description
- priority
- status
- assignee
- creator
- created timestamp
- updated timestamp
- comments in oldest-first order

Available actions:

- update ticket fields
- reassign ticket
- change ticket status
- add a comment

There are no delete controls for tickets or comments.

## Update Ticket Flow

```text
User opens ticket detail
    ↓
User clicks Edit ticket to expand the update form
    ↓
User edits title, description, priority, or assignee
    ↓
User submits update
    ↓
Backend validates and saves
    ↓
Updated values are shown and the form collapses
```

An acting user is not required for ticket updates because Core does not track who performed the update.

Expected error behaviour:

- empty title or description is rejected
- invalid priority is rejected
- invalid assignee is rejected
- backend or persistence failures show a generic user-readable message

## Status Change Flow

```text
User opens ticket detail
    ↓
UI shows only relevant status options
    ↓
User selects a new status
    ↓
Backend validates transition
    ├── valid → status is saved and displayed
    └── invalid → request is rejected and UI shows an error
```

Valid transitions:

```text
Open -> In Progress
Open -> Cancelled
In Progress -> Resolved
In Progress -> Cancelled
Resolved -> Closed
```

Invalid transitions must never be silently accepted.

Examples:

- `Open -> Resolved` is rejected
- `Resolved -> Open` is rejected
- `Closed -> any status` is rejected
- `Cancelled -> any status` is rejected

The UI shows a concise, user-readable error without stack traces or internal details.

## Comment Flow

```text
User opens ticket detail
    ↓
User selects an acting user
    ↓
User enters comment text
    ↓
User submits comment
    ↓
Backend validates and saves
    ↓
Comment appears in oldest-first order
```

Rules:

- acting user is required
- comment message must be non-empty
- comment must belong to an existing ticket
- existing comments cannot be edited or deleted

Expected validation behaviour:

- missing acting user blocks submission
- empty comment shows a meaningful error
- non-existent ticket returns an error
- backend failure shows a generic user-readable message

## Keyword Search Flow

```text
User enters a keyword
    ↓
Frontend requests tickets with search parameter
    ↓
Backend searches title and description
    ↓
Matching tickets are displayed
```

Search behaviour:

- case-insensitive
- partial matching
- title and description only
- comment text is not searched

When no tickets match, the UI shows an empty state rather than an error.

## Status Filter Flow

```text
User selects a status
    ↓
Frontend requests tickets with status parameter
    ↓
Backend returns exact matches
    ↓
Filtered tickets are displayed
```

Supported values:

- Open
- In Progress
- Resolved
- Closed
- Cancelled

When no tickets match, the UI shows an empty state rather than an error.

## Search and Filter Independence

Core supports keyword search and status filtering independently.

```text
Search only     → supported
Status only     → supported
Search + status → rejected
```

When both parameters are supplied together, the backend returns a validation error and the UI shows a clear message.

## Error and Empty States

The UI should distinguish between:

### Validation error

Examples:

- missing acting user
- empty title
- invalid assignee
- empty comment

The UI shows a specific, actionable inline message near the relevant field or form. Shared copy lives in `client/src/utils/errorMessages.js` (`VALIDATION_MESSAGES`).

### Business-rule error

Example:

- invalid ticket status transition

The UI shows the backend message inline (e.g. in the status-change control) without technical details.

### Empty state

Examples:

- no tickets exist
- search returns no matches
- status filter returns no matches

This is not treated as an error.

### Load or persistence failure

When tickets, users, or ticket detail cannot be loaded, or a save/refresh fails after an action, the UI shows an inline alert with:

- a short title (e.g. “Couldn't load tickets”)
- a context-specific message and, where appropriate, a **Try again** action
- no stack traces, database details, or environment values

Generic backend or network failures use:

```text
Unable to complete the request. Please try again.
```

When the backend is unreachable:

```text
Unable to connect to the server. Check that the backend is running and try again.
```

### Success feedback

Brief confirmations (ticket created, updated, status changed, comment added) use **toast** messages only — not inline alerts.

## End-to-End Core Flow

```text
Start application
    ↓
View ticket list
    ↓
Select acting user
    ↓
Create a ticket
    ↓
Open ticket detail
    ↓
Update fields or assignee
    ↓
Move ticket through a valid status transition
    ↓
Add a comment
    ↓
Return to list
    ↓
Search or filter tickets
```

## Out of Scope UI Flows

The following are not included in Core:

- login and logout
- registration
- user management
- ticket deletion
- comment editing or deletion
- combined search and status filtering
- pagination
- priority or assignee filters
- notifications
- attachments
- dashboards and reports

## Related Documents

- `tool-specific/cursor-workflow/spec.md`
- `tool-specific/cursor-workflow/acceptance-criteria.md`
- `system-design.md`
- `database-design.md`
- `api-contract.md`
