import { useState } from 'react';
import { Plus } from 'lucide-react';
import ActingUserSelector from '../components/ActingUserSelector';
import CreateTicketForm from '../components/CreateTicketForm';
import SlideOverPanel from '../components/SlideOverPanel';
import TicketDetail from '../components/TicketDetail';
import TicketList from '../components/TicketList';

function HomePage() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function handleTicketCreated(ticket) {
    setListRefreshKey((current) => current + 1);
    setSelectedTicketId(ticket._id);
    setIsCreateOpen(false);
  }

  function handleCloseCreate() {
    setIsCreateOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Support Ticket Management System
            </h1>
          </div>
          <div className="w-full sm:max-w-md">
            <ActingUserSelector />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {selectedTicketId ? (
          <TicketDetail
            ticketId={selectedTicketId}
            onBack={() => setSelectedTicketId(null)}
            onTicketUpdated={() => setListRefreshKey((current) => current + 1)}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage support tickets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create ticket
              </button>
            </div>
            <TicketList
              onSelectTicket={setSelectedTicketId}
              refreshKey={listRefreshKey}
            />
          </div>
        )}
      </main>

      <SlideOverPanel
        isOpen={isCreateOpen}
        title="Create ticket"
        onClose={handleCloseCreate}
      >
        <CreateTicketForm
          onCreated={handleTicketCreated}
          onCancel={handleCloseCreate}
        />
      </SlideOverPanel>
    </div>
  );
}

export default HomePage;
