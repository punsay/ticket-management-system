## Primary AI Tool

I am using Cursor as the primary AI-assisted development tool for this project.

## Providing Project Context

I created persistent project documents under
`tool-specific/cursor-workflow/`.

The main context files are:

- `project-context.md`
- `spec.md`
- `acceptance-criteria.md`
- `tasks.md`

For important prompts, I reference these files directly so Cursor uses the approved project decisions instead of relying only on the current chat.

I also created persistent Cursor project rules under `.cursor/rules/`. These rules guide Cursor to read the approved project documents, work on one task at a time, remain within the Core scope, follow the agreed architecture, enforce backend validation, and avoid unnecessary dependencies or unrelated changes.

## Requirement Analysis

I used Cursor to create an initial requirement analysis for the ticket management system.

I reviewed the output and refined decisions such as:

- assignee being optional during ticket creation
- limiting assignees to seeded support agents
- requiring a selected user only for ticket and comment creation
- keeping search and status filtering independent
- excluding authentication and deletion from Core scope

## Planning and Design

I used Cursor to create the project context, requirement analysis, acceptance criteria, specification, and task plan before generating application code.

The task plan was later reorganized so it reflected the actual project workflow, including work already completed.

After the planning documents were stable, I created the system design, database design, and API specification before starting implementation. I introduced Cursor rules only after these design decisions were reviewed, so the rules were based on approved project context rather than early assumptions.

Related commits:

- `docs: add system, database, API design and workflow artifacts`
- `chore(cursor): added persistent workflow and cursor coding rules`

## Validation of AI Suggestions

I did not accept AI-generated content without review.

During planning, Cursor identified inconsistencies between the project context, requirements, acceptance criteria, and task plan. I reviewed the findings and updated the documents to:

- use one consistent assignee rule
- separate general input validation from status-transition validation
- align the task plan with the actual project progress
- keep optional features outside the Core scope

Related commit:

- `docs: validated AI suggestions and updated task plan`

I also reviewed the generated Cursor coding rules against the existing design documents. The code-quality rule introduced a consistent API response format using `success`, `data`, and `error`, while the API specification used a different response shape.

I chose to update the API specification so it matched the approved rule. I also added HTTP `409 Conflict` for invalid ticket status transitions, while keeping `400 Bad Request` for normal validation errors.

This review happened before backend implementation so the frontend, backend, tests, and API documentation can follow one consistent contract.

Related commit:

- `docs: align API specification with validated Cursor rules`

Cursor’s consistency review also found that the API behaviour was undefined when both
`search` and `status` query parameters were supplied together.

I decided that Core supports these controls independently. Therefore, the backend returns
HTTP 400 with a clear validation message when both parameters are provided.

I updated the API specification and Cursor rules before implementation so that the frontend,
backend, and tests follow the same behaviour.

- `docs: resolve API specification and Cursor rule conflicts`

## Code Generation

I used Cursor to complete the initial React and Express setup, connect the backend to local MongoDB Community Edition, create the Mongoose models, add the seed script, and implement the seeded-users, ticket CRUD, comments, search and status-filtering, ticket status-transition behaviour, and dedicated ticket/comment input validation. Each prompt was limited to one task, and I reviewed the generated changes before continuing.

## Validation of AI-Generated Code

I verified the generated setup by running the frontend and backend, checking the health endpoint, confirming the local MongoDB connection, and running the seed script. I also checked the created users, tickets, and comments in MongoDB and manually verified the seeded-users, ticket CRUD, comments, search and status-filtering, and valid and invalid ticket status transitions in Postman. The validation-layer changes were reviewed in code and verified through focused Jest/Supertest integration tests.

## Testing

I manually validated the seeded-users, ticket CRUD, comments, search and status-filtering, and ticket status transitions in Postman. I then added Jest/Supertest integration tests for valid and invalid status transitions and ticket/comment validation. The final automated run passed 44/44 tests against an isolated local test database.

## Debugging

I documented two setup issues in `debugging-notes.md`:

- port `5000` was already in use by a macOS service, so the backend was moved to port `5001`
- the seed script initially failed because `MONGODB_URI` still contained an old Atlas password; after updating the environment value, the seed completed successfully
- the project was later aligned to local MongoDB Community Edition, verified in Compass, and documented for repeatable setup
- repeated Mongoose seed warnings were resolved by replacing `new: true` with `returnDocument: 'after'` and rerunning the seed process

## Code Review

I reviewed the project setup, backend structure, MongoDB connection, models, seed data, APIs, validation, frontend Core workflows, automated tests, and final documentation alignment. Findings and applied fixes are recorded in `code-review-notes.md` and `review-fixes.md`.

## Responsible Information Sharing

I avoid sharing secrets, real credentials, private environment values, and unnecessary sensitive information with AI tools. Environment-specific values are represented through `.env.example`, while real `.env` files are excluded from Git.

## Commit-Based Workflow Evidence

The Git history demonstrates how this workflow was applied:

1. **Context and planning first:** project documentation, requirements, acceptance criteria, design artifacts, and Cursor rules were committed before the main feature work.
2. **AI output reviewed:** separate documentation commits record corrected task planning, aligned API response rules, and the decision to reject combined search and status filtering.
3. **Backend implemented incrementally:** database connection, models, seed data, users API, ticket CRUD, comments, search/filtering, state transitions, and validation were committed as separate steps.
4. **Tests followed an approved strategy:** the test strategy and Cursor testing rule were refined before the two integration-test commits.
5. **Frontend built in focused slices:** acting-user selection, list/detail, create, update, status, comments, and search/filter were implemented separately, followed by form and error-state refinements.
6. **History completed honestly:** prompt hooks were added early; the initial uncaptured prompt was later backfilled and labelled, then curated AI prompts were aligned to the final history.

Representative commits include:

- `docs: validated AI suggestions and updated task plan`
- `docs: align API specification with validated Cursor rules`
- `feat(server): add ticket and comment validation with document updates`
- `test(server): add ticket status transition integration tests`
- `test(server): add integration(ticket and comment) tests and update test documentation`
- `feat(client): open create-ticket form from modal and refine form UI`
- `feat(client): open ticket update form from edit action and other validation improvements`
- `style(client): improve error message UI`
- `docs: align curated AI prompts with final project history`

## Reusing This Workflow

I would reuse this workflow by keeping the same sequence: establish persistent context, convert the brief into requirements and acceptance criteria, design before coding, implement one scoped task at a time, validate each change, record corrections, and finish with automated tests and a repository-wide consistency review. The project-specific content can change while the workflow, Cursor rules, prompt-history approach, and evidence structure remain reusable.