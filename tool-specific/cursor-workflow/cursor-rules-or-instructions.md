# Cursor Rules and Instructions

How Cursor project rules guide AI-assisted development of the Support Ticket Management System.

## Why project rules were introduced

Written requirements and design docs define *what* the system must do, but they do not automatically shape day-to-day coding habits. Project rules in `.cursor/rules/` give Cursor persistent, lightweight guardrails so that:

- The agent reads the right context before making changes
- Implementation stays within Core scope
- Backend, frontend, and API conventions stay consistent across tasks
- Responses stay concise and traceable to requirements

Rules complement — not replace — `project-context.md`, `spec.md`, `tasks.md`, and `acceptance-criteria.md`.

## Active rules

| Rule file | Applies | Purpose |
|-----------|---------|---------|
| `.cursor/rules/project-workflow.mdc` | Always | Workflow and scope discipline |
| `.cursor/rules/code-quality.mdc` | Always | Readability, API shape, safe errors |
| `.cursor/rules/output-format.mdc` | Always | How the agent describes changes |
| `.cursor/rules/architecture-backend.mdc` | `server/**/*` | Backend layering and validation |
| `.cursor/rules/frontend.mdc` | `client/**/*` | React structure and UI patterns |
| `.cursor/rules/testing.mdc` | Test files and test commands | Core-scope test implementation and execution |

## Main instructions by rule

### `project-workflow` (always on)

Before major changes, read the workflow docs (`project-context.md`, `spec.md`, `tasks.md`, `acceptance-criteria.md`) and design docs when relevant. Stay in Core scope, do not invent requirements, flag conflicts before coding, and after each task summarize changed files, related FR/BR/VR/NFR/AC IDs, and checks performed.

### `architecture-backend` (server files)

Use **Routes → Controllers → Services → Mongoose Models**. Routes define endpoints; controllers handle HTTP; services hold business rules (including ticket status transitions); models handle persistence. Connect to **MongoDB Atlas** via `MONGODB_URI` only — never hardcode or commit credentials. The React frontend never accesses MongoDB directly. Validate API input with **Zod**; use **Mongoose schema validation** as a persistence safeguard; enforce business rules in services. Use centralized error handling and keep controllers thin.

### `frontend` (client files)

Use React functional components, hooks, and Tailwind CSS. Organize into `pages/`, `components/`, `services/`, `hooks/`, and `utils/`. API calls live in services; custom hooks only when logic is reused. Always show loading, empty, and meaningful error states. No class components.

### `code-quality` (always on)

Prefer readable, focused functions; avoid duplication and unnecessary dependencies. Comment only non-obvious decisions. Use consistent API responses (`success` + `data` or `error.message`) and appropriate HTTP status codes. Never expose stack traces or secrets to the client.

### `output-format` (always on)

Keep explanations short. Name file paths when describing changes. Show only changed or new sections — not full unchanged files — unless the file is small and new or full content was requested.

### `testing` (test files and test commands)

Treat `test-strategy.md` as the testing source of truth. Keep testing within mandatory Core scope and prioritize integration tests for valid and representative invalid ticket status transitions, ticket validation, and comment validation. Use Jest, Supertest, the exported Express app, and a dedicated local MongoDB test database that is separate from development data. Use deterministic fixtures, clean up test data after execution, and verify both HTTP responses and database persistence or non-persistence. Inspect existing files before changes, keep updates minimal, and change production code only when a test confirms a defect. Do not add optional unit, component, frontend E2E, CI, Docker, authentication, or other Stretch work.

## How rules support development

**Context-driven:** `project-workflow` points the agent at the same documents a human developer would read first, so implementation aligns with confirmed requirements rather than assumptions.

**Task-by-task:** After each task in `tasks.md`, the workflow rule expects a summary tied to requirement IDs. Layer-specific rules (`architecture-backend`, `frontend`) activate when editing matching files, so conventions apply at the right time without cluttering unrelated work.

**Traceable:** Together with prompt history and project docs, rules make it easier to show what was built, why, and how it was checked.

## Refining rules during implementation

Rules are living guidance, not frozen law. Update a `.mdc` file when:

- A repeated mistake appears (add or tighten a rule)
- A rule conflicts with an updated spec or API doc (align the rule and docs together)
- A convention proves too heavy for this small project (simplify)

Prefer small, focused edits to one rule at a time. After changing a rule, note the reason briefly in a commit or task summary. If a rule and `api-contract.md` diverge (e.g. response envelope shape), update both so they match.

## Restrictions (from Core scope)

Regardless of rules, do not implement: authentication, ticket/comment deletion, combined search-and-filter, pagination, or other items listed as out of scope in `spec.md` and `requirements-analysis.md`.

## Rule Refinements

Before implementation, the active Cursor rules were reviewed against the API specification.

The review found inconsistent API response formats across the backend and code-quality rules.
The rules were aligned to use:

- `success` and `data` for successful responses
- `success` and `error.message` for failed responses

The frontend rule was also updated to read successful responses from `data` and failures from
`error.message`.

The API behaviour for combined `search` and `status` parameters was clarified as HTTP 400.
