import { apiRequest } from './apiClient';

export function getTickets() {
  return apiRequest('/tickets');
}

export function getTicketById(id) {
  return apiRequest(`/tickets/${id}`);
}
