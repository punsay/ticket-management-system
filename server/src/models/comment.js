const mongoose = require('mongoose');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

const commentSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: 'Message cannot be empty',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    collection: 'comments',
    timestamps: { createdAt: true, updatedAt: false },
  }
);

commentSchema.index({ ticketId: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
