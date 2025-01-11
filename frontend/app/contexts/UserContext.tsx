import React, { createContext, useState, ReactNode } from 'react';

interface UserDetails {
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
  userDetails: { name: '', age: '', hobbies: '', location: '' },
  setUserDetails: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    age: '',
    hobbies: '',
    location: '',
  });

  return (
    <UserContext.Provider value={{ userName, setUserName, userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
