# Cursor Rules and Instructions

How the active `.cursor/rules/` files guide AI-assisted development of the Support Ticket Management System.

## Purpose

The project documents define expected behaviour, while Cursor rules provide persistent implementation guardrails. They keep work within Core scope, enforce consistent backend and frontend patterns, guide testing, and require concise, traceable task summaries.

Rules complement — not replace — `project-context.md`, `spec.md`, `tasks.md`, and `acceptance-criteria.md`.

## Active Rules

| Rule file | Applies to | Main purpose |
|---|---|---|
| `.cursor/rules/project-workflow.mdc` | Always | Read project context, stay in scope, and report traceability |
| `.cursor/rules/code-quality.mdc` | Always | Readable code, consistent API responses, and safe errors |
| `.cursor/rules/output-format.mdc` | Always | Concise responses containing relevant changed sections |
| `.cursor/rules/architecture-backend.mdc` | `server/**/*` | Backend layering, validation, persistence, and error handling |
| `.cursor/rules/frontend.mdc` | `client/**/*` | React structure, styling, API handling, and UI feedback |
| `.cursor/rules/testing.mdc` | `tests/**/*` | Core integration-test scope and isolated test data |

## Main Instructions

### Project workflow

Before major changes, read the tool-specific context, specification, task tracker, and acceptance criteria. Read the relevant design, API, requirement, or test documents for the requested work.

Complete only the requested task, remain within Core scope, do not invent features, and report conflicts before coding. After each task, summarize changed files, related requirement or acceptance IDs, and checks performed.

### Backend architecture

Use:

```text
Routes → Controllers → Services → Mongoose Models
```

- Controllers handle HTTP concerns and remain small.
- Services enforce business rules, including ticket status transitions.
- Models handle schemas and persistence.
- Validate request bodies, query parameters, and route parameters with Zod where applicable.
- Treat backend validation as authoritative and use Mongoose validation as an additional safeguard.
- Access MongoDB only through the Express backend and read its connection from `MONGODB_URI`.
- Return `{ success: true, data }` for success and `{ success: false, error: { message } }` for failure.
- Use centralized error handling and never expose stack traces, secrets, or internal configuration.

> The current `architecture-backend.mdc` still names MongoDB Atlas. It should be minimally aligned with the implemented local MongoDB development setup and separate local test database.

### Frontend

Use React functional components, hooks, Tailwind CSS, `lucide-react`, and `sonner`.

- Keep API requests in service modules rather than components.
- Read successful API values from `payload.data` and failures from `payload.error.message`.
- Show loading, empty, validation, and meaningful error states.
- Use Tailwind’s default font stack and existing responsive, accessible UI patterns.
- Use `lucide-react` only where icons improve clarity.
- Use `sonner` for brief action feedback.
- Use inline messages when users need details or retry actions.
- Reuse `errorMessages.js`, `InlineErrorAlert`, and `ValidationNotice` for consistent error presentation.
- Map network and unparsable responses to safe generic messages.
- Avoid class components, custom fonts, additional UI libraries, and unnecessary abstractions.

### Code quality and output

Prefer readable, focused functions, avoid duplicate logic and unnecessary dependencies, and comment only non-obvious decisions.

Cursor responses should be concise, name changed file paths, and show only relevant changed or new sections unless full files are explicitly requested.

### Testing

Treat `test-strategy.md` as the source of truth.

- Use Jest and Supertest with the exported Express app.
- Use real Mongoose persistence against a dedicated local test database.
- Never use or modify development or seeded data during automated tests.
- Create deterministic users and tickets for each test.
- Clean up test data and disconnect Mongoose after execution.
- Verify HTTP status, API response shape, and persistence or non-persistence.
- Cover all five valid status transitions, representative invalid transitions, and ticket/comment validation.
- Keep changes minimal and modify production code only when a test confirms a defect.
- Do not add optional unit, component, frontend E2E, CI, Docker, authentication, or other Stretch work.

## How the Rules Support Traceability

The rules ensure that Cursor:

- Reads persistent project context before implementation
- Follows the agreed specification and Core boundaries
- Uses consistent backend, frontend, and testing conventions
- Reports files changed, requirement links, and verification results
- Supports traceability from requirements and prompts through code and tests

## Rule Refinements Made During the Project

The rules were refined to:

- Standardize API success and error envelopes
- Clarify HTTP 400 behaviour for combined `search` and `status`
- Add Tailwind CSS, `lucide-react`, and `sonner` frontend guidance
- Standardize inline validation and error-message UI patterns
- Add Core integration-testing guidance using Jest, Supertest, and an isolated test database

## Core Restrictions

Do not implement authentication, user management, ticket deletion, comment editing or deletion, combined search-and-filter, pagination, Docker, CI, or other Stretch features unless the project scope is explicitly changed.
