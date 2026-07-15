const ticketService = require('../services/ticketService');

async function listTickets(req, res, next) {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
}

async function createTicket(req, res, next) {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

async function getTicket(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTicket(req, res, next) {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const comment = await ticketService.addComment(req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTickets,
  createTicket,
  getTicket,
  updateTicket,
  addComment,
};
