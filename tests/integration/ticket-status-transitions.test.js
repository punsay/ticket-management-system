const app = require('../../server/src/app');
const { sendJson } = require('../helpers/http');
const { createTestUsers, createTicketAtStatus } = require('../helpers/fixtures');

describe('ticket status transitions', () => {
  let users;

  beforeAll(async () => {
    users = await createTestUsers();
  });

  async function fetchTicketStatus(ticketId) {
    const response = await sendJson(app, 'get', `/api/tickets/${ticketId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    return response.body.data.status;
  }

  async function expectValidTransition(ticketId, toStatus) {
    const response = await sendJson(app, 'put', `/api/tickets/${ticketId}`, {
      status: toStatus,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe(toStatus);
    expect(response.body.error).toBeUndefined();

    const persistedStatus = await fetchTicketStatus(ticketId);
    expect(persistedStatus).toBe(toStatus);
  }

  async function expectInvalidTransition(ticketId, fromStatus, toStatus) {
    const response = await sendJson(app, 'put', `/api/tickets/${ticketId}`, {
      status: toStatus,
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe(
      `Cannot transition from ${fromStatus} to ${toStatus}`
    );
    expect(response.body.error.stack).toBeUndefined();

    const persistedStatus = await fetchTicketStatus(ticketId);
    expect(persistedStatus).toBe(fromStatus);
  }

  describe('valid transitions', () => {
    it('transitions Open → In Progress → Resolved → Closed on one ticket', async () => {
      const ticket = await createTicketAtStatus('Open', users.alice._id);

      await expectValidTransition(ticket._id, 'In Progress');
      await expectValidTransition(ticket._id, 'Resolved');
      await expectValidTransition(ticket._id, 'Closed');
    });

    it('transitions Open → Cancelled', async () => {
      const ticket = await createTicketAtStatus('Open', users.alice._id);

      await expectValidTransition(ticket._id, 'Cancelled');
    });

    it('transitions In Progress → Cancelled', async () => {
      const ticket = await createTicketAtStatus('In Progress', users.alice._id);

      await expectValidTransition(ticket._id, 'Cancelled');
    });
  });

  describe('invalid transitions', () => {
    it('rejects Open → Resolved', async () => {
      const ticket = await createTicketAtStatus('Open', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Open', 'Resolved');
    });

    it('rejects Open → Closed', async () => {
      const ticket = await createTicketAtStatus('Open', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Open', 'Closed');
    });

    it('allows no-op Open → Open with status unchanged', async () => {
      const ticket = await createTicketAtStatus('Open', users.alice._id);

      const response = await sendJson(app, 'put', `/api/tickets/${ticket._id}`, {
        status: 'Open',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('Open');

      const persistedStatus = await fetchTicketStatus(ticket._id);
      expect(persistedStatus).toBe('Open');
    });

    it('rejects In Progress → Open', async () => {
      const ticket = await createTicketAtStatus('In Progress', users.alice._id);

      await expectInvalidTransition(ticket._id, 'In Progress', 'Open');
    });

    it('rejects Resolved → Open', async () => {
      const ticket = await createTicketAtStatus('Resolved', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Resolved', 'Open');
    });

    it('rejects Resolved → In Progress', async () => {
      const ticket = await createTicketAtStatus('Resolved', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Resolved', 'In Progress');
    });

    it('rejects Closed → In Progress', async () => {
      const ticket = await createTicketAtStatus('Closed', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Closed', 'In Progress');
    });

    it('rejects Cancelled → Open', async () => {
      const ticket = await createTicketAtStatus('Cancelled', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Cancelled', 'Open');
    });

    it('rejects invalid status string with 400 and leaves status unchanged', async () => {
      const ticket = await createTicketAtStatus('Open', users.alice._id);

      const response = await sendJson(app, 'put', `/api/tickets/${ticket._id}`, {
        status: 'NotAStatus',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid status');
      expect(response.body.error.stack).toBeUndefined();

      const persistedStatus = await fetchTicketStatus(ticket._id);
      expect(persistedStatus).toBe('Open');
    });

    it('rejects further transitions from terminal Closed', async () => {
      const ticket = await createTicketAtStatus('Closed', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Closed', 'Cancelled');
    });

    it('rejects further transitions from terminal Cancelled', async () => {
      const ticket = await createTicketAtStatus('Cancelled', users.alice._id);

      await expectInvalidTransition(ticket._id, 'Cancelled', 'In Progress');
    });
  });
});
