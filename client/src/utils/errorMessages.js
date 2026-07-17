export const FALLBACK_MESSAGES = {
  generic: 'Unable to complete the request. Please try again.',
  network:
    'Unable to connect to the server. Check that the backend is running and try again.',
};

export const ERROR_TITLES = {
  ticketList: "Couldn't load tickets",
  ticketDetail: "Couldn't load ticket",
  ticketRefresh: "Couldn't refresh ticket",
  actingUsers: "Couldn't load acting users",
  assignees: "Couldn't load assignees",
  createTicket: "Couldn't create ticket",
  updateTicket: "Couldn't save changes",
  statusChange: "Couldn't change status",
  addComment: "Couldn't add comment",
};

const GENERIC_API_MESSAGES = new Set([
  'Something went wrong',
  'Something went wrong. Please try again.',
  FALLBACK_MESSAGES.generic,
]);

const NOT_FOUND_MESSAGES = new Set(['Ticket not found', 'Not found']);

export function resolveErrorMessage(error, contextFallback) {
  const raw = error?.message?.trim();

  if (error?.isNetworkError) {
    return FALLBACK_MESSAGES.network;
  }

  if (!raw || GENERIC_API_MESSAGES.has(raw)) {
    return contextFallback ?? FALLBACK_MESSAGES.generic;
  }

  return raw;
}

export function getTicketListLoadingMessage({ search = '', status = '' } = {}) {
  if (search) {
    return `Searching for "${search}"...`;
  }

  if (status) {
    return `Filtering by ${status}...`;
  }

  return 'Loading tickets...';
}

export function getTicketListErrorMessage(error, { search = '', status = '' } = {}) {
  if (search) {
    return resolveErrorMessage(
      error,
      `Unable to search tickets for "${search}". Check your connection and try again.`
    );
  }

  if (status) {
    return resolveErrorMessage(
      error,
      `Unable to filter tickets by "${status}". Check your connection and try again.`
    );
  }

  return resolveErrorMessage(
    error,
    'Unable to load tickets. Check your connection and try again.'
  );
}

export function getTicketDetailErrorMessage(error) {
  const raw = error?.message?.trim();

  if (error?.status === 404 || NOT_FOUND_MESSAGES.has(raw)) {
    return 'This ticket was not found. It may have been removed. Go back to the ticket list and try another ticket.';
  }

  return resolveErrorMessage(
    error,
    'Unable to load this ticket. Check your connection and try again.'
  );
}

export function getTicketRefreshErrorMessage(error) {
  return resolveErrorMessage(
    error,
    'Your last action may have succeeded, but the ticket could not be refreshed. Check your connection and try again.'
  );
}

export function getAssigneeLoadErrorMessage(error, { forCreate = true } = {}) {
  const fallback = forCreate
    ? 'Unable to load support agents. You can still create the ticket without an assignee.'
    : 'Unable to load support agents. You can still save other ticket changes.';

  return resolveErrorMessage(error, fallback);
}

export const VALIDATION_MESSAGES = {
  actingUserCreate:
    'Select an acting user in the header before creating a ticket.',
  actingUserComment:
    'Select an acting user in the header before adding a comment.',
  title: 'Enter a ticket title.',
  description: 'Enter a description.',
  priority: 'Select a priority.',
  comment: 'Enter a comment.',
};
