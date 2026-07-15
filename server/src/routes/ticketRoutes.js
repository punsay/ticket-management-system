const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.get('/tickets', ticketController.listTickets);
router.post('/tickets', ticketController.createTicket);
router.get('/tickets/:id', ticketController.getTicket);
router.put('/tickets/:id', ticketController.updateTicket);
router.post('/tickets/:id/comments', ticketController.addComment);

module.exports = router;
