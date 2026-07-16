# Database Setup Notes

## Database Choice

The project uses MongoDB Community Edition for local development and Mongoose for database access.

The backend is the only application layer that connects to MongoDB.

## Local Database Details

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ticket_management_system
```

Database name:

```text
ticket_management_system
```

Collections created by the application and seed script:

- `users`
- `tickets`
- `comments`

## Install MongoDB on macOS

MongoDB Community Edition is installed through Homebrew.

```bash
brew tap mongodb/brew
brew trust mongodb/brew
brew install mongodb-community
```

The `brew trust mongodb/brew` step may be required when Homebrew treats the MongoDB tap as untrusted.

## Start MongoDB

```bash
brew services start mongodb-community
```

Verify the service:

```bash
brew services list
```

## Configure the Project

From the `server/` directory, copy the environment example:

```bash
cp .env.example .env
```

Set:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ticket_management_system
PORT=5001
```

Real secrets or private connection strings must not be committed.

## Seed the Database

From `server/`:

```bash
npm install
npm run seed
```

Expected output:

```text
Connected to MongoDB Local
Seeded 3 users
Seeded 6 tickets and 5 comments
Seed completed successfully
```

The seed script uses upserts, so it can be rerun without creating duplicate seed records.

## Verify in MongoDB Compass

Create a Compass connection using:

```text
mongodb://127.0.0.1:27017/
```

After connecting:

1. Refresh the database list.
2. Open `ticket_management_system`.
3. Verify the `users`, `tickets`, and `comments` collections.
4. Confirm the expected seeded records are present.

## Reset the Local Database

A reset is optional because the seed script is idempotent.

For a clean reset:

```bash
mongosh
```

Then run:

```javascript
use ticket_management_system
db.dropDatabase()
exit
```

Seed it again:

```bash
npm run seed
```

## Stop MongoDB

```bash
brew services stop mongodb-community
```

## Seed Warning Fix

The seed script originally used this deprecated `findOneAndUpdate()` option:

```js
new: true
```

It was replaced in the user, ticket, and comment upsert operations with:

```js
returnDocument: 'after'
```

The database was reset and seeded again to confirm that the expected data was created without the repeated Mongoose deprecation warnings.

## Schema and Initialization

- Mongoose models under `server/src/models/` define the database schema.
- `server/src/scripts/seed.js` provides repeatable initialization and sample data.
- Separate migration files are not required for the current Core MongoDB implementation.
