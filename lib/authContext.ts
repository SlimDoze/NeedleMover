import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { AuthService } from './auth';
import { supabase } from './supabase';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

// [Ensures] Splashscren visible until Authentification complete
SplashScreen.preventAutoHideAsync();

// [Structure] AuthContext 
interface AuthContext {
  user: any | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// [Structure] AuthProvider
interface AuthProvider {
  children: ReactNode;
}

// [Initialize] Empty AuthContext 
const AuthContext = createContext<AuthContext>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

// [Export] Auth Provider Component
export const AuthProvider = ({ children }: AuthProvider): React.ReactElement => {

  // [Initialize] React Hooks
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // [FIX] Verwende Refs, um zu verfolgen, ob wir bereits initialisiert haben
  const hasInitialized = useRef(false);
  const profileChecked = useRef(false);
  // [FIX] Verwende einen Ref, um zu verfolgen, ob wir bereits zum Selection Screen navigiert haben
  const hasNavigatedToSelection = useRef(false);

  // [Subscribe] to auth state changes when the component mounts
  useEffect(() => {
    // [FIX] Prüfe, ob wir bereits initialisiert haben, um doppelte Initialisierungen zu vermeiden
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // [API Call] Subscribes to AuthentificationState Change Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // [FIX] Reduziere Logs auf nützliche Informationen
        if (event !== 'INITIAL_SESSION') {  // Wir ignorieren das initiale Ereignis, das immer auftritt
          console.log("Auth state changed:", event);
        }

        // [CASE] Signed In
        if (event === 'SIGNED_IN') {
          // [Validates] User 
          if (session?.user) {
            setUser(session.user);

            // [Get] public/profiles => sets local rec var
            const userProfile = await AuthService.getProfilebyUserID(session.user.id);
            
            // [Validated] public/Profile Rec
            if (userProfile) {
              setProfile(userProfile);
              if (!hasNavigatedToSelection.current) {
                // [Navigate] Team Screen (=User+Profile exists)
                hasNavigatedToSelection.current = true;
                router.replace('/features/teams/screens/selection');
              }
            }
          }
          setIsLoading(false);

          // [Case] Signed Out 
        } else if (event === 'SIGNED_OUT') {
          // [Cleaning] Initializing the Session Objects
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          // [FIX] Zurücksetzen des Navigations-Flags
          hasNavigatedToSelection.current = false;

          // [Case] User Updated
        } else if (event === 'USER_UPDATED') {
          
          // [Validates] User 
          if (session?.user) {
            setUser(session.user);

            // [API Call] Get public/profiles
            const userProfile = await AuthService.getProfilebyUserID(session.user.id);
            
            // [Check] Is User Confirmed + profile created
            if (session.user.confirmed_at && userProfile) {
              setProfile(userProfile);

              // [Navigate] Team Selection Screen
              if (!hasNavigatedToSelection.current) {
                hasNavigatedToSelection.current = true;
                router.replace('/features/teams/screens/selection');
              }
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

    // [Checks] for existing Session, while mounting component
    const checkUser = async (): Promise<void> => {
      try {
        // [FIX] Vermeidet doppelte Profilprüfungen
        if (profileChecked.current) return;
        profileChecked.current = true;

        // [API Call] Retrieves current session
        const session = await AuthService.getSession();

        /// [Validate] User in Session
        if (session?.user) {
          setUser(session.user);

          // [API Call] Retrieves public/profiles
          const userProfile = await AuthService.getProfilebyUserID(session.user.id);
          setProfile(userProfile);
          
          // [FIX] Navigiere nur, wenn ein gültiges Profil vorhanden ist und noch nicht navigiert wurde
          if (userProfile && !hasNavigatedToSelection.current && session.user.confirmed_at) {
            hasNavigatedToSelection.current = true;
            router.replace('/features/teams/screens/selection');
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    checkUser();

    // [Clean up] Subscriptions
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // [Function] Refreshed session profile from db (public/profile)
  const refreshUser = async (): Promise<void> => {
    try {
      // [API Call] Retrieve User via Session
      setIsLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      // [Validate] user id
      if (currentUser?.id) {
        // [API Call] retrieve public/profiles   
        const userProfile = await AuthService.getProfilebyUserID(currentUser.id);
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

  // [Function] Signed User out of Session
  const signOut = async (): Promise<void> => {
    // [API Call] Logout session
    await AuthService.logout();
    setUser(null);
    setProfile(null);
    // [FIX] Zurücksetzen des Navigations-Flags
    hasNavigatedToSelection.current = false;
  };

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
export const useAuth = (): AuthContext => useContext(AuthContext);