import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useActingUser } from '../context/ActingUserContext';
import { createTicket } from '../services/ticketService';
import { getUsers } from '../services/userService';

const PRIORITIES = ['Low', 'Medium', 'High'];

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: '',
  assignedTo: '',
};

function CreateTicketForm({ onCreated }) {
  const { actingUser } = useActingUser();
  const [form, setForm] = useState(INITIAL_FORM);
  const [assignees, setAssignees] = useState([]);
  const [loadingAssignees, setLoadingAssignees] = useState(true);
  const [assigneeError, setAssigneeError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

    if (!actingUser) {
      errors.actingUser = 'Select an acting user before creating a ticket.';
    }

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
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = submitting || loadingAssignees || Boolean(assigneeError);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-gray-500" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Create ticket</h2>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        New tickets start with status Open. Assignee is optional.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        {!actingUser && (
          <p
            className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
            role="alert"
          >
            {fieldErrors.actingUser ??
              'Select an acting user in the header before submitting.'}
          </p>
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
              <p
                id="ticket-assignee"
                className="mt-2 flex items-start gap-2 text-sm text-red-600"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {assigneeError}
              </p>
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

        <div>
          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
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
    </section>
  );
}

export default CreateTicketForm;
