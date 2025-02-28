// File: /context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

// Define the type for the user object
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the type for the context
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  isLoading: true,
});

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const segments = useSegments();

  // Check if the user is authenticated when the segments change
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Use the correct path format
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('../teams');
    }
  }, [user, segments]);

  // Simulate checking for a stored token on app load
  useEffect(() => {
    // In a real app, you would check for a stored token or user data
    const checkAuthState = async () => {
      try {
        // Simulate a delay to check auth state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we're not setting a user here
        setUser(null);
      } catch (error) {
        console.error('Failed to check auth state:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Function to sign in a user
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would make an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful authentication
      setUser({
        id: '123',
        name: 'Test User',
        email: email,
      });
      
      router.replace('../teams');
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign up a new user
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would make an API call to register
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      setUser({
        id: '123',
        name: name,
        email: email,
      });
      
      router.replace('../teams/selection');
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign out a user
  const signOut = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);