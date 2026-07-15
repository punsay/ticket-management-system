# Reflection

Personal reflection on the development process, challenges faced, skills gained, and areas for improvement.

## Overview

This reflection is being updated throughout the project. So far, the planning, design, project setup, MongoDB Atlas connection, Mongoose models, and seed-data phases are complete.

## What Went Well

- Creating project context, requirements, acceptance criteria, design documents, and tasks before coding reduced ambiguity.
- Reviewing AI suggestions identified conflicts in API response formats and search/filter behaviour before implementation.
- Cursor rules made later prompts shorter while preserving project scope and coding conventions.
- Separating the work into small tasks made it easier to verify each change before continuing.
- The backend structure was corrected early so all application source code is consistently stored under `server/src/`.
- The MongoDB connection, models, and seed data were implemented and verified successfully.
- Prompt-history automation and meaningful commits provide a traceable development record.

## Challenges

- Some early AI-generated suggestions were more complex than necessary and needed simplification.
- The API specification and Cursor rules initially used conflicting response formats.
- Port `5000` was already used by a macOS service, so the backend was moved to port `5001`.
- A previously working MongoDB connection later failed during seeding because the Atlas database-user password had changed while the local `MONGODB_URI` still used the old password.
- It was necessary to distinguish between application problems, environment problems, and system processes before making changes.

## Skills Learned

- Writing clearer requirements and acceptance criteria before implementation
- Creating and refining persistent Cursor project rules
- Using a layered Express architecture
- Organizing backend source code consistently
- Connecting Mongoose to MongoDB Atlas through environment variables
- Designing Mongoose schemas with references, enums, timestamps, defaults, and indexes
- Creating seed scripts that can be run repeatedly without duplicates
- Diagnosing port conflicts with `lsof` and inspecting processes with `ps`
- Debugging Atlas authentication errors without exposing credentials
- Recording AI-assisted decisions, corrections, and debugging steps

## Conclusion

The project foundation is now stable. The planning documents, Cursor rules, React and Express setup, MongoDB Atlas connection, Mongoose models, and seed data are aligned and working.

The next major work is implementing backend APIs and business rules, followed by the frontend, integration tests, final code review, and completion of the project documentation. This reflection will be updated as those phases are completed.
