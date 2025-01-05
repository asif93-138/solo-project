import { ReactNode } from "react";

// Define the shape of the user object
export interface User {
  user_id: number;
  name: string;
  email: string;
}

// Define the shape of the context value
export interface UserContextType {
  homeRefresh: number;
  listRefresh: number;
  user: User | null; // User can be an object or null
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // For updating the user
  setHomeRefresh: React.Dispatch<React.SetStateAction<number>>;
  setListRefresh: React.Dispatch<React.SetStateAction<number>>;
}

// Define props for the provider component
export interface ContextProviderProps {
    children: ReactNode; // Properly typing children
  }