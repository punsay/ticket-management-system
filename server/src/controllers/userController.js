const userService = require('../services/userService');

async function listUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
};
