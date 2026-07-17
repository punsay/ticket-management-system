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

I verified the generated setup by running the frontend and backend, checking the health endpoint, confirming the local MongoDB connection, and running the seed script. I also checked the created users, tickets, and comments in MongoDB and manually verified the seeded-users, ticket CRUD, comments, search and status-filtering, and valid and invalid ticket status transitions in Postman. The new validation-layer changes were reviewed in code; their Postman regression checks are the next validation step.

## Testing

I manually validated the seeded-users, ticket CRUD, comments, search and status-filtering, and ticket status transitions in Postman. Postman regression checks for null/non-object request bodies, malformed ObjectIds, missing fields, and invalid priority values are pending. Automated integration tests, including backend validation and valid/invalid status-transition coverage, are still pending.

## Debugging

I documented two setup issues in `debugging-notes.md`:

- port `5000` was already in use by a macOS service, so the backend was moved to port `5001`
- the seed script initially failed because `MONGODB_URI` still contained an old Atlas password; after updating the environment value, the seed completed successfully
- the project was later aligned to local MongoDB Community Edition, verified in Compass, and documented for repeatable setup
- repeated Mongoose seed warnings were resolved by replacing `new: true` with `returnDocument: 'after'` and rerunning the seed process

## Code Review

I completed an initial review of the project setup, backend structure, MongoDB connection, Mongoose models, seed data, seeded-users API, ticket CRUD APIs, comments API, search and filtering, and ticket status transitions. The review notes and remaining follow-up items are recorded in `code-review-notes.md`.

## Responsible Information Sharing

I avoid sharing secrets, real credentials, private environment values, and unnecessary sensitive information with AI tools. Environment-specific values are represented through `.env.example`, while real `.env` files are excluded from Git.

## Reusing This Workflow

_To be completed near the end of the project._