# Design Notes

## Architecture Overview

The Support Ticket Management System uses a MERN-style architecture:

- React and Tailwind CSS for the frontend
- Node.js and Express for the backend API
- MongoDB Community Edition for local persistence
- Mongoose for database access and schema validation

The frontend communicates only with the Express API through REST and JSON. It does not connect directly to MongoDB.

Detailed architecture is documented in:

`system-design.md`

## Frontend Design

The frontend is organized around the main Core workflows:

- select an acting user
- list tickets
- view ticket details
- create a ticket
- update ticket fields and assignee
- change ticket status
- add comments
- search tickets by keyword
- filter tickets by status
- display loading, empty, and error states

The acting-user selector has no default value. It is required only when creating a ticket or adding a comment.

Search and status filtering are supported independently. Combined search and status filtering are outside Core scope.

The frontend calls the backend using `fetch` or a small API wrapper and displays short, user-readable errors returned by the API.

## Backend Design

The backend follows a layered Express structure:

```text
server/src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js
```

Responsibilities are separated as follows:

- routes map HTTP methods and paths
- controllers read requests and return responses
- services contain business rules and database operations
- models define Mongoose schemas
- middleware handles shared concerns such as validation and errors
- utilities contain reusable helpers such as ticket status-transition rules

The backend is authoritative for validation and business rules.

Detailed endpoint behaviour is documented in:

`api-contract.md`

## Database Design

The local database uses MongoDB Community Edition with three collections:

- `users`
- `tickets`
- `comments`

Relationships use MongoDB `ObjectId` references:

- `Ticket.createdBy` references a user
- `Ticket.assignedTo` optionally references a support agent
- `Comment.ticketId` references a ticket
- `Comment.createdBy` references a user

The database is accessed only by the Express backend through `MONGODB_URI`.

Mongoose models act as the application schema, and `server/src/scripts/seed.js` provides repeatable seed data.

Detailed data design is documented in:

`database-design.md`

Local setup is documented in:

`database/setup-notes.md`

## Validation Strategy

Validation is applied at multiple layers:

### API validation

Zod validates:

- request bodies
- route parameters
- query parameters
- required fields
- enum values
- MongoDB identifier formats

### Database validation

Mongoose provides schema-level safeguards for:

- required fields
- field types
- allowed enum values
- references
- timestamps
- defaults

### Business-rule validation

The service layer enforces:

- valid seeded users
- valid support-agent assignees
- ticket status-transition rules
- comment creation only for existing tickets
- rejection of combined search and status parameters

The backend remains the source of truth even when client-side validation is added.

## Error Handling Strategy

The backend returns consistent JSON responses with appropriate HTTP status codes.

Examples include:

- `400 Bad Request` for invalid input
- `404 Not Found` for missing tickets
- `409 Conflict` for invalid ticket status transitions
- `500 Internal Server Error` for unexpected failures

Sensitive details, stack traces, credentials, and internal configuration are not exposed to the client.

The frontend displays concise, user-readable messages and distinguishes between:

- validation errors
- empty results
- unavailable backend
- rejected status transitions
- unexpected failures

## Ticket Status Design

Allowed transitions are:

```text
Open -> In Progress
Open -> Cancelled
In Progress -> Resolved
In Progress -> Cancelled
Resolved -> Closed
```

All other transitions are rejected by the backend.

The transition logic is kept in one shared module so the API implementation and integration tests use the same source of truth.

## Search and Filter Design

Keyword search:

- searches ticket title and description
- uses case-insensitive partial matching
- does not search comments

Status filtering:

- matches one exact status value
- works independently from keyword search

When both `search` and `status` are supplied, the backend rejects the request with a clear validation error because combined search and filtering are outside Core scope.

## Security and Scope Decisions

- Authentication is not included in Core.
- Seeded users are used instead of user-management features.
- Secrets are stored in environment variables.
- Real `.env` files are excluded from version control.
- Ticket and comment deletion are outside scope.
- Stretch features such as pagination, advanced filters, notifications, and role-based authorization are excluded.

## Testing Strategy Link

The mandatory automated test tier focuses on ticket status transitions:

- all valid transitions must succeed
- representative invalid transitions must be rejected

Detailed testing approach:

`test-strategy.md`

Test results will be recorded in:

`test-results.md`

## Related Documents

- `system-design.md`
- `database-design.md`
- `api-contract.md`
- `testing-strategy.md`
- `database/setup-notes.md`
- `tool-specific/cursor-workflow/spec.md`
- `tool-specific/cursor-workflow/acceptance-criteria.md`
