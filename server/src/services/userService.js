const mongoose = require('mongoose');
const User = require('../models/user');

async function getAllUsers() {
  return User.find({}, '_id name email role').sort({ name: 1 }).lean();
}

async function findUserById(id) {
  if (!id || !mongoose.isValidObjectId(id)) {
    return null;
  }

  return User.findById(id).lean();
}

module.exports = {
  getAllUsers,
  findUserById,
};
