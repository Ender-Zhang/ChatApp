
// src/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface UserDetails {
  id: string,
  name: string;
  age: string;
  hobbies: string;
  location: string;
}

interface UserContextProps {
  userName: string;
  setUserName: (name: string) => void;
  userDetails: UserDetails;
  setUserDetails: (details: UserDetails) => void;
}

export const UserContext = createContext<UserContextProps>({
  userName: '',
  setUserName: () => {},
  userDetails: { id: '' ,name: '', age: '', hobbies: '', location: '' },
  setUserDetails: () => {},
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
  const [userDetails, setUserDetails] = useState<UserDetails>({
    id: '',
    name: '',
    age: '',
    hobbies: '',
    location: '',
  });

  const [lovedProfiles, setLovedProfiles] = useState<string[]>([]);

  const addProfileToLoved = (profileName: string) => {
    setLovedProfiles(prevProfiles => [...prevProfiles, profileName]);
  };

  const removeProfileToLoved = (profileName: string) => {
    setLovedProfiles(prevProfiles => prevProfiles.filter(profile => profile !== profileName));
  };

  return (
    <UserContext.Provider value={{ userName, setUserName, userDetails, setUserDetails  }}>
      <LoveContext.Provider value={{ lovedProfiles, addProfileToLoved, removeProfileToLoved }}>
        {children}
      </LoveContext.Provider>
    </UserContext.Provider>
  );
};

export const useLoveContext = () => useContext(LoveContext);
