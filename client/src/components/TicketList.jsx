import { useEffect, useState } from 'react';
import {
  ChevronRight,
  Inbox,
  Loader2,
  Ticket,
} from 'lucide-react';
import InlineErrorAlert from './InlineErrorAlert';
import { getTickets } from '../services/ticketService';
import { getTicketListErrorMessage } from '../utils/errorMessages';
import { formatDateTime } from '../utils/formatDate';

const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-amber-100 text-amber-800',
  Low: 'bg-green-100 text-green-800',
};

const STATUS_STYLES = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-violet-100 text-violet-800',
  Resolved: 'bg-emerald-100 text-emerald-800',
  Closed: 'bg-gray-100 text-gray-800',
  Cancelled: 'bg-rose-100 text-rose-800',
};

function Badge({ label, className }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function getEmptyState(search, status) {
  if (search) {
    return {
      title: 'No matching tickets',
      message: `No tickets match "${search}". Try a different keyword.`,
    };
  }

  if (status) {
    return {
      title: 'No matching tickets',
      message: `No tickets with status "${status}".`,
    };
  }

  return {
    title: 'No tickets yet',
    message: 'Tickets will appear here once they are created.',
  };
}

function TicketList({ onSelectTicket, refreshKey = 0, search = '', status = '' }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadTickets() {
    setLoading(true);
    setError(null);

    try {
      const data = await getTickets({ search, status });
      setTickets(data);
    } catch (err) {
      setTickets([]);
      setError(getTicketListErrorMessage(err, { search, status }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [refreshKey, search, status]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-16 text-sm text-gray-500"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading tickets...
      </div>
    );
  }

  if (error) {
    return (
      <InlineErrorAlert
        title="Couldn't load tickets"
        message={error}
        onRetry={loadTickets}
      />
    );
  }

  if (tickets.length === 0) {
    const emptyState = getEmptyState(search, status);

    return (
      <div
        className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center"
        aria-live="polite"
      >
        <Inbox
          className="mx-auto h-10 w-10 text-gray-400"
          aria-hidden="true"
        />
        <h2 className="mt-4 text-base font-medium text-gray-900">
          {emptyState.title}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{emptyState.message}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {tickets.map((ticket) => (
        <li key={ticket._id}>
          <button
            type="button"
            onClick={() => onSelectTicket(ticket._id)}
            className="flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
          >
            <Ticket
              className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-medium text-gray-900">
                  {ticket.title}
                </h2>
                <Badge
                  label={ticket.status}
                  className={STATUS_STYLES[ticket.status] ?? 'bg-gray-100 text-gray-800'}
                />
                <Badge
                  label={ticket.priority}
                  className={
                    PRIORITY_STYLES[ticket.priority] ?? 'bg-gray-100 text-gray-800'
                  }
                />
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {ticket.description}
              </p>
              <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <div>
                  <dt className="sr-only">Assignee</dt>
                  <dd>
                    Assignee:{' '}
                    <span className="font-medium text-gray-700">
                      {ticket.assignedTo?.name ?? 'Unassigned'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Created by</dt>
                  <dd>
                    Created by:{' '}
                    <span className="font-medium text-gray-700">
                      {ticket.createdBy?.name ?? 'Unknown'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Updated</dt>
                  <dd>Updated {formatDateTime(ticket.updatedAt)}</dd>
                </div>
              </dl>
            </div>
            <ChevronRight
              className="mt-1 h-5 w-5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TicketList;
