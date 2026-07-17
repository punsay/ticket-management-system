import { apiRequest } from './apiClient';

export function getTickets({ search, status } = {}) {
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  if (status) {
    params.set('status', status);
  }

  const query = params.toString();

  return apiRequest(`/tickets${query ? `?${query}` : ''}`);
}

export function getTicketById(id) {
  return apiRequest(`/tickets/${id}`);
}

export function createTicket(ticket) {
  return apiRequest('/tickets', {
    method: 'POST',
    body: JSON.stringify(ticket),
  });
}

export function updateTicket(id, updates) {
  return apiRequest(`/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function addComment(ticketId, comment) {
  return apiRequest(`/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify(comment),
  });
}
