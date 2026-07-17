import { ActingUserProvider } from './context/ActingUserContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ActingUserProvider>
      <HomePage />
    </ActingUserProvider>
  );
}

export default App;
