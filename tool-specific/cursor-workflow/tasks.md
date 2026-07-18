# Tasks

Core-scope task tracker for the Support Ticket Management System. Behaviour details are defined in `spec.md` and `acceptance-criteria.md`.

## Workflow Foundation

- [x] Prompt-history automation and append-only logging
- [x] Manual backfill of the initial prompt-history setup
- [x] Required repository and lifecycle-document structure
- [x] Project context
- [x] Requirement analysis
- [x] Acceptance criteria
- [x] Core specification
- [x] Cursor rules and instructions
- [x] Curated `ai-prompts/` records aligned with project history

## Design and Planning

- [x] Implementation plan (`implementation-plan.md`)
- [x] Design notes (`design-notes.md`)
- [x] Data model (`data-model.md`)
- [x] API contract (`api-contract.md`)
- [x] UI flow (`ui-flow.md`)
- [x] Review design documents and Cursor rules for conflicts
  - [x] Align API response envelopes
  - [x] Define HTTP 400 when `search` and `status` are supplied together

## Project Setup

- [x] Scaffold React client and Express server
- [x] Configure environment variables and development scripts
- [x] Configure local MongoDB Community Edition
- [x] Add separate local test database configuration
- [x] Add seed data and setup instructions
- [x] Verify seeded data locally

## Backend

- [x] Express server and centralized safe error handling
- [x] MongoDB connection
- [x] User, Ticket, and Comment models
- [x] Seed three users, sample tickets, and comments
- [x] Seeded users API
- [x] Ticket create, list, detail, and update APIs
- [x] Ticket comments API
- [x] Keyword search on title and description
- [x] Status filtering
- [x] Enforced valid status transitions and rejection of invalid transitions
- [x] Ticket and comment request validation

## Testing

- [x] Core test strategy
- [x] Jest, Supertest, exported Express app, fixtures, and cleanup
- [x] Dedicated test database protection
- [x] Valid status-transition integration tests
- [x] Invalid status-transition integration tests
- [x] Ticket and comment validation integration tests
- [x] Test results documented

## Frontend

- [x] Acting-user selector with no default selection
- [x] Ticket list and detail views
- [x] Create-ticket form
- [x] Create form opened from a modal instead of displayed upfront
- [x] Ticket update form opened from an edit action
- [x] Status-change control
- [x] Comment form and oldest-first comment display
- [x] Keyword search and status filter controls
- [x] Meaningful user-readable error messages
- [x] Error-message UI refinement
- [x] Tailwind CSS, `lucide-react`, and `sonner` conventions documented

## Final Documentation and Verification

- [x] Finalize `debugging-notes.md`
- [x] Finalize `code-review-notes.md`
- [x] Finalize `review-fixes.md`
- [x] Finalize `reflection.md`
- [x] Finalize `pr-description.md`
- [x] Finalize `tool-workflow.md`
- [x] Finalize `final-ai-usage-summary.md`
- [x] Verify README setup, seed, run, and test instructions
- [x] Review prompt history for key iterations, corrections, and validation evidence
- [x] Verify data persistence after application and MongoDB restarts
- [x] Verify no secrets are committed
- [x] Verify no ticket or comment delete UI exists
- [x] Complete final review against AC-01 through AC-48
- [x] Mark repository ready for submission
