const mongoose = require('mongoose');
const Ticket = require('../../server/src/models/ticket');
const app = require('../../server/src/app');
const { sendJson } = require('../helpers/http');
const { createTestUsers, createTicketAtStatus } = require('../helpers/fixtures');

describe('ticket and comment validation', () => {
  let users;

  beforeAll(async () => {
    users = await createTestUsers();
  });

  function validCreateBody(overrides = {}) {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return {
      title: `Validation test ticket ${suffix}`,
      description: 'Fixture description for validation integration tests.',
      priority: 'Medium',
      createdBy: users.alice._id.toString(),
      ...overrides,
    };
  }

  function nonExistentObjectId() {
    return new mongoose.Types.ObjectId().toString();
  }

  function assigneeId(ticket) {
    return ticket.assignedTo ? ticket.assignedTo._id : null;
  }

  async function expectValidationError(method, url, body, expectedMessage) {
    const response = await sendJson(app, method, url, body);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe(expectedMessage);
    expect(response.body.error.stack).toBeUndefined();

    return response;
  }

  async function expectTicketNotFound(method, url, body) {
    const response = await sendJson(app, method, url, body);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Ticket not found');
    expect(response.body.error.stack).toBeUndefined();

    return response;
  }

  async function fetchTicket(ticketId) {
    const response = await sendJson(app, 'get', `/api/tickets/${ticketId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    return response.body.data;
  }

  async function expectTicketUnchanged(ticketId, before) {
    const after = await fetchTicket(ticketId);

    expect(after.title).toBe(before.title);
    expect(after.description).toBe(before.description);
    expect(after.priority).toBe(before.priority);
    expect(after.status).toBe(before.status);
    expect(assigneeId(after)).toBe(assigneeId(before));
  }

  async function expectNoTicketCreated(action) {
    const beforeCount = await Ticket.countDocuments();

    await action();

    const afterCount = await Ticket.countDocuments();
    expect(afterCount).toBe(beforeCount);
  }

  async function expectNoCommentCreated(ticketId, action) {
    const before = await fetchTicket(ticketId);
    const beforeCount = before.comments.length;

    await action();

    const after = await fetchTicket(ticketId);
    expect(after.comments.length).toBe(beforeCount);
  }

  describe('ticket create validation', () => {
    it('rejects missing title with 400 and does not create a ticket', async () => {
      const body = validCreateBody();
      delete body.title;

      await expectNoTicketCreated(async () => {
        await expectValidationError('post', '/api/tickets', body, 'Title is required');
      });
    });

    it('rejects empty title with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          validCreateBody({ title: '   ' }),
          'Title is required'
        );
      });
    });

    it('rejects missing description with 400 and does not create a ticket', async () => {
      const body = validCreateBody();
      delete body.description;

      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          body,
          'Description is required'
        );
      });
    });

    it('rejects empty description with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          validCreateBody({ description: '' }),
          'Description is required'
        );
      });
    });

    it('rejects invalid priority with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          validCreateBody({ priority: 'Urgent' }),
          'Invalid priority'
        );
      });
    });

    it('rejects missing createdBy with 400 and does not create a ticket', async () => {
      const body = validCreateBody();
      delete body.createdBy;

      await expectNoTicketCreated(async () => {
        await expectValidationError('post', '/api/tickets', body, 'Invalid user');
      });
    });

    it('rejects malformed createdBy with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          validCreateBody({ createdBy: 'not-an-object-id' }),
          'Invalid user'
        );
      });
    });

    it('rejects non-existent createdBy with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          validCreateBody({ createdBy: nonExistentObjectId() }),
          'Invalid user'
        );
      });
    });

    it('rejects requester as assignee with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          validCreateBody({ assignedTo: users.alice._id.toString() }),
          'Assignee must be a support agent'
        );
      });
    });

    it('rejects malformed assignedTo with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError(
          'post',
          '/api/tickets',
          validCreateBody({ assignedTo: 'bad-id' }),
          'Assignee must be a support agent'
        );
      });
    });

    it('rejects array request body with 400 and does not create a ticket', async () => {
      await expectNoTicketCreated(async () => {
        await expectValidationError('post', '/api/tickets', [], 'Title is required');
      });
    });
  });

  describe('ticket create happy path', () => {
    it('creates a ticket without assignee with status Open', async () => {
      const body = validCreateBody();

      const response = await sendJson(app, 'post', '/api/tickets', body);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(body.title);
      expect(response.body.data.description).toBe(body.description);
      expect(response.body.data.priority).toBe('Medium');
      expect(response.body.data.status).toBe('Open');
      expect(response.body.data.assignedTo).toBeNull();
      expect(response.body.data.createdBy._id).toBe(users.alice._id.toString());

      const persisted = await fetchTicket(response.body.data._id);
      expect(persisted.status).toBe('Open');
      expect(persisted.assignedTo).toBeNull();
    });

    it('creates a ticket with a support-agent assignee', async () => {
      const body = validCreateBody({
        assignedTo: users.bob._id.toString(),
        priority: 'High',
      });

      const response = await sendJson(app, 'post', '/api/tickets', body);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('Open');
      expect(response.body.data.assignedTo._id).toBe(users.bob._id.toString());

      const persisted = await fetchTicket(response.body.data._id);
      expect(assigneeId(persisted)).toBe(users.bob._id.toString());
    });
  });

  describe('ticket update validation', () => {
    let ticket;
    let snapshot;

    beforeEach(async () => {
      ticket = await createTicketAtStatus('Open', users.alice._id);
      snapshot = await fetchTicket(ticket._id);
    });

    it('rejects empty title with 400 and leaves the ticket unchanged', async () => {
      await expectValidationError(
        'put',
        `/api/tickets/${ticket._id}`,
        { title: '   ' },
        'Title is required'
      );

      await expectTicketUnchanged(ticket._id, snapshot);
    });

    it('rejects empty description with 400 and leaves the ticket unchanged', async () => {
      await expectValidationError(
        'put',
        `/api/tickets/${ticket._id}`,
        { description: '' },
        'Description is required'
      );

      await expectTicketUnchanged(ticket._id, snapshot);
    });

    it('rejects invalid priority with 400 and leaves the ticket unchanged', async () => {
      await expectValidationError(
        'put',
        `/api/tickets/${ticket._id}`,
        { priority: 'Critical' },
        'Invalid priority'
      );

      await expectTicketUnchanged(ticket._id, snapshot);
    });

    it('rejects requester as assignee with 400 and leaves the ticket unchanged', async () => {
      await expectValidationError(
        'put',
        `/api/tickets/${ticket._id}`,
        { assignedTo: users.alice._id.toString() },
        'Assignee must be a support agent'
      );

      await expectTicketUnchanged(ticket._id, snapshot);
    });

    it('rejects unknown assignee with 400 and leaves the ticket unchanged', async () => {
      await expectValidationError(
        'put',
        `/api/tickets/${ticket._id}`,
        { assignedTo: nonExistentObjectId() },
        'Assignee must be a support agent'
      );

      await expectTicketUnchanged(ticket._id, snapshot);
    });

    it('returns 404 for malformed ticket id', async () => {
      await expectTicketNotFound('put', '/api/tickets/not-an-object-id', {
        title: 'Updated title',
      });
    });

    it('returns 404 for non-existent ticket id', async () => {
      await expectTicketNotFound('put', `/api/tickets/${nonExistentObjectId()}`, {
        title: 'Updated title',
      });
    });
  });

  describe('ticket update happy path', () => {
    it('updates ticket fields and persists changes', async () => {
      const ticket = await createTicketAtStatus('Open', users.alice._id);

      const response = await sendJson(app, 'put', `/api/tickets/${ticket._id}`, {
        title: 'Updated validation title',
        description: 'Updated validation description',
        priority: 'Low',
        assignedTo: users.carol._id.toString(),
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated validation title');
      expect(response.body.data.description).toBe('Updated validation description');
      expect(response.body.data.priority).toBe('Low');
      expect(response.body.data.assignedTo._id).toBe(users.carol._id.toString());

      const persisted = await fetchTicket(ticket._id);
      expect(persisted.title).toBe('Updated validation title');
      expect(persisted.description).toBe('Updated validation description');
      expect(persisted.priority).toBe('Low');
      expect(assigneeId(persisted)).toBe(users.carol._id.toString());
    });
  });

  describe('comment create validation', () => {
    let ticket;

    beforeEach(async () => {
      ticket = await createTicketAtStatus('Open', users.alice._id);
    });

    it('creates a comment with valid message and createdBy', async () => {
      const response = await sendJson(
        app,
        'post',
        `/api/tickets/${ticket._id}/comments`,
        {
          message: 'Valid integration test comment.',
          createdBy: users.bob._id.toString(),
        }
      );

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Valid integration test comment.');
      expect(response.body.data.createdBy._id).toBe(users.bob._id.toString());

      const persisted = await fetchTicket(ticket._id);
      expect(persisted.comments).toHaveLength(1);
      expect(persisted.comments[0].message).toBe('Valid integration test comment.');
      expect(persisted.comments[0].createdBy._id).toBe(users.bob._id.toString());
    });

    it('rejects missing message with 400 and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectValidationError(
          'post',
          `/api/tickets/${ticket._id}/comments`,
          { createdBy: users.bob._id.toString() },
          'Message is required'
        );
      });
    });

    it('rejects empty message with 400 and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectValidationError(
          'post',
          `/api/tickets/${ticket._id}/comments`,
          {
            message: '   ',
            createdBy: users.bob._id.toString(),
          },
          'Message is required'
        );
      });
    });

    it('rejects missing createdBy with 400 and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectValidationError(
          'post',
          `/api/tickets/${ticket._id}/comments`,
          { message: 'Missing creator comment.' },
          'Invalid user'
        );
      });
    });

    it('rejects malformed createdBy with 400 and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectValidationError(
          'post',
          `/api/tickets/${ticket._id}/comments`,
          {
            message: 'Malformed creator comment.',
            createdBy: 'bad-id',
          },
          'Invalid user'
        );
      });
    });

    it('rejects non-existent createdBy with 400 and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectValidationError(
          'post',
          `/api/tickets/${ticket._id}/comments`,
          {
            message: 'Unknown creator comment.',
            createdBy: nonExistentObjectId(),
          },
          'Invalid user'
        );
      });
    });

    it('returns 404 for malformed ticket id and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectTicketNotFound('post', '/api/tickets/not-an-object-id/comments', {
          message: 'Comment on missing ticket.',
          createdBy: users.bob._id.toString(),
        });
      });
    });

    it('returns 404 for non-existent ticket id and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectTicketNotFound(
          'post',
          `/api/tickets/${nonExistentObjectId()}/comments`,
          {
            message: 'Comment on missing ticket.',
            createdBy: users.bob._id.toString(),
          }
        );
      });
    });

    it('rejects array request body with 400 and does not create a comment', async () => {
      await expectNoCommentCreated(ticket._id, async () => {
        await expectValidationError(
          'post',
          `/api/tickets/${ticket._id}/comments`,
          [],
          'Message is required'
        );
      });
    });
  });
});
