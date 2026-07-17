const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toRequestObject(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  return input;
}

function assertObjectId(value, message) {
  if (typeof value !== 'string' || !mongoose.isValidObjectId(value)) {
    throw new AppError(message);
  }
}

module.exports = {
  isNonEmptyString,
  toRequestObject,
  assertObjectId,
};
