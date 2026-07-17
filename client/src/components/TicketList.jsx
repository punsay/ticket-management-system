import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ChevronRight,
  Inbox,
  Loader2,
  RefreshCw,
  Ticket,
} from 'lucide-react';
import { getTickets } from '../services/ticketService';
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

function TicketList({ onSelectTicket }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadTickets() {
    setLoading(true);
    setError(null);

    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      setTickets([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

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
      <div
        className="rounded-lg border border-red-200 bg-red-50 p-6"
        role="alert"
        aria-live="polite"
      >
        <p className="flex items-start gap-2 text-sm text-red-700">
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
        <button
          type="button"
          onClick={loadTickets}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-200 transition-colors hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
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
          No tickets yet
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Tickets will appear here once they are created.
        </p>
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
