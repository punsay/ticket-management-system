const Ticket = require('../models/ticket');
const AppError = require('../utils/AppError');
const {
  isNonEmptyString,
  toRequestObject,
  assertObjectId,
} = require('./helpers');

const { PRIORITIES, STATUSES } = Ticket;

function validateCreateTicketInput(input) {
  const { title, description, priority, assignedTo, createdBy } =
    toRequestObject(input);

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

  assertObjectId(createdBy, 'Invalid user');

  if (assignedTo !== undefined && assignedTo !== null && assignedTo !== '') {
    assertObjectId(assignedTo, 'Assignee must be a support agent');
  }

  return {
    title: title.trim(),
    description: description.trim(),
    priority,
    assignedTo,
    createdBy,
  };
}

function validateUpdateTicketInput(input) {
  const { title, description, priority, assignedTo, status } =
    toRequestObject(input);

  const validated = {};

  if (title !== undefined) {
    if (!isNonEmptyString(title)) {
      throw new AppError('Title is required');
    }
    validated.title = title.trim();
  }

  if (description !== undefined) {
    if (!isNonEmptyString(description)) {
      throw new AppError('Description is required');
    }
    validated.description = description.trim();
  }

  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      throw new AppError('Invalid priority');
    }
    validated.priority = priority;
  }

  if (assignedTo !== undefined) {
    if (assignedTo !== null && assignedTo !== '') {
      assertObjectId(assignedTo, 'Assignee must be a support agent');
    }
    validated.assignedTo = assignedTo;
  }

  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      throw new AppError('Invalid status');
    }
    validated.status = status;
  }

  return validated;
}

module.exports = {
  validateCreateTicketInput,
  validateUpdateTicketInput,
};
