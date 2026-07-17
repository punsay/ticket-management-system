export const FALLBACK_MESSAGES = {
  generic: 'Unable to complete the request. Please try again.',
  network:
    'Unable to connect to the server. Check that the backend is running and try again.',
};

const GENERIC_API_MESSAGES = new Set([
  'Something went wrong',
  'Something went wrong. Please try again.',
  FALLBACK_MESSAGES.generic,
]);

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

export function getTicketListErrorMessage(error, { search = '', status = '' } = {}) {
  if (search) {
    return resolveErrorMessage(
      error,
      'Unable to search tickets. Check your connection and try again.'
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
