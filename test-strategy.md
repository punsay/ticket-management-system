# Testing Strategy

Outlines the approach to testing the ticket management system for Core scope. Focuses on manual Postman API verification and automated backend integration tests. Frontend end-to-end testing is out of scope for this document.

## Overview

Testing is split into two tiers:

1. **Manual API testing (Postman)** — Exploratory and regression checks against a running local server with seeded data. Used to verify full request/response behaviour, error messages, and happy-path workflows before and after backend changes.
2. **Automated backend integration tests** — Scripted HTTP requests against the Express app and a dedicated test database. Mandatory for the ticket status state machine (AC-45, AC-46) and for ticket/comment validation rules enforced by `server/src/validation/` and `server/src/services/`.

The backend is the source of truth for validation and status transitions. Tests assert HTTP status codes, the `{ success, data | error }` response envelope (`api-contract.md`), and that invalid data is never persisted.

**Related documents:** `api-contract.md`, `tool-specific/cursor-workflow/acceptance-criteria.md`, `tool-specific/cursor-workflow/spec.md`, `tests/README.md`, `test-results.md`.

## Testing Goals

| Goal | Related criteria |
|------|------------------|
| All five valid status transitions succeed and persist | AC-28–AC-32, AC-45, NFR-04, BR-04 |
| Representative invalid transitions are rejected with `409` | AC-33–AC-35, AC-46, NFR-05, BR-05 |
| Ticket create/update validation rejects bad input before persist | AC-09–AC-11, AC-16–AC-17, AC-36, VR-01–VR-07 |
| Comment create validation rejects bad input and missing tickets | AC-20, AC-37–AC-38, VR-07, VR-09–VR-10 |
| Error responses are user-readable and do not expose internals | NFR-02, NFR-03 |
| Manual checks document interim evidence; automation provides repeatable proof | `test-results.md`, `tasks.md` |

## Test Types

### Manual API testing (Postman)

**When to use**

- Initial API verification during implementation
- Regression after validation or transition logic changes
- Spot-checking error messages and response shapes
- Verifying behaviour against seeded sample data

**Prerequisites**

- Local MongoDB running
- `server/.env` configured (`MONGODB_URI`, `PORT`; default `5001` per `server/.env.example`)
- Dependencies installed; database seeded (`npm run seed` in `server/`)
- API server running (`npm run dev` in `server/`)

**Base URL:** `http://localhost:5001/api` (adjust if `PORT` differs)

**Setup**

1. Call `GET /api/users` and store Alice, Bob, and Carol `_id` values as Postman collection/environment variables.
2. Organise requests by area: users, tickets (CRUD), comments, search/filter, status transitions, validation failures.
3. For each request, assert:
   - HTTP status matches `api-contract.md`
   - `success` is `true` or `false` as expected
   - `data` or `error.message` is present and human-readable (no stack traces)

**Manual coverage checklist**

| Area | Key requests | Expected outcome |
|------|--------------|------------------|
| Users | `GET /api/users` | `200`, three seeded users returned |
| Ticket create | `POST /api/tickets` with valid body | `201`, `status` is `Open`, `createdBy` populated |
| Ticket list/detail | `GET /api/tickets`, `GET /api/tickets/:id` | `200`, detail includes comments oldest first |
| Ticket update | `PUT /api/tickets/:id` (title, priority, assignee) | `200`, changes persisted on re-fetch |
| Search | `GET /api/tickets?search=...` | Case-insensitive partial match on title/description only |
| Status filter | `GET /api/tickets?status=Open` | Exact status match |
| Combined query | `GET /api/tickets?search=x&status=Open` | `400`, combined filter rejected |
| Comments | `POST /api/tickets/:id/comments` | `201` with valid body; `404` for missing ticket |
| Valid transitions | `PUT /api/tickets/:id` with `status` only | See [Valid status transitions](#valid-status-transitions) |
| Invalid transitions | `PUT /api/tickets/:id` with disallowed `status` | `409`, status unchanged on re-fetch |
| Validation regression | Invalid bodies below | `400` (or `404` where noted), no invalid persist |

Record pass/fail outcomes in `test-results.md`.

### Backend integration tests

**When to use**

- Repeatable verification of status state machine and validation (mandatory for Core completion)
- Pre-merge / pre-submission checks
- Guarding against regressions in `statusTransitionService`, validation modules, and `ticketService`

**Approach**

- HTTP requests via **supertest** against the exported Express app (`server/src/app.js`) — no separate server process.
- Connect to a **dedicated test database** (e.g. `ticket_management_system_test` via `MONGODB_URI` in test setup) so dev/seed data is not affected.
- Create test fixtures programmatically in `beforeAll` / `beforeEach`: insert the three seeded users, then create tickets at the starting status needed for each case.
- After invalid-transition or validation-failure tests, re-fetch the ticket from the database (or via `GET /api/tickets/:id`) to confirm status and fields were not changed.
- Tear down: drop collections or the test database in `afterAll`; disconnect Mongoose.

**Planned file layout** (see `tests/README.md`):

```text
tests/
├── integration/
│   ├── ticket-status-transitions.test.js
│   └── ticket-comment-validation.test.js
└── README.md
```

Integration tests are the authoritative automated tier for Core backend behaviour. Unit tests for individual functions are optional and not required for Core scope.

### Out of scope

- Frontend UI / browser automation (covered later against AC-01–AC-04, AC-39, AC-40)
- Authentication and authorization
- Ticket/comment delete endpoints (not implemented)
- Combined search + status filter success path (rejection only is in scope)
- Load, performance, and security penetration testing

## Tools and Frameworks

| Tool | Purpose |
|------|---------|
| **Postman** | Manual API exploration and regression |
| **Jest** | Test runner (to be added to `server/` devDependencies) |
| **supertest** | HTTP assertions against Express `app` without binding a port |
| **MongoDB Community Edition** | Persistence for manual (seed DB) and integration (test DB) runs |
| **Mongoose** | Same ODM as production; tests use real DB, not mocks |

**Planned npm script** (to be added in `server/package.json`):

```bash
npm test
```

Runs Jest from the repo root or `server/` with `NODE_ENV=test` and a test `MONGODB_URI`. Exact wiring is defined when tests are implemented.

## Coverage Targets

### Valid status transitions

Each test creates a ticket at the **from** status, sends `PUT /api/tickets/:id` with `{ "status": "<to>" }`, and asserts:

- HTTP `200`
- `success: true`
- Response `data.status` is the target status
- Re-fetch confirms persistence

| From | To | AC |
|------|-----|-----|
| Open | In Progress | AC-28 |
| Open | Cancelled | AC-29 |
| In Progress | Resolved | AC-30 |
| In Progress | Cancelled | AC-31 |
| Resolved | Closed | AC-32 |

Source of truth: `server/src/services/statusTransitionService.js` (`ALLOWED_TRANSITIONS`).

### Invalid status transitions

Each test attempts a disallowed transition and asserts:

- HTTP `409`
- `success: false` with a readable `error.message` (e.g. `Cannot transition from Open to Resolved`)
- Ticket status unchanged after re-fetch

| From | To (representative) | AC |
|------|---------------------|-----|
| Open | Resolved | AC-33, AC-46 |
| Open | Closed | AC-33 |
| Open | Open | No-op: `200`, status unchanged (update skips transition check when `status` equals current) |
| In Progress | Open | AC-46 |
| Resolved | Open | AC-46 |
| Resolved | In Progress | AC-46 |
| Closed | In Progress | AC-34, AC-46 |
| Cancelled | Open | AC-34, AC-46 |

Additional invalid cases worth one integration test each: invalid status string on update (`400`, VR-05), terminal states `Closed` and `Cancelled` rejecting any change (AC-34).

### Ticket validation

Assert `400`, `success: false`, and no created/updated invalid record unless noted.

**Create — `POST /api/tickets`**

| Scenario | Expected message (or pattern) | VR / AC |
|----------|------------------------------|---------|
| Missing or empty `title` | Title is required | VR-02, AC-09 |
| Missing or empty `description` | Description is required | VR-03, AC-09 |
| Invalid `priority` | Invalid priority | VR-04, AC-10 |
| Missing `createdBy` | Invalid user | VR-07, AC-37 |
| Malformed `createdBy` ObjectId | Invalid user | VR-07 |
| Non-existent `createdBy` | Invalid user | VR-07, AC-37 |
| `assignedTo` is Alice (requester) | Assignee must be a support agent | VR-06, AC-11 |
| Malformed `assignedTo` ObjectId | Assignee must be a support agent | VR-06 |
| Non-object body (`null`, array, string) | Field-level or generic validation failure | VR-01 |

**Update — `PUT /api/tickets/:id`**

| Scenario | Expected | VR / AC |
|----------|----------|---------|
| Empty `title` or `description` when provided | `400` | VR-02, VR-03, AC-16 |
| Invalid `priority` | `400` | VR-04 |
| Invalid `assignedTo` (Alice or unknown user) | `400` | VR-06, AC-17 |
| Malformed ticket `:id` | `404` Ticket not found | — |
| Non-existent ticket `:id` | `404` | — |

**Happy-path sanity** (one test each): valid create with/without assignee (`201`, `status: Open`), valid field update (`200`).

### Comment validation

**Create — `POST /api/tickets/:id/comments`**

| Scenario | HTTP | Expected | VR / AC |
|----------|------|----------|---------|
| Valid message and `createdBy` | `201` | Comment returned with creator | AC-18 |
| Missing or empty `message` | `400` | Message is required | VR-09, AC-20 |
| Missing or malformed `createdBy` | `400` | Invalid user | VR-07 |
| Non-existent `createdBy` | `400` | Invalid user | AC-37 |
| Malformed ticket `:id` | `404` | Ticket not found | VR-10 |
| Non-existent ticket `:id` | `404` | Ticket not found | VR-10, AC-38 |
| Non-object body | `400` | Validation failure | VR-01 |

### Manual-only spot checks (not required in automation)

These are already manually verified; re-check in Postman after major changes:

- Keyword search case-insensitivity and comment exclusion from search (AC-22, AC-23)
- Status filter exact match and empty results (AC-25, AC-26)
- Combined `search` + `status` rejection (AC-27)

## CI Integration

Core scope targets **local** execution only. No GitHub Actions workflow exists yet.

**Local workflow**

1. Start MongoDB.
2. Set test `MONGODB_URI` (separate from dev database).
3. Run `npm test` from the configured package root.
4. Update `test-results.md` with date, command, and pass/fail summary.

**Future CI (optional, out of Core scope)**

A minimal pipeline could run on push: install dependencies, start MongoDB service, run `npm test`, fail on any non-zero exit. Not required for Core completion.

## Test Data Management

### Manual Postman

- Use the **development database** after `npm run seed`.
- Rely on `GET /api/users` for current ObjectIds; do not hardcode IDs from seed output.
- Prefer creating disposable tickets for transition tests so seeded sample tickets stay unchanged.
- Document any shared Postman collection in the repo if the team adds one (optional).

### Integration tests

- Use a **separate test database** name in `MONGODB_URI` (e.g. `mongodb://127.0.0.1:27017/ticket_management_system_test`).
- Do not depend on `npm run seed` sample tickets; tests create their own users and tickets so order and status are deterministic.
- Minimum fixture per transition test: three users (Alice, Bob, Carol with correct roles) and one ticket at the required starting status.
- Clean up after the suite to avoid stale data on repeated runs.
- Valid-transition tests may reuse one ticket through a linear lifecycle (Open → In Progress → Resolved → Closed) where that reduces setup; invalid-transition tests should use isolated tickets to avoid cross-test interference.

### Evidence and traceability

| Activity | Record in |
|----------|-----------|
| Manual Postman runs | `test-results.md` |
| Automated test runs | `test-results.md` (command, exit code, summary) |
| Coverage mapping | AC IDs in this document and `acceptance-criteria.md` |

## Definition of done (testing)

Core backend testing is complete when:

- Manual validation regression for ticket/comment validation is recorded in `test-results.md`
- Integration tests pass for all five valid transitions (AC-45)
- Integration tests pass for representative invalid transitions (AC-46)
- Integration tests cover the ticket and comment validation scenarios in [Coverage Targets](#coverage-targets)
- `npm test` is documented in the README test section (when implemented)
