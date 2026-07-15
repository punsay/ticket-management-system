const User = require('../models/user');

async function getAllUsers() {
  return User.find({}, '_id name email role').sort({ name: 1 }).lean();
}

module.exports = {
  getAllUsers,
};
