import { useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useActingUser } from '../context/ActingUserContext';
import { createTicket } from '../services/ticketService';
import { getUsers } from '../services/userService';
import {
  ERROR_TITLES,
  getAssigneeLoadErrorMessage,
  resolveErrorMessage,
  VALIDATION_MESSAGES,
} from '../utils/errorMessages';
import InlineErrorAlert from './InlineErrorAlert';
import ValidationNotice from './ValidationNotice';

const PRIORITIES = ['Low', 'Medium', 'High'];

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: '',
  assignedTo: '',
};

function CreateTicketForm({ onCreated, onCancel }) {
  const { actingUser } = useActingUser();
  const [form, setForm] = useState(INITIAL_FORM);
  const [assignees, setAssignees] = useState([]);
  const [loadingAssignees, setLoadingAssignees] = useState(true);
  const [assigneeError, setAssigneeError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignees();
  }, []);

  async function loadAssignees() {
    setLoadingAssignees(true);
    setAssigneeError(null);

    try {
      const users = await getUsers();
      const supportAgents = users.filter((user) => user.role === 'Support Agent');
      setAssignees(supportAgents);
    } catch (err) {
      setAssignees([]);
      setAssigneeError(getAssigneeLoadErrorMessage(err, { forCreate: true }));
    } finally {
      setLoadingAssignees(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: null }));
    setSubmitError(null);
  }

  function validateForm() {
    const errors = {};

    if (!actingUser) {
      errors.actingUser = VALIDATION_MESSAGES.actingUserCreate;
    }

    if (!form.title.trim()) {
      errors.title = VALIDATION_MESSAGES.title;
    }

    if (!form.description.trim()) {
      errors.description = VALIDATION_MESSAGES.description;
    }

    if (!form.priority) {
      errors.priority = VALIDATION_MESSAGES.priority;
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

    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        createdBy: actingUser._id,
      };

      if (form.assignedTo) {
        payload.assignedTo = form.assignedTo;
      }

      const ticket = await createTicket(payload);
      setForm(INITIAL_FORM);
      setFieldErrors({});
      toast.success('Ticket created');
      onCreated(ticket);
    } catch (err) {
      setSubmitError(
        resolveErrorMessage(
          err,
          'Unable to create the ticket. Check your entries and try again.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = submitting || loadingAssignees || Boolean(assigneeError);

  return (
    <div>
      <p className="text-sm text-gray-600">
        New tickets start with status Open. Assignee is optional.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        {fieldErrors.actingUser && (
          <ValidationNotice message={fieldErrors.actingUser} />
        )}

        <div>
          <label htmlFor="ticket-title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="ticket-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            disabled={isDisabled}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'ticket-title-error' : undefined}
          />
          {fieldErrors.title && (
            <p id="ticket-title-error" className="mt-1 text-sm text-red-600" role="alert">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="ticket-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="ticket-description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            disabled={isDisabled}
            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={
              fieldErrors.description ? 'ticket-description-error' : undefined
            }
          />
          {fieldErrors.description && (
            <p
              id="ticket-description-error"
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
              htmlFor="ticket-priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="ticket-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              disabled={isDisabled}
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              aria-invalid={Boolean(fieldErrors.priority)}
              aria-describedby={fieldErrors.priority ? 'ticket-priority-error' : undefined}
            >
              <option value="">Select priority</option>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            {fieldErrors.priority && (
              <p id="ticket-priority-error" className="mt-1 text-sm text-red-600" role="alert">
                {fieldErrors.priority}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ticket-assignee"
              className="block text-sm font-medium text-gray-700"
            >
              Assignee <span className="font-normal text-gray-500">(optional)</span>
            </label>
            {loadingAssignees ? (
              <p
                id="ticket-assignee"
                className="mt-2 flex items-center gap-2 text-sm text-gray-500"
                aria-live="polite"
              >
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading assignees...
              </p>
            ) : assigneeError ? (
              <div id="ticket-assignee" className="mt-2">
                <InlineErrorAlert
                  title={ERROR_TITLES.assignees}
                  message={assigneeError}
                  onRetry={loadAssignees}
                  compact
                />
              </div>
            ) : (
              <select
                id="ticket-assignee"
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
          <InlineErrorAlert
            title={ERROR_TITLES.createTicket}
            message={submitError}
            compact
          />
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
                Creating ticket...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTicketForm;
