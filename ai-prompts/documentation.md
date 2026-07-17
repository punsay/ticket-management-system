# Documentation Prompts

Selected documentation prompts from the full append-only Cursor history in `prompt-history/history.md`.

## Prompt 1 — Initialise lifecycle documentation

### Prompt summary

Create placeholders for requirements, design, API, testing, debugging, review, reflection, PR description, workflow, and Cursor-specific artifacts.

### AI response summary

Cursor created the documentation structure without application code or invented decisions.

### What I accepted

A complete lifecycle-documentation baseline.

### What I changed

Filenames and locations were later aligned with the updated assignment structure.

### What I rejected

Filling placeholders with unsupported project claims.

### Why

Documents needed to reflect confirmed and completed work.

---

## Prompt 2 — Complete requirements and Cursor workflow artifacts

### Prompt summary

Create and refine requirement IDs, project context, specification, tasks, acceptance criteria, and persistent Cursor rules.

### AI response summary

Cursor established traceable Core requirements and repository-wide guidance for scoped, task-by-task development.

### What I accepted

- FR, BR, VR, NFR, and AC traceability
- Persistent context reads
- Architecture and frontend rules
- Core-scope restrictions
- Concise reporting expectations

### What I changed

Rules and API documentation were aligned after contradiction reviews.

### What I rejected

Optional capabilities and duplicated guidance.

### Why

Persistent instructions should be clear, reusable, and internally consistent.

---

## Prompt 3 — Update documentation after implementation and testing

### Prompt summary

After each feature or test phase, update only the affected tracker, setup, validation, debugging, review, and test-result documents.

### AI response summary

Cursor progressively recorded backend implementation, Postman checks, integration-test setup and results, frontend completion, and UI refinements.

### What I accepted

- Documentation tied to actual implementation
- Commands and verification results
- Requirement/acceptance-criteria references
- Honest distinction between manual and automated evidence

### What I changed

Outdated trackers were reserved for final reconciliation against the completed repository.

### What I rejected

Claims of automated coverage before the tests existed.

### Why

Submission evidence must be accurate and reviewable.

---

## Prompt 4 — Align the repository with the assignment structure

### Prompt summary

Review the updated assignment structure and add or rename missing lifecycle artifacts without disrupting the working MERN layout.

### AI response summary

The repository added root lifecycle documents, database setup evidence, root integration tests, curated `ai-prompts/`, and Cursor-specific workflow artifacts.

### What I accepted

- Raw history in `prompt-history/history.md`
- Curated evidence in `ai-prompts/`
- Runtime source under `client/` and `server/`
- Setup/seed evidence under `database/`
- Integration tests under `tests/`

### What I changed

Existing documents were reused or renamed instead of duplicated.

### What I rejected

Moving all source files into one generic root `src/` folder.

### Why

The implemented MERN structure remains clearer while following the requested repository layout as closely as practical.

---

## Prompt 5 — Backfill the initial prompt-history setup

**Date:** 2026-07-17

### Prompt summary

Add the original prompt-history setup conversation to the end of the raw history because it occurred before the hooks existed.

### AI response summary

Cursor added a clearly labelled manually backfilled entry and documented the limitation in `prompt-history/README.md`.

### What I accepted

- Explicit capture method
- Approximate date with unavailable exact time stated
- Append-only placement
- Clear separation from automatically captured entries

### What I changed

Nothing in the earlier raw entries was rewritten.

### What I rejected

Presenting the backfilled entry as automatically captured.

### Why

The history should be complete without misrepresenting how the evidence was collected.
