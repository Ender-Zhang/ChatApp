// src/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface UserContextProps {
  userName: string;
  setUserName: (name: string) => void;
}

export const UserContext = createContext<UserContextProps>({
  userName: '',
  setUserName: () => {},
});

interface LoveContextProps {
  lovedProfiles: string[];
  addProfileToLoved: (profileName: string) => void;
  removeProfileToLoved: (profileName: string) => void;
}

export const LoveContext = createContext<LoveContextProps>({
  lovedProfiles: [],
  addProfileToLoved: () => {},
  removeProfileToLoved: () => {}
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string>('');
  const [lovedProfiles, setLovedProfiles] = useState<string[]>([]);

  const addProfileToLoved = (profileName: string) => {
    setLovedProfiles(prevProfiles => [...prevProfiles, profileName]);
  };

  const removeProfileToLoved = (profileName: string) => {
    setLovedProfiles(prevProfiles => prevProfiles.filter(profile => profile !== profileName));
  };

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      <LoveContext.Provider value={{ lovedProfiles, addProfileToLoved, removeProfileToLoved }}>
        {children}
      </LoveContext.Provider>
    </UserContext.Provider>
  );
};

export const useLoveContext = () => useContext(LoveContext);
