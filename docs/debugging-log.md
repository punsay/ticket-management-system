# Debugging Log

Chronological record of bugs encountered, investigation steps, root causes, and resolutions during development.

## Overview

This log records real issues encountered during development and how they were resolved.

## Issue Log

### Port 5000 already in use

**Status:** Resolved

The backend could not start on port `5000` because it was already being used by a macOS system service.

The backend port was changed to `5001`, and the health endpoint worked successfully.

### MongoDB Atlas authentication failure during seed run

**Status:** Resolved

The seed script failed with:

```text
bad auth: authentication failed
```

The MongoDB connection had worked earlier. The failure happened because the Atlas database-user password had been changed, but `MONGODB_URI` in `server/.env` still contained the old password.

## Investigation Notes

- Confirmed that the MongoDB connection had worked during the earlier connection task.
- Checked the Atlas database user and local environment configuration.
- Identified that the password in `MONGODB_URI` was outdated.

## Resolutions

Updated `MONGODB_URI` in `server/.env` with the current Atlas database-user password and ran the seed script again.

The seed completed successfully and created the expected users, tickets, and comments.

## Lessons Learned

When Atlas credentials change, the local environment configuration must also be updated. Authentication errors should be checked against recent credential changes before modifying working application code.
