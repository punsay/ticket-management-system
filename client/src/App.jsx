import { Toaster } from 'sonner';
import { ActingUserProvider } from './context/ActingUserContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ActingUserProvider>
      <HomePage />
      <Toaster position="top-right" richColors closeButton />
    </ActingUserProvider>
  );
}

export default App;
