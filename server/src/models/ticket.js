const mongoose = require('mongoose');

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: 'Title cannot be empty',
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: 'Description cannot be empty',
      },
    },
    priority: {
      type: String,
      required: true,
      enum: PRIORITIES,
    },
    status: {
      type: String,
      required: true,
      enum: STATUSES,
      default: 'Open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    collection: 'tickets',
    timestamps: true,
  }
);

ticketSchema.index({ status: 1 });
ticketSchema.index({ title: 'text', description: 'text' });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
module.exports.PRIORITIES = PRIORITIES;
module.exports.STATUSES = STATUSES;
