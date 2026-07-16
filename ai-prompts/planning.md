# Planning Prompts

Selected planning prompts from the full append-only Cursor history. The raw record remains in `prompt-history/history.md`.

## Prompt 1 — Create the initial repository documentation structure

**Date:** 2026-07-11

### Prompt summary

Create the documentation folders, Cursor workflow files, root configuration files, `.gitignore`, and `.env.example` before writing application code. Add only titles, purposes, and placeholder headings.

### AI response summary

Cursor created the requested documentation scaffold and explained the purpose of each file.

### What I accepted

- Documentation-first workflow
- Separate general documentation and Cursor-specific workflow folders
- Safe `.env.example` placeholders
- MERN-focused `.gitignore`

### What I changed

A generated code-review filename contained repeated words and was corrected later during repository cleanup.

### What I rejected

Application code and generated requirements at this stage.

### Why

The goal was to establish the workflow and repository structure before analysis or implementation.

---

## Prompt 2 — Establish persistent project context

**Date:** 2026-07-12

### Prompt summary

Complete `tool-specific/cursor-workflow/project-context.md` with the project overview, business objective, target users, entities, Core features, stack, principles, constraints, assumptions, exclusions, and success criteria. Avoid implementation details.

### AI response summary

Cursor created a persistent context document and listed unresolved decisions separately.

### What I accepted

- Context-first development
- Clear Core and out-of-scope boundaries
- A separate list of decisions requiring confirmation
- Behaviour-focused documentation

### What I changed

The initial context was refined later to use only User, Ticket, and Comment as Core entities and to include the exact ticket transition rules.

### What I rejected

Unsupported decisions about authentication, deletion, search behaviour, and implementation structure.

### Why

Those decisions needed to come from confirmed project requirements rather than AI assumptions.

---

## Prompt 3 — Create the ordered Core task plan

**Date:** 2026-07-13

### Prompt summary

Create a practical Core-only task list covering setup, backend, MongoDB, models, seed data, APIs, comments, search/filtering, status validation, tests, frontend, and final documentation.

### AI response summary

Cursor initially created a detailed 30-task plan linked to requirement and acceptance-criteria IDs.

### What I accepted

- Ordered delivery phases
- Traceability to requirements and acceptance criteria
- Separation of implementation, testing, frontend, and documentation work

### What I changed

The detailed task tables were later simplified into Markdown checkboxes reflecting actual project progress.

### What I rejected

Optional features and unnecessary task-management complexity.

### Why

A smaller checklist was easier to maintain during a one-week Core project.

---

## Prompt 4 — Simplify tasks to match real progress

**Date:** 2026-07-13

### Prompt summary

Mark completed workflow and analysis tasks, then organise the remaining work into design, rules, setup, backend, testing, frontend, and final documentation sections.

### AI response summary

Cursor replaced the large task tables with simple checkbox groups.

### What I accepted

- Progress-based task tracking
- Simple checkboxes
- Core-only categories
- Separation of completed and remaining work

### What I changed

Task completion was updated incrementally after each implementation phase.

### What I rejected

Keeping the larger artificial task structure after it no longer reflected actual work.

### Why

The task file should represent the real state of the repository, not only the original plan.
