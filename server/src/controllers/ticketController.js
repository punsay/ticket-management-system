const ticketService = require('../services/ticketService');
const AppError = require('../utils/AppError');

async function listTickets(req, res, next) {
  try {
    const { search, status } = req.query;
    const hasSearch = typeof search === 'string' && search.trim().length > 0;
    const hasStatus = typeof status === 'string' && status.trim().length > 0;

    if (hasSearch && hasStatus) {
      throw new AppError('Use either search or status filter, not both.');
    }

    const tickets = await ticketService.getAllTickets({
      search: hasSearch ? search.trim() : undefined,
      status: hasStatus ? status.trim() : undefined,
    });

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
