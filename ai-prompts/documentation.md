# Documentation Prompts

Selected documentation prompts from the full append-only Cursor history.

## Prompt 1 — Initialise lifecycle documentation

### Prompt summary

Create Markdown placeholders for requirements, design, API, testing, debugging, review, reflection, PR description, workflow, and Cursor-specific artifacts.

### AI response summary

Cursor created the initial documentation structure without application code.

### What I accepted

A complete lifecycle-documentation baseline.

### What I changed

Filenames and locations were later aligned more closely with the updated repository structure.

### What I rejected

Filling documents with invented project decisions before requirement analysis.

### Why

Documentation needed to reflect confirmed work rather than fabricated completeness.

---

## Prompt 2 — Complete requirement analysis

### Prompt summary

Document problem statement, goals, users, functional requirements, business rules, validation rules, non-functional requirements, errors, assumptions, exclusions, risks, and open decisions with traceable IDs.

### AI response summary

Cursor produced FR, BR, VR, and NFR sections and listed unresolved decisions.

### What I accepted

- Requirement IDs
- Explicit status state machine
- Seeded-user model
- Backend validation
- Persistence and error expectations
- Test requirements

### What I changed

Open decisions were resolved in later prompts and moved into a confirmed-decisions section.

### What I rejected

API endpoints, schema details, and UI components in the requirement document.

### Why

Requirement documentation should describe what the system must do.

---

## Prompt 3 — Complete Cursor workflow artifacts

### Prompt summary

Create and refine project context, specification, tasks, acceptance criteria, and rule documentation.

### AI response summary

Cursor created persistent context and repository-wide guardrails for scoped, task-by-task work.

### What I accepted

- Persistent context reads
- Core-scope restrictions
- Architecture rules
- Frontend rules
- Code-quality rules
- Concise output rules
- Traceability expectations

### What I changed

Rules and API documentation were aligned after a contradiction review.

### What I rejected

Rules that duplicated existing guidance or introduced optional features.

### Why

Persistent instructions should be concise and consistent.

---

## Prompt 4 — Update documents after each completed backend phase

### Prompt summary

After implementation and Postman validation, update only the documents affected by the completed task.

### AI response summary

Cursor progressively updated backend review, workflow, debugging, API progress, comments validation, search, transitions, and database setup records.

### What I accepted

Progressive documentation tied to actual implementation.

### What I changed

The PR description was framed as a final change summary because development occurred directly on the main branch rather than through an actual pull request.

### What I rejected

Claiming automated coverage where only manual Postman validation existed.

### Why

Submission documents must remain honest and evidence-based.

---

## Prompt 5 — Align with the updated repository structure

### Prompt summary

Review the updated assignment structure and identify missing or renamed lifecycle artifacts.

### AI response summary

The repository was aligned with additional root artifacts, database setup evidence, root tests, curated `ai-prompts/`, and Cursor-specific documents.

### What I accepted

- Keep raw hook history in `prompt-history/`
- Add curated lifecycle evidence under `ai-prompts/`
- Keep runtime Mongoose models under `server/src/models/`
- Use root `database/` for setup, initialization, and seed evidence
- Use root `tests/` for integration tests

### What I changed

Existing documents were reused or renamed where possible instead of creating unnecessary duplicate content.

### What I rejected

Moving all client/server source files into a generic root `src/`.

### Why

The existing MERN structure is clearer and still follows the required layout as closely as practical.
