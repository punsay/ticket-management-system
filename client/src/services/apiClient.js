import { FALLBACK_MESSAGES } from '../utils/errorMessages';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function createRequestError(message, { status, isNetworkError = false } = {}) {
  const error = new Error(message);
  error.status = status;
  error.isNetworkError = isNetworkError;
  return error;
}

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw createRequestError(FALLBACK_MESSAGES.network, { isNetworkError: true });
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw createRequestError(FALLBACK_MESSAGES.generic, { status: response.status });
  }

  if (!response.ok || !payload.success) {
    const message = payload.error?.message || FALLBACK_MESSAGES.generic;
    throw createRequestError(message, { status: response.status });
  }

  return payload.data;
}
