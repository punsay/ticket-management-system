import { useState } from 'react';
import { AlertCircle, Loader2, MessageSquarePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useActingUser } from '../context/ActingUserContext';
import { addComment } from '../services/ticketService';

function CommentForm({ ticketId, onCommentAdded }) {
  const { actingUser } = useActingUser();
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setMessage(event.target.value);
    setFieldErrors((current) => ({ ...current, message: null }));
    setSubmitError(null);
  }

  function validateForm() {
    const errors = {};

    if (!actingUser) {
      errors.actingUser = 'Select an acting user before adding a comment.';
    }

    if (!message.trim()) {
      errors.message = 'Comment is required.';
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
      await addComment(ticketId, {
        message: message.trim(),
        createdBy: actingUser._id,
      });
      setMessage('');
      setFieldErrors({});
      toast.success('Comment added');
      onCommentAdded?.();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {fieldErrors.actingUser && (
        <p
          className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
          role="alert"
        >
          {fieldErrors.actingUser}
        </p>
      )}

      <div>
        <label htmlFor="comment-message" className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          id="comment-message"
          name="message"
          rows={3}
          value={message}
          onChange={handleChange}
          disabled={submitting}
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'comment-message-error' : undefined}
        />
        {fieldErrors.message && (
          <p id="comment-message-error" className="mt-1 text-sm text-red-600" role="alert">
            {fieldErrors.message}
          </p>
        )}
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

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Adding comment...
          </>
        ) : (
          <>
            <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
            Add comment
          </>
        )}
      </button>
    </form>
  );
}

export default CommentForm;
