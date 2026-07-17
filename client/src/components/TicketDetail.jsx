import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Pencil,
  UserRound,
} from 'lucide-react';
import { getTicketById } from '../services/ticketService';
import {
  ERROR_TITLES,
  getTicketDetailErrorMessage,
  getTicketRefreshErrorMessage,
} from '../utils/errorMessages';
import { formatDateTime } from '../utils/formatDate';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import InlineErrorAlert from './InlineErrorAlert';
import StatusChangeControl from './StatusChangeControl';
import UpdateTicketForm from './UpdateTicketForm';

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

function DetailBadge({ label, className }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function DetailField({ label, children }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

function TicketDetail({ ticketId, onBack, onTicketUpdated }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshError, setRefreshError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editSectionRef = useRef(null);

  async function loadTicket() {
    setLoading(true);
    setError(null);

    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      setTicket(null);
      setError(getTicketDetailErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function refreshTicket({ closeEditForm = false } = {}) {
    setRefreshError(null);

    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
      if (closeEditForm) {
        setIsEditing(false);
      }
      onTicketUpdated?.();
    } catch (err) {
      setRefreshError(getTicketRefreshErrorMessage(err));
    }
  }

  function handleTicketUpdated() {
    refreshTicket({ closeEditForm: true });
  }

  function handleStatusChanged() {
    refreshTicket();
  }

  function handleCommentAdded() {
    refreshTicket();
  }

  useEffect(() => {
    setIsEditing(false);
    setRefreshError(null);
    loadTicket();
  }, [ticketId]);

  useEffect(() => {
    if (isEditing && editSectionRef.current) {
      editSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isEditing]);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to tickets
      </button>

      {loading && (
        <div
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-16 text-sm text-gray-500"
          aria-live="polite"
        >
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Loading ticket...
        </div>
      )}

      {!loading && error && (
        <InlineErrorAlert
          title={ERROR_TITLES.ticketDetail}
          message={error}
          onRetry={loadTicket}
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-red-100"
          >
            Back to tickets
          </button>
        </InlineErrorAlert>
      )}

      {!loading && !error && ticket && (
        <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {refreshError ? (
            <div className="border-b border-red-200 bg-red-50 px-6 py-4">
              <InlineErrorAlert
                title={ERROR_TITLES.ticketRefresh}
                message={refreshError}
                onRetry={() => refreshTicket()}
                compact
                borderless
              />
            </div>
          ) : null}
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {ticket.title}
              </h2>
              <DetailBadge
                label={ticket.status}
                className={
                  STATUS_STYLES[ticket.status] ?? 'bg-gray-100 text-gray-800'
                }
              />
              <DetailBadge
                label={ticket.priority}
                className={
                  PRIORITY_STYLES[ticket.priority] ??
                  'bg-gray-100 text-gray-800'
                }
              />
            </div>
          </div>

          <div className="space-y-6 px-6 py-5">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">
                {ticket.description}
              </p>
            </div>

            <dl className="grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
              <DetailField label="Status">{ticket.status}</DetailField>
              <DetailField label="Assignee">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {ticket.assignedTo?.name ?? 'Unassigned'}
                </span>
              </DetailField>
              <DetailField label="Created by">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {ticket.createdBy?.name ?? 'Unknown'}
                </span>
              </DetailField>
              <DetailField label="Created">
                {formatDateTime(ticket.createdAt)}
              </DetailField>
              <DetailField label="Last updated">
                {formatDateTime(ticket.updatedAt)}
              </DetailField>
            </dl>

            <div className="border-t border-gray-200 pt-6">
              <StatusChangeControl
                ticket={ticket}
                onStatusChanged={handleStatusChanged}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  aria-expanded={false}
                  aria-controls="edit-ticket-section"
                  className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit ticket
                </button>
              )}

              {isEditing && (
                <div
                  ref={editSectionRef}
                  id="edit-ticket-section"
                  className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                >
                  <UpdateTicketForm
                    ticket={ticket}
                    onUpdated={handleTicketUpdated}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Comments
              </h3>
              <div className="mt-4">
                <CommentList comments={ticket.comments} />
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700">Add a comment</h4>
                <div className="mt-3">
                  <CommentForm
                    ticketId={ticket._id}
                    onCommentAdded={handleCommentAdded}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}

export default TicketDetail;
