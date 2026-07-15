# Support Ticket Management System

A small MERN application for creating, assigning, tracking, commenting on, searching, and progressing internal support tickets through a controlled status lifecycle.

## Current Status

Planning and specification are complete. System design and implementation are in progress.

## Technology Stack

- React
- JavaScript
- Tailwind CSS
- Node.js
- Express
- MongoDB

## Project Documentation

- [Project context](tool-specific/cursor-workflow/project-context.md)
- [Requirement analysis](docs/requirement-analysis.md)
- [Acceptance criteria](tool-specific/cursor-workflow/acceptance-criteria.md)
- [Specification](tool-specific/cursor-workflow/spec.md)
- [Task plan](tool-specific/cursor-workflow/tasks.md)
- [Project checklist](docs/project-checklist.md)

## Setup

Setup instructions will be added after the client, server, database connection, and seed scripts are implemented.

## Database setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow your current IP address in Atlas Network Access.
4. Copy `server/.env.example` to `server/.env`.
5. Set `MONGODB_URI` using your Atlas connection string.
6. Run the seed script:

```bash
cd server
npm install
npm run seed