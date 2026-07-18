# Reflection

Personal reflection on the development process, challenges faced, skills gained, and areas for improvement.

## Overview

The mandatory Core Support Ticket Management System is complete. The final solution includes the React frontend, Express API, local MongoDB persistence, repeatable seed data, backend validation, controlled ticket status transitions, comments, search, status filtering, meaningful UI states, prompt-history evidence, and passing integration tests.

## What Went Well

- Creating project context, requirements, acceptance criteria, design documents, and tasks before coding reduced ambiguity.
- Reviewing AI suggestions identified conflicts in API response formats and search/filter behaviour before implementation.
- Cursor rules made later prompts shorter while preserving project scope and coding conventions.
- Separating the work into small tasks made it easier to verify each change before continuing.
- The backend structure was corrected early so all application source code is consistently stored under `server/src/`.
- The MongoDB connection, models, seed data, backend APIs, search and filtering, and status-transition behaviour were implemented and manually verified successfully.
- Ticket and comment field validation was separated into dedicated modules without changing existing API behaviour or status-transition rules.
- Prompt-history automation and meaningful commits provide a traceable development record.

## Challenges

- Some early AI-generated suggestions were more complex than necessary and needed simplification.
- The API specification and Cursor rules initially used conflicting response formats.
- Port `5000` was already used by a macOS service, so the backend was moved to port `5001`.
- A previously working MongoDB connection later failed during seeding because the Atlas database-user password had changed while the local `MONGODB_URI` still used the old password.
- The project then needed to be aligned with a fully local MongoDB setup and documented so another developer could reproduce it.
- The seed script completed with repeated Mongoose deprecation warnings, which required a small API-option update and revalidation.
- It was necessary to distinguish between application problems, environment problems, and system processes before making changes.

## Skills Learned

- Writing clearer requirements and acceptance criteria before implementation
- Creating and refining persistent Cursor project rules
- Using a layered Express architecture
- Separating request validation from database checks and business rules
- Validating request-body types and MongoDB ObjectId formats before database operations
- Organizing backend source code consistently
- Connecting Mongoose to local MongoDB through environment variables
- Designing Mongoose schemas with references, enums, timestamps, defaults, and indexes
- Creating seed scripts that can be run repeatedly without duplicates
- Installing and running MongoDB Community Edition locally on macOS
- Verifying local databases and collections in MongoDB Compass
- Resolving Mongoose deprecation warnings by replacing `new: true` with `returnDocument: 'after'`
- Diagnosing port conflicts with `lsof` and inspecting processes with `ps`
- Debugging Atlas authentication errors without exposing credentials
- Recording AI-assisted decisions, corrections, and debugging steps
- Verifying REST API behaviour and status-transition rules with Postman

## Conclusion

The complete Core workflow is now aligned from requirements through implementation and verification. The frontend and backend work together against the documented API, the backend remains authoritative for validation and lifecycle rules, and the integration suites provide repeatable evidence with 44/44 passing tests.

The most valuable lesson was that AI was most effective when used with persistent project context, small scoped tasks, and explicit validation. The next improvement would be to add automated frontend coverage and CI only as optional follow-on work, without weakening the clarity of the completed Core submission.

## What the Commit History Shows

The commit history reinforces several lessons from the project:

- Planning, design, and Cursor rules were committed before most application features, which reduced implementation drift.
- Documentation corrections were committed separately from feature code, making AI review and human decisions visible.
- Backend features were delivered in small stages and manually verified before later validation and automated testing work.
- The testing strategy and testing rule were refined before the integration suites were added.
- Frontend features were also split into focused commits, followed by separate usability and error-message improvements rather than being treated as complete after the first generated UI.
- Prompt-history automation was added early, while the missing initial interaction was honestly backfilled later and marked as such.

A weakness in the history is that one initial scaffold commit message appears twice and some commit wording is inconsistent, such as `feat:(server)`. In a future project I would keep commit formatting consistent and check for duplicate commits before pushing. The history is still useful because it clearly shows the progression from planning to implementation, testing, refinement, and final documentation.
