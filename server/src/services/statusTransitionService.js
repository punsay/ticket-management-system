const AppError = require('../utils/AppError');

const ALLOWED_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

function validateTransition(fromStatus, toStatus) {
  const allowed = ALLOWED_TRANSITIONS[fromStatus] || [];

  if (!allowed.includes(toStatus)) {
    throw new AppError(`Cannot transition from ${fromStatus} to ${toStatus}`, 409);
  }
}

module.exports = {
  ALLOWED_TRANSITIONS,
  validateTransition,
};
