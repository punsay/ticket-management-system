import { useEffect, useState } from 'react';
import { Loader2, UserRound } from 'lucide-react';
import { useActingUser } from '../context/ActingUserContext';
import { getUsers } from '../services/userService';
import { ERROR_TITLES, resolveErrorMessage } from '../utils/errorMessages';
import InlineErrorAlert from './InlineErrorAlert';

function formatUserLabel(user) {
  return `${user.name} (${user.role})`;
}

function ActingUserLabel() {
  return (
    <label
      htmlFor="acting-user"
      className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
    >
      <UserRound className="h-4 w-4" aria-hidden="true" />
      Acting user
    </label>
  );
}

function ActingUserSelector() {
  const { actingUser, setActingUser } = useActingUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);

    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setUsers([]);
      setError(
        resolveErrorMessage(
          err,
          'Unable to load users. Check your connection and try again.'
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleChange(event) {
    const selectedId = event.target.value;

    if (!selectedId) {
      setActingUser(null);
      return;
    }

    const selectedUser = users.find((user) => user._id === selectedId);
    setActingUser(selectedUser ?? null);
  }

  if (loading) {
    return (
      <div>
        <ActingUserLabel />
        <p
          id="acting-user"
          className="mt-2 flex items-center gap-2 text-sm text-gray-500"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading users...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ActingUserLabel />
        <div className="mt-2">
          <InlineErrorAlert
            title={ERROR_TITLES.actingUsers}
            message={error}
            onRetry={loadUsers}
            compact
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <ActingUserLabel />
      <select
        id="acting-user"
        value={actingUser?._id ?? ''}
        onChange={handleChange}
        className="mt-2 block w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select acting user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {formatUserLabel(user)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ActingUserSelector;
