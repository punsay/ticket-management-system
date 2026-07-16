# Schema and Initialization

This project uses MongoDB Community Edition with Mongoose.

The application schemas are defined in:

- `server/src/models/user.js`
- `server/src/models/ticket.js`
- `server/src/models/comment.js`

These Mongoose models define the fields, required values, enums, references, defaults, timestamps, and indexes used by the application.

MongoDB collections are created automatically when the application or seed script first writes data.

The database initialization and sample-data script is located at:

`server/src/scripts/seed.js`

Separate migration files are not required for the current Core implementation.
