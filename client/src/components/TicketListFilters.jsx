import { useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { TICKET_STATUSES } from '../utils/statusTransitions';

function TicketListFilters({
  activeSearch,
  activeStatus,
  onSearch,
  onStatusFilter,
  onClear,
}) {
  const [searchInput, setSearchInput] = useState(activeSearch);
  const hasActiveFilter = Boolean(activeSearch || activeStatus);

  useEffect(() => {
    setSearchInput(activeSearch);
  }, [activeSearch]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    onSearch(searchInput.trim());
  }

  function handleStatusChange(event) {
    onStatusFilter(event.target.value);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <form
          className="flex-1"
          onSubmit={handleSearchSubmit}
          aria-label="Search tickets"
        >
          <label
            htmlFor="ticket-search"
            className="block text-sm font-medium text-gray-700"
          >
            Search
          </label>
          <div className="mt-1 flex gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="ticket-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search title or description"
                className="block w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Search
            </button>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            Matches title and description only. Clears any status filter.
          </p>
        </form>

        <div className="w-full lg:max-w-xs">
          <label
            htmlFor="ticket-status-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <div className="relative mt-1">
            <Filter
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <select
              id="ticket-status-filter"
              value={activeStatus}
              onChange={handleStatusChange}
              className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All statuses</option>
              {TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            Exact status match. Clears any search keyword.
          </p>
        </div>
      </div>

      {hasActiveFilter ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          {activeSearch ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
              Search: {activeSearch}
            </span>
          ) : null}
          {activeStatus ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-800">
              Status: {activeStatus}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default TicketListFilters;
