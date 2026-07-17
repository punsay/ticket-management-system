import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { updateTicket } from '../services/ticketService';
import { getUsers } from '../services/userService';

const PRIORITIES = ['Low', 'Medium', 'High'];

function ticketToForm(ticket) {
  return {
    title: ticket.title ?? '',
    description: ticket.description ?? '',
    priority: ticket.priority ?? '',
    assignedTo: ticket.assignedTo?._id ?? '',
  };
}

function buildPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    assignedTo: form.assignedTo || null,
  };
}

function hasFormChanges(form, ticket) {
  const current = buildPayload(form);
  const original = buildPayload(ticketToForm(ticket));

  return (
    current.title !== original.title ||
    current.description !== original.description ||
    current.priority !== original.priority ||
    current.assignedTo !== original.assignedTo
  );
}

function UpdateTicketForm({ ticket, onUpdated, onCancel }) {
  const [form, setForm] = useState(() => ticketToForm(ticket));
  const [assignees, setAssignees] = useState([]);
  const [loadingAssignees, setLoadingAssignees] = useState(true);
  const [assigneeError, setAssigneeError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(ticketToForm(ticket));
    setFieldErrors({});
    setSubmitError(null);
  }, [ticket._id, ticket.updatedAt]);

  useEffect(() => {
    async function loadAssignees() {
      setLoadingAssignees(true);
      setAssigneeError(null);

      try {
        const users = await getUsers();
        const supportAgents = users.filter((user) => user.role === 'Support Agent');
        setAssignees(supportAgents);
      } catch (err) {
        setAssignees([]);
        setAssigneeError(err.message);
      } finally {
        setLoadingAssignees(false);
      }
    }

    loadAssignees();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: null }));
    setSubmitError(null);
  }

  function validateForm() {
    const errors = {};

    if (!form.title.trim()) {
      errors.title = 'Title is required.';
    }

    if (!form.description.trim()) {
      errors.description = 'Description is required.';
    }

    if (!form.priority) {
      errors.priority = 'Priority is required.';
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateForm();
    setFieldErrors(errors);
    setSubmitError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!hasFormChanges(form, ticket)) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildPayload(form);

      await updateTicket(ticket._id, payload);
      toast.success('Ticket updated');
      onUpdated();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = submitting || loadingAssignees || Boolean(assigneeError);

  return (
    <section aria-labelledby="update-ticket-heading">
      <h3 id="update-ticket-heading" className="text-sm font-medium text-gray-900">
        Update ticket
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Status is unchanged here. Assignee is optional.
      </p>

      <form className="mt-5 space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="update-ticket-title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="update-ticket-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            disabled={isDisabled}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'update-ticket-title-error' : undefined}
          />
          {fieldErrors.title && (
            <p id="update-ticket-title-error" className="mt-1 text-sm text-red-600" role="alert">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="update-ticket-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="update-ticket-description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            disabled={isDisabled}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={
              fieldErrors.description ? 'update-ticket-description-error' : undefined
            }
          />
          {fieldErrors.description && (
            <p
              id="update-ticket-description-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="update-ticket-priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="update-ticket-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              disabled={isDisabled}
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              aria-invalid={Boolean(fieldErrors.priority)}
              aria-describedby={
                fieldErrors.priority ? 'update-ticket-priority-error' : undefined
              }
            >
              <option value="">Select priority</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            {fieldErrors.priority && (
              <p
                id="update-ticket-priority-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {fieldErrors.priority}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="update-ticket-assignee"
              className="block text-sm font-medium text-gray-700"
            >
              Assignee <span className="font-normal text-gray-500">(optional)</span>
            </label>
            {loadingAssignees ? (
              <p
                id="update-ticket-assignee"
                className="mt-2 flex items-center gap-2 text-sm text-gray-500"
                aria-live="polite"
              >
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading assignees...
              </p>
            ) : assigneeError ? (
              <p
                id="update-ticket-assignee"
                className="mt-2 flex items-start gap-2 text-sm text-red-600"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {assigneeError}
              </p>
            ) : (
              <select
                id="update-ticket-assignee"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={isDisabled}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Unassigned</option>
                {assignees.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {submitError && (
          <div
            className="rounded-md border border-red-200 bg-red-50 p-3"
            role="alert"
            aria-live="polite"
          >
            <p className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {submitError}
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Updating ticket...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                Update ticket
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default UpdateTicketForm;
