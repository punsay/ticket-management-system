import { useState } from 'react';
import ActingUserSelector from '../components/ActingUserSelector';
import TicketDetail from '../components/TicketDetail';
import TicketList from '../components/TicketList';

function HomePage() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Support Ticket Management System
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Select an acting user before creating tickets or comments.
            </p>
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
          />
        ) : (
          <TicketList onSelectTicket={setSelectedTicketId} />
        )}
      </main>
    </div>
  );
}

export default HomePage;
