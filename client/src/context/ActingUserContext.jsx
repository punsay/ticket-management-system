import { createContext, useContext, useState } from 'react';

const ActingUserContext = createContext(null);

export function ActingUserProvider({ children }) {
  const [actingUser, setActingUser] = useState(null);

  return (
    <ActingUserContext.Provider value={{ actingUser, setActingUser }}>
      {children}
    </ActingUserContext.Provider>
  );
}

export function useActingUser() {
  const context = useContext(ActingUserContext);

  if (!context) {
    throw new Error('useActingUser must be used within ActingUserProvider');
  }

  return context;
}
