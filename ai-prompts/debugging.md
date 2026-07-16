# Debugging Prompts

Selected debugging prompts and corrections from the full append-only Cursor history.

## Issue 1 — Incorrect backend route import

### Context

During the MongoDB connection task, the server health route import was found to use the wrong relative path.

### AI assistance

Cursor identified and corrected the import while preserving the existing health endpoint.

### What I validated

- The server application loaded successfully.
- The health endpoint continued returning the standard success response.
- Database connection occurred before server startup.

### Final fix

Updated the import in `server/src/app.js`.

### Judgment applied

The fix was accepted because it was necessary for the explicitly requested health-endpoint check and did not expand the task scope.

---

## Issue 2 — MongoDB authentication failure

### Context

The seed command failed with an Atlas authentication error.

### AI assistance

AI helped narrow the issue to the local `MONGODB_URI` credentials rather than the seed logic.

### What I validated

- The local environment contained an outdated password.
- Correcting the local connection value restored database access.
- No credentials were committed.

### Final fix

Updated the local environment only and recorded the investigation in debugging documentation.

### Judgment applied

Secrets were not copied into prompts, documentation, or version control.

---

## Issue 3 — Deprecated Mongoose option

### Context

The seed script produced a deprecation warning because an update operation used `new: true`.

### AI assistance

AI recommended the modern option:

```js
returnDocument: 'after'
```

### What I validated

- The seed command still returned updated records.
- The warning no longer appeared.
- Repeatable seed behaviour was preserved.

### Final fix

Replaced the deprecated option and updated local database setup documentation.

---

## Issue 4 — API contract and Cursor-rule conflict

### Context

The API specification and active rules described different response shapes.

### AI assistance

A cross-document review found the conflict before more feature code was written.

### What I validated

The selected response shape could be used consistently by controllers, middleware, and frontend services.

### Final fix

Aligned the API specification and Cursor rules on:

- `success: true` with `data`;
- `success: false` with `error.message`.

### Judgment applied

One documented contract was selected rather than allowing each layer to interpret responses differently.

---

## Issue 5 — Status transition task already implemented

### Context

A later prompt asked Cursor to implement status-transition rules, but they had already been added during the ticket update task.

### AI assistance

Cursor inspected the existing service and update flow and reported that no duplicate implementation was needed.

### What I validated

Manual checks covered valid, invalid, backward, terminal, same-status, and invalid-value scenarios.

### Final fix

No code fix was required; only the task status and documentation were updated.

### Judgment applied

Avoided unnecessary code changes and recorded the sequencing issue as an AI-workflow correction.
