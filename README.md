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

## Local Setup

### Prerequisites

- Node.js and npm
- MongoDB Community Edition
- MongoDB Compass (optional)

### 1. Start MongoDB

```bash
brew services start mongodb-community
```

### 2. Configure the backend

Copy the environment example:

```bash
cd server
cp .env.example .env
```

Set the local database URI in `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ticket_management_system
PORT=5001
```

### 3. Install dependencies and seed the database

```bash
npm install
npm run seed
```

The seed script creates the local database and inserts three users, six tickets, and five comments.

### 4. Run the application

Start the backend from `server/`:

```bash
npm run dev
```

Start the frontend from `client/`:

```bash
npm install
npm run dev
```

### 5. Verify the local database

In MongoDB Compass, connect using:

```text
mongodb://127.0.0.1:27017/
```

Open the `ticket_management_system` database and verify the `users`, `tickets`, and `comments` collections.

### 6. Stop MongoDB

```bash
brew services stop mongodb-community
```

See [`database/setup-notes.md`](database/setup-notes.md) for detailed database setup and troubleshooting notes.
