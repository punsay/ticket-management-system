require('dotenv').config();

const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');
const User = require('../models/user');
const Ticket = require('../models/ticket');
const Comment = require('../models/comment');

const SEED_USERS = [
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

const SEED_TICKETS = [
  {
    title: 'Cannot access email on mobile',
    description: 'Outlook app on iPhone shows authentication errors since yesterday.',
    priority: 'High',
    status: 'Open',
    createdByEmail: 'alice.johnson@example.com',
    assignedToEmail: 'bob.smith@example.com',
    comments: [],
  },
  {
    title: 'Request new monitor',
    description: 'Current display flickers intermittently; need a replacement 27-inch monitor.',
    priority: 'Low',
    status: 'In Progress',
    createdByEmail: 'bob.smith@example.com',
    assignedToEmail: 'carol.davis@example.com',
    comments: [
      {
        message: 'Approved a standard 27-inch monitor from inventory.',
        createdByEmail: 'carol.davis@example.com',
      },
    ],
  },
  {
    title: 'VPN connection drops frequently',
    description: 'Remote VPN disconnects every 20–30 minutes during video calls.',
    priority: 'Medium',
    status: 'Resolved',
    createdByEmail: 'alice.johnson@example.com',
    assignedToEmail: 'bob.smith@example.com',
    comments: [
      {
        message: 'Please try updating the VPN client to the latest version.',
        createdByEmail: 'bob.smith@example.com',
      },
      {
        message: 'Updated the client; disconnects stopped after the change.',
        createdByEmail: 'alice.johnson@example.com',
      },
      {
        message: 'Marked resolved. Reopen if the issue returns.',
        createdByEmail: 'bob.smith@example.com',
      },
    ],
  },
  {
    title: 'Password reset needed',
    description: 'Locked out of the HR portal after too many failed login attempts.',
    priority: 'Medium',
    status: 'Closed',
    createdByEmail: 'alice.johnson@example.com',
    assignedToEmail: 'carol.davis@example.com',
    comments: [
      {
        message: 'Temporary password sent via secure channel.',
        createdByEmail: 'carol.davis@example.com',
      },
    ],
  },
  {
    title: 'Cancel duplicate software license',
    description: 'Team was charged twice for the same design tool subscription.',
    priority: 'Low',
    status: 'Cancelled',
    createdByEmail: 'carol.davis@example.com',
    assignedToEmail: null,
    comments: [],
  },
  {
    title: 'Office printer not responding',
    description: 'Shared printer on the third floor shows offline for all users.',
    priority: 'Medium',
    status: 'Open',
    createdByEmail: 'bob.smith@example.com',
    assignedToEmail: null,
    comments: [],
  },
];

async function upsertUser(userData) {
  return User.findOneAndUpdate(
    { email: userData.email },
    { $setOnInsert: userData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function upsertTicket(ticketData, usersByEmail) {
  const createdBy = usersByEmail.get(ticketData.createdByEmail);
  const assignedTo = ticketData.assignedToEmail
    ? usersByEmail.get(ticketData.assignedToEmail)
    : null;

  return Ticket.findOneAndUpdate(
    { title: ticketData.title },
    {
      $setOnInsert: {
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        status: ticketData.status,
        createdBy: createdBy._id,
        assignedTo: assignedTo ? assignedTo._id : null,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function upsertComment(ticketId, commentData, usersByEmail) {
  const createdBy = usersByEmail.get(commentData.createdByEmail);

  return Comment.findOneAndUpdate(
    { ticketId, message: commentData.message },
    {
      $setOnInsert: {
        ticketId,
        message: commentData.message,
        createdBy: createdBy._id,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await connectDatabase();

  const usersByEmail = new Map();

  for (const userData of SEED_USERS) {
    const user = await upsertUser(userData);
    usersByEmail.set(user.email, user);
  }

  console.log(`Seeded ${usersByEmail.size} users`);

  let ticketCount = 0;
  let commentCount = 0;

  for (const ticketData of SEED_TICKETS) {
    const ticket = await upsertTicket(ticketData, usersByEmail);
    ticketCount += 1;

    for (const commentData of ticketData.comments) {
      await upsertComment(ticket._id, commentData, usersByEmail);
      commentCount += 1;
    }
  }

  console.log(`Seeded ${ticketCount} tickets and ${commentCount} comments`);
}

seed()
  .then(async () => {
    await mongoose.disconnect();
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
