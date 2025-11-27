import { createContext, useContext, useState } from 'react';

const SessionContext = createContext(null);

const storageKey = 'cyber-session-token';

export const SessionProvider = ({ children }) => {
  const [sessionToken, setSessionToken] = useState(() =>
    window.localStorage.getItem(storageKey)
  );

  const saveToken = (token) => {
    if (token) {
      window.localStorage.setItem(storageKey, token);
    } else {
      window.localStorage.removeItem(storageKey);
    }
    setSessionToken(token);
  };

  return (
    <SessionContext.Provider value={{ sessionToken, saveToken }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return ctx;
};

