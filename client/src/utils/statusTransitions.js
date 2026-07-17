export const TICKET_STATUSES = [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
  'Cancelled',
];

const ALLOWED_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

export function getNextStatuses(currentStatus) {
  return ALLOWED_TRANSITIONS[currentStatus] ?? [];
}
