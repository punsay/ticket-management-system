# Seed Data

The executable seed script is located at:

`server/src/scripts/seed.js`

Run the seed script from the `server/` directory:

```bash
npm run seed
```

The script creates:

- 3 seeded users
- 6 sample tickets
- 5 comments

The sample data covers:

- Low, Medium, and High priorities
- Open, In Progress, Resolved, Closed, and Cancelled statuses
- assigned and unassigned tickets
- tickets created by different seeded users
- tickets with and without comments

The seed script uses upserts and can be run multiple times without creating duplicate seed records.

Local MongoDB setup and verification steps are documented in:

`database/setup-notes.md`
