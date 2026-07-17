import { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateTicket } from '../services/ticketService';
import { ERROR_TITLES, resolveErrorMessage } from '../utils/errorMessages';
import { getNextStatuses } from '../utils/statusTransitions';
import InlineErrorAlert from './InlineErrorAlert';

function StatusChangeControl({ ticket, onStatusChanged }) {
  const [submitError, setSubmitError] = useState(null);
  const [submittingTo, setSubmittingTo] = useState(null);

  const nextStatuses = getNextStatuses(ticket.status);
  const isSubmitting = submittingTo !== null;

  useEffect(() => {
    setSubmitError(null);
    setSubmittingTo(null);
  }, [ticket._id, ticket.status, ticket.updatedAt]);

  async function handleStatusChange(nextStatus) {
    setSubmitError(null);
    setSubmittingTo(nextStatus);

    try {
      await updateTicket(ticket._id, { status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
      onStatusChanged?.();
    } catch (err) {
      setSubmitError(
        resolveErrorMessage(
          err,
          'Unable to change the ticket status. Please try again.'
        )
      );
    } finally {
      setSubmittingTo(null);
    }
  }

  return (
    <section aria-labelledby="status-change-heading">
      <h3 id="status-change-heading" className="text-sm font-medium text-gray-900">
        Change status
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Current status: <span className="font-medium text-gray-900">{ticket.status}</span>
      </p>

      {nextStatuses.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">
          This ticket cannot be moved to another status.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          {nextStatuses.map((nextStatus) => {
            const isLoading = submittingTo === nextStatus;

            return (
              <button
                key={nextStatus}
                type="button"
                onClick={() => handleStatusChange(nextStatus)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Updating...
                  </>
                ) : (
                  <>
                    Move to {nextStatus}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {submitError && (
        <div className="mt-4">
          <InlineErrorAlert
            title={ERROR_TITLES.statusChange}
            message={submitError}
            compact
          />
        </div>
      )}
    </section>
  );
}

export default StatusChangeControl;
