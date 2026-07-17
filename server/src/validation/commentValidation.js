const AppError = require('../utils/AppError');
const {
  isNonEmptyString,
  toRequestObject,
  assertObjectId,
} = require('./helpers');

function validateCommentInput(input) {
  const { message, createdBy } = toRequestObject(input);

  if (!isNonEmptyString(message)) {
    throw new AppError('Message is required');
  }

  if (!createdBy) {
    throw new AppError('Invalid user');
  }

  assertObjectId(createdBy, 'Invalid user');

  return {
    message: message.trim(),
    createdBy,
  };
}

module.exports = {
  validateCommentInput,
};
