# Planning Prompts

Selected planning prompts from the full append-only Cursor history in `prompt-history/history.md`.

## Prompt 1 — Create the repository documentation structure

**Date:** 2026-07-11

### Prompt summary

Create the lifecycle-documentation files, Cursor workflow folder, root configuration files, `.gitignore`, and `.env.example` before writing application code.

### AI response summary

Cursor created the requested documentation scaffold and explained the purpose of each file.

### What I accepted

- Documentation-first workflow
- Separate general and Cursor-specific artifacts
- Safe environment placeholders
- No application code

### What I changed

A generated code-review filename containing repeated words was corrected during cleanup.

### What I rejected

Generated requirements, design decisions, and application code at this stage.

### Why

The repository needed a clear workflow foundation before analysis and implementation.

---

## Prompt 2 — Establish persistent project context

**Date:** 2026-07-12

### Prompt summary

Complete `tool-specific/cursor-workflow/project-context.md` with the project purpose, users, Core scope, stack, constraints, assumptions, exclusions, and success criteria.

### AI response summary

Cursor created a persistent context document and separated unresolved decisions from confirmed requirements.

### What I accepted

- Context-first development
- Core and out-of-scope boundaries
- Behaviour-focused documentation
- Explicit unresolved decisions

### What I changed

The context was later refined to keep only User, Ticket, and Comment as Core entities and to include the exact status transitions.

### What I rejected

Unsupported assumptions about authentication, deletion, search behaviour, and implementation structure.

### Why

Future prompts needed stable, confirmed project context rather than AI-invented decisions.

---

## Prompt 3 — Create and simplify the Core task plan

**Date:** 2026-07-13

### Prompt summary

Create an ordered Core-only plan covering setup, backend, database, APIs, tests, frontend, and final documentation, then simplify it into checkboxes that reflect actual progress.

### AI response summary

Cursor first produced a detailed traceable plan, then replaced it with a smaller progress-based checklist.

### What I accepted

- Ordered delivery phases
- Requirement and acceptance-criteria traceability
- Small task boundaries
- Simple progress checkboxes

### What I changed

Task completion was updated after each implemented and verified phase.

### What I rejected

Optional features and task-management detail that did not help the one-week Core project.

### Why

The task file needed to remain practical and accurately represent repository progress.

---

## Prompt 4 — Review final documentation readiness

**Date:** 2026-07-17

### Prompt summary

After completing coding, compare the project trackers and assignment requirements, identify outdated documentation, and create an ordered final-documentation plan without changing application code.

### AI response summary

The review identified final lifecycle artifacts, README verification, prompt curation, persistence checks, repository hygiene, and tracker reconciliation as the remaining work.

### What I accepted

- Evidence-based completion only
- Documentation and verification before submission
- Separate raw history and curated prompt evidence

### What I changed

Outdated checklist items were reserved for reconciliation against actual implementation and test evidence.

### What I rejected

Marking incomplete or unverified items as complete automatically.

### Why

Final submission documents must remain honest and traceable to the repository.
