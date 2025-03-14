import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

  // [Subscribe] to auth state changes when the component mounts
  useEffect(() => {

    // [API Call] Subscribes to AuthentificationState Change Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        

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
              // [Navigate] Team Screen (=User+Profile exists)
              router.replace('/features/teams/screens/selection');
            }
          }
          setIsLoading(false);


          // [Case] Signed Out 
        } else if (event === 'SIGNED_OUT') {
          // [Cleaning] Initializing the Session Objects
          setUser(null);
          setProfile(null);
          setIsLoading(false);


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

    // [Checks] for existing Session, while mounting component
    const checkUser = async (): Promise<void> => {
      try {
        // [API Call] Retrieves current session
        const session = await AuthService.getSession();

        /// [Validate] User in Session
        if (session?.user) {
          setUser(session.user);

          // [API Call] Retrieves public/profiles
          const userProfile = await AuthService.getProfilebyUserID(session.user.id);
          setProfile(userProfile);
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
      console.log("Refreshing user...");
      
      // WICHTIG: Holen wir zunächst die aktive Session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session-Abruf fehlgeschlagen:", sessionError);
        setIsLoading(false);
        return;
      }
      
      // Wenn keine Session vorhanden, sind wir nicht angemeldet
      if (!sessionData?.session) {
        console.log("Keine aktive Session gefunden beim Refresh");
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      // Session ist vorhanden, aktualisieren wir den Benutzer
      console.log("Aktive Session gefunden, User ID:", sessionData.session.user.id);
      
      // Den aktuellen Benutzer holen
      const currentUser = sessionData.session.user;
      setUser(currentUser);

      // [Validate] user id
      if (currentUser?.id) {
        // [API Call] retrieve public/profiles   
        const userProfile = await AuthService.getProfilebyUserID(currentUser.id);
        
        if (userProfile) {
          console.log("Profil gefunden bei Refresh:", userProfile.id);
          setProfile(userProfile);
        } else {
          console.log("Kein Profil gefunden trotz aktiver Session");
          setProfile(null);
        }
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