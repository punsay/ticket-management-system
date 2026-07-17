const User = require('../../server/src/models/user');
const Ticket = require('../../server/src/models/ticket');

const TEST_USERS = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'Requester',
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    role: 'Support Agent',
  },
  {
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    role: 'Support Agent',
  },
];

async function createTestUsers() {
  const users = await User.insertMany(TEST_USERS);

  return {
    alice: users[0],
    bob: users[1],
    carol: users[2],
  };
}

async function createTicketAtStatus(status, createdById) {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return Ticket.create({
    title: `Transition test ticket ${suffix}`,
    description: 'Fixture ticket for status transition integration tests.',
    priority: 'Medium',
    status,
    createdBy: createdById,
  });
}

module.exports = {
  createTestUsers,
  createTicketAtStatus,
};
