// src/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface UserContextProps {
  userName: string;
  setUserName: (name: string) => void;
}

export const UserContext = createContext<UserContextProps>({
  userName: '',
  setUserName: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string>('');

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
