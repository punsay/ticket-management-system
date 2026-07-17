const mongoose = require('mongoose');
const { connectDatabase } = require('../../server/src/config/database');

const TEST_MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/ticket_management_system_test';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = TEST_MONGODB_URI;

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoose.disconnect();
  }
});
