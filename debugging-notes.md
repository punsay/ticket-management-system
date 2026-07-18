# Debugging Notes

This file records the real issues encountered during development, how they were investigated, how AI assisted, and how each fix was validated.

## Issue 1 — Port 5000 already in use

### Problem

The backend could not start on port `5000` because the port was already being used by a macOS system service.

### How I Investigated

I checked the server startup error and confirmed that the application code was not the cause. The conflict was limited to the configured port.

### How AI Helped

AI helped interpret the port-conflict error and suggested using a different local development port instead of changing unrelated backend code.

### What I Validated

- The backend started successfully on port `5001`.
- The health endpoint returned the expected response.

### Final Fix

Changed the backend development port from `5000` to `5001`.

---

## Issue 2 — MongoDB Atlas authentication failure during seed run

### Problem

The seed script failed with:

```text
bad auth: authentication failed
```

The MongoDB connection had worked earlier, but the Atlas database-user password had since changed while `MONGODB_URI` in `server/.env` still contained the old password.

### How I Investigated

- Confirmed that the connection had worked during the earlier database task.
- Checked the Atlas database user and local environment configuration.
- Identified that the password in `MONGODB_URI` was outdated.

### How AI Helped

AI helped narrow the failure to credentials and environment configuration before considering application-code changes.

### What I Validated

- Updated credentials were used only in the local environment file.
- The seed script completed successfully.
- The expected users, tickets, and comments were created.

### Final Fix

Updated `MONGODB_URI` in `server/.env` with the current Atlas database-user password and reran the seed script.

### Lesson Learned

When database credentials change, local environment configuration must also be updated. Authentication failures should be checked against recent credential changes before modifying working application code.

---

## Issue 3 — Mongoose deprecation warnings during seed run

### Problem

The local seed script completed successfully but printed repeated warnings that the `new` option used with `findOneAndUpdate()` was deprecated.

### How I Investigated

- Confirmed that seeding still completed and inserted the expected data.
- Reviewed the three upsert helpers in `server/src/scripts/seed.js`.
- Identified `new: true` in the user, ticket, and comment `findOneAndUpdate()` options.

### How AI Helped

AI helped identify the current Mongoose replacement and recommended the minimal supported option change rather than rewriting the seed logic.

### What I Validated

- Removed the local database and ran `npm run seed` again.
- Seeded 3 users.
- Seeded 6 tickets and 5 comments.
- The seed completed successfully.
- The repeated deprecation warnings no longer appeared.

### Final Fix

Replaced:

```js
new: true
```

with:

```js
returnDocument: 'after'
```

### Lesson Learned

Successful output can still contain maintenance warnings. Warnings should be reviewed and resolved when the fix is small, safe, and supported by the current library API.

### Related Commit

- `fix(seed): replace deprecated mongoose option and document local database setup`
