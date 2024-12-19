import { createContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of the user object
interface User {
  user_id: number;
  name: string;
  email: string;
}

// Define the shape of the context value
interface UserContextType {
  user: User | null; // User can be an object or null
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // For updating the user
}

// Create the context with a default value
export const UserContext = createContext<UserContextType | null>(null);

// Define props for the provider component
interface ContextProviderProps {
  children: ReactNode; // Properly typing children
}

const ContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null); // Initialize user as null

  useEffect(() => {
    // You can set an initial user or fetch data here if needed
  }, []);

  const contextInfo: UserContextType = { user, setUser };

  return (
    <UserContext.Provider value={contextInfo}>
      {children}
    </UserContext.Provider>
  );
};

export default ContextProvider;

