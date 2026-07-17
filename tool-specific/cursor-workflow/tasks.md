# Tasks

Core-scope task tracker for the Support Ticket Management System. See `tool-specific/cursor-workflow/spec.md` and `tool-specific/cursor-workflow/acceptance-criteria.md` for behaviour details.

## Completed

- [x] Prompt-history automation (`prompt-history/`, `.cursor/hooks.json`)
- [x] Documentation structure (``, `tool-specific/cursor-workflow/`)
- [x] Project context (`tool-specific/cursor-workflow/project-context.md`)
- [x] Requirement analysis (`requirements-analysis.md`)
- [x] Acceptance criteria (`tool-specific/cursor-workflow/acceptance-criteria.md`)
- [x] Core specification (`tool-specific/cursor-workflow/spec.md`)

## Design documents

- [x] System design (`system-design.md`)
- [x] Database design (`database-design.md`)
- [x] API specification (`api-contract.md`)
- [x] Review planning, design documents, and Cursor rules for implementation-blocking conflicts
  - Resolved API response-envelope conflict
  - Defined HTTP 400 behaviour when `search` and `status` are supplied together

## Cursor rules

- [x] Cursor rules and instructions (`tool-specific/cursor-workflow/cursor-rules-or-instructions.md`)

## Project setup

- [x] Scaffold client and server structure
- [x] Configure environment variables and dev scripts (NFR-08, AC-47)
- [x] Add initial README project overview and setup placeholders
- [x] Configure local MongoDB Community Edition for development
- [x] Add local database setup and seed instructions
- [x] Verify seeded data in MongoDB Compass

## Backend

- [x] Express server with safe error handling (VR-01, NFR-03)
- [x] MongoDB connection (NFR-01, FR-13, AC-41)
- [x] User, Ticket, and Comment models (FR-10, BR-02, BR-03)
- [x] Seed three users and sample tickets (NFR-06, AC-42, AC-43)
- [x] Ticket create, list, detail, and update (FR-01–FR-04, AC-05–AC-17)
- [x] Backend validation for ticket and comment inputs, excluding status transitions (VR-01–VR-07, VR-09–VR-11, AC-09–AC-11, AC-16, AC-17, AC-37, AC-38)
- [x] Comments — add and return oldest first (FR-06, FR-07, AC-18–AC-21)
- [x] Keyword search on title and description (FR-08, AC-22–AC-24)
- [x] Status filter on ticket list (FR-09, AC-25–AC-27)
- [x] Status transition rules enforced on update (FR-05, BR-04, BR-05, VR-08, AC-28–AC-35)

## Testing

- [x] Testing strategy (`test-strategy.md`)
- [x] Integration tests for valid status transitions (NFR-04, AC-45)
- [x] Integration tests for invalid status transitions (NFR-05, AC-46)
- [x] Integration tests for ticket and comment validation (AC-09–AC-11, AC-16–AC-17, AC-20, AC-36–AC-38, VR-01–VR-07, VR-09–VR-10)
- [x] Testing report (`test-results.md`) — status-transition and validation suites recorded

## Frontend

- [x] Acting-user dropdown — no default; required for create/comment only (FR-11, FR-12, AC-01–AC-04)
- [x] Ticket list and detail views (FR-02, FR-03, AC-12, AC-13)
- [x] Create ticket form — optional assignee (Bob or Carol) (FR-01, AC-05–AC-08)
- [x] Update ticket form — no acting user required (FR-04, COD-09, AC-14–AC-17)
- [ ] Status change control with error display (FR-05, AC-28–AC-35)
- [ ] Comment form and display — oldest first, no edit/delete (FR-06, FR-07, BR-11, AC-18–AC-21)
- [ ] Keyword search and status filter controls — work separately (FR-08, FR-09, AC-22–AC-27)
- [ ] Meaningful UI error messages (NFR-02, NFR-03, AC-39, AC-40)

## Final documentation

- [ ] Debugging log (`debugging-notes.md`)
- [ ] Code review (`code-review-notes.md`)
- [ ] Reflection (`reflection.md`)
- [ ] PR description (`pr-description.md`)
- [ ] Tool workflow (`tool-workflow.md`)
- [ ] Review prompt history and confirm key prompts, refinements, and corrections are captured (NFR-09)
- [ ] Finalize and verify README setup, seed, run, and test instructions (NFR-07, AC-44)
- [ ] Final review against AC-01–AC-48
- [ ] Verify data persists after application and MongoDB restarts (AC-41)
- [ ] Verify no secrets committed and no delete UI (AC-47, AC-48)
- [ ] Repository ready for submission
