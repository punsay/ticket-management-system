# Code Review Prompts

Selected code-review prompts and decisions from the full append-only Cursor history.

## Review 1 — Cross-document implementation readiness

**Date:** 2026-07-13

### Prompt summary

Review project context, requirements, specification, acceptance criteria, tasks, design documents, API documentation, checklist, and Cursor rules. Report only blockers.

### AI response summary

The review found:

1. conflicting API error envelopes;
2. undefined behaviour for simultaneous search and status parameters;
3. frontend parsing guidance not fully aligned with the API envelope.

### What I accepted

All three findings.

### Changes made after review

- Standardised success and error response formats.
- Added an HTTP 400 combined-filter rule and exact message.
- Updated frontend service rules to consume `data` and `error.message`.

### Suggestions rejected

Optional features were not considered.

### Why

The review was limited to issues that blocked Core implementation.

---

## Review 2 — Backend architecture and database foundation

### Review focus

- Express structure
- Database configuration
- Mongoose models
- Seed data
- Local environment safety

### Positive observations

- Routes, controllers, services, and models have distinct responsibilities.
- MongoDB access is restricted to the backend.
- Zod, Mongoose, and service-level validation have separate purposes.
- Secrets are environment-based.
- Seed data is representative and repeatable.

### Changes made after review

- Corrected the database connection setup.
- Reorganised backend source files under `server/src/`.
- Updated local database instructions.
- Replaced a deprecated Mongoose option.

### Suggestions rejected or deferred

- Authentication
- Full user management
- Advanced role checks
- Docker and CI

### Why

These are optional Stretch capabilities.

---

## Review 3 — Backend feature APIs

### Review focus

- Seeded users
- Ticket CRUD
- Comments
- Search and filtering
- Status transitions

### Positive observations

- Controllers remain small.
- Business rules are implemented in services.
- Ticket references are populated appropriately.
- Comments are ordered oldest first.
- Search escapes regular-expression characters.
- Invalid transitions produce clear errors.

### Changes made after review

- Search/filter behaviour was documented precisely.
- Existing transition logic was verified instead of duplicated.
- Progress and Postman-validation documentation was updated.

### Remaining observations

- Automated state-machine integration tests are still required.
- Backend validation failure tests are recommended.
- Frontend error handling needs review after the UI is implemented.
- Final acceptance-criteria verification remains pending.

---

## Review principles used

- Compare implementation against the confirmed Core requirements.
- Review AI-generated changes before committing.
- Reject scope expansion.
- Prefer minimal fixes over rewrites.
- Keep review findings traceable to documentation and commits.
- Record both accepted and rejected AI suggestions.
