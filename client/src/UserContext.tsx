import { createContext, useEffect, useState } from 'react';
import { User, UserContextType, ContextProviderProps } from './interfaces/contextAPI';

// Create the context with a default value
export const UserContext = createContext<UserContextType | null>(null);



const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null); // Initialize user as null
  const [homeRefresh, setHomeRefresh] = useState(0);
  const [listRefresh, setListRefresh] = useState(0);
  useEffect(() => {
    // You can set an initial user or fetch data here if needed
    if (localStorage.length > 0) {
      setUser({user_id: Number(localStorage.getItem('user_id')), name: localStorage.getItem('name') || '', email: localStorage.getItem('email') || ''});
    }
  }, []);

  const contextInfo: UserContextType = { user, homeRefresh, listRefresh, setUser, setHomeRefresh, setListRefresh };

  return (
    <UserContext.Provider value={contextInfo}>
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvider;

