import { apiRequest } from './apiClient';

export function getTickets() {
  return apiRequest('/tickets');
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
