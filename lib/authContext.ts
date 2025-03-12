// app/lib/authContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from './auth';
import { supabase } from './supabase';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

// Keep the splash screen visible while we check authentication
SplashScreen.preventAutoHideAsync();

// Define context types
interface AuthContextType {
  user: any | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

// Define the props type explicitly
interface AuthProviderProps {
  children: ReactNode;
}

// Export the provider component with explicit return type
export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh user and profile data
  const refreshUser = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser?.id) {
        const userProfile = await AuthService.getUserProfile(currentUser.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    await AuthService.logout();
    setUser(null);
    setProfile(null);
  };

  // Subscribe to auth state changes when the component mounts
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN') {
          if (session?.user) {
            setUser(session.user);
            const userProfile = await AuthService.getUserProfile(session.user.id);
            
            if (userProfile) {
              setProfile(userProfile);
              // If user is confirmed and has a profile, navigate to teams
              router.replace('/features/teams/screens/selection');
            }
          }
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'USER_UPDATED') {
          if (session?.user) {
            setUser(session.user);
            const userProfile = await AuthService.getUserProfile(session.user.id);
            
            // If the user's email was just confirmed
            if (session.user.confirmed_at && userProfile) {
              setProfile(userProfile);
              // Navigate to teams selection after email confirmation
              router.replace('/features/teams/screens/selection');
            } else {
              setProfile(userProfile);
            }
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    );

    // Check for existing session on mount
    const checkUser = async (): Promise<void> => {
      try {
        const session = await AuthService.getSession();
        if (session?.user) {
          setUser(session.user);
          const userProfile = await AuthService.getUserProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Use React.createElement instead of JSX syntax
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        profile,
        isLoading,
        signOut,
        refreshUser,
      }
    },
    children
  );
};

// Create a hook for using the auth context
export const useAuth = (): AuthContextType => useContext(AuthContext);