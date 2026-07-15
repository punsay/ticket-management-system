const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const Comment = require('../models/comment');
const { PRIORITIES, STATUSES } = Ticket;
const userService = require('./userService');
const statusTransitionService = require('./statusTransitionService');
const AppError = require('../utils/AppError');

const TICKET_POPULATE = [
  { path: 'assignedTo', select: '_id name' },
  { path: 'createdBy', select: '_id name' },
];

const COMMENT_POPULATE = { path: 'createdBy', select: '_id name' };

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getAllTickets(filters = {}) {
  const { search, status } = filters;
  const query = {};

  if (search) {
    const pattern = escapeRegex(search);
    query.$or = [
      { title: { $regex: pattern, $options: 'i' } },
      { description: { $regex: pattern, $options: 'i' } },
    ];
  } else if (status) {
    if (!STATUSES.includes(status)) {
      throw new AppError('Invalid status');
    }
    query.status = status;
  }

  return Ticket.find(query)
    .populate(TICKET_POPULATE)
    .sort({ createdAt: -1 })
    .lean();
}

async function getTicketById(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Ticket not found', 404);
  }

  const ticket = await Ticket.findById(id).populate(TICKET_POPULATE).lean();
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  const comments = await Comment.find({ ticketId: id })
    .populate(COMMENT_POPULATE)
    .sort({ createdAt: 1 })
    .lean();

  return {
    ...ticket,
    comments,
  };
}

async function createTicket(input) {
  const { title, description, priority, assignedTo, createdBy } = input;

  if (!isNonEmptyString(title)) {
    throw new AppError('Title is required');
  }

  if (!isNonEmptyString(description)) {
    throw new AppError('Description is required');
  }

  if (!priority || !PRIORITIES.includes(priority)) {
    throw new AppError('Invalid priority');
  }

  if (!createdBy) {
    throw new AppError('Invalid user');
  }

  const creator = await userService.findUserById(createdBy);
  if (!creator) {
    throw new AppError('Invalid user');
  }

  let assigneeId = null;
  if (assignedTo !== undefined && assignedTo !== null && assignedTo !== '') {
    const assignee = await userService.findUserById(assignedTo);
    if (!assignee || assignee.role !== 'Support Agent') {
      throw new AppError('Assignee must be a support agent');
    }
    assigneeId = assignee._id;
  }

  const ticket = await Ticket.create({
    title: title.trim(),
    description: description.trim(),
    priority,
    status: 'Open',
    assignedTo: assigneeId,
    createdBy: creator._id,
  });

  return ticket.populate(TICKET_POPULATE);
}

async function updateTicket(id, input) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Ticket not found', 404);
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  const { title, description, priority, assignedTo, status } = input;

  if (title !== undefined) {
    if (!isNonEmptyString(title)) {
      throw new AppError('Title is required');
    }
    ticket.title = title.trim();
  }

  if (description !== undefined) {
    if (!isNonEmptyString(description)) {
      throw new AppError('Description is required');
    }
    ticket.description = description.trim();
  }

  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      throw new AppError('Invalid priority');
    }
    ticket.priority = priority;
  }

  if (assignedTo !== undefined) {
    if (assignedTo === null || assignedTo === '') {
      ticket.assignedTo = null;
    } else {
      const assignee = await userService.findUserById(assignedTo);
      if (!assignee || assignee.role !== 'Support Agent') {
        throw new AppError('Assignee must be a support agent');
      }
      ticket.assignedTo = assignee._id;
    }
  }

  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      throw new AppError('Invalid status');
    }

    if (status !== ticket.status) {
      statusTransitionService.validateTransition(ticket.status, status);
      ticket.status = status;
    }
  }

  await ticket.save();
  return ticket.populate(TICKET_POPULATE);
}

async function addComment(ticketId, input) {
  if (!mongoose.isValidObjectId(ticketId)) {
    throw new AppError('Ticket not found', 404);
  }

  const ticket = await Ticket.findById(ticketId).select('_id');
  if (!ticket) {
    throw new AppError('Ticket not found', 404);
  }

  const { message, createdBy } = input;

  if (!isNonEmptyString(message)) {
    throw new AppError('Message is required');
  }

  if (!createdBy) {
    throw new AppError('Invalid user');
  }

  const creator = await userService.findUserById(createdBy);
  if (!creator) {
    throw new AppError('Invalid user');
  }

  const comment = await Comment.create({
    ticketId: ticket._id,
    message: message.trim(),
    createdBy: creator._id,
  });

  return comment.populate(COMMENT_POPULATE);
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addComment,
};
