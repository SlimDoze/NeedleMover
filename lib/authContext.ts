// lib/authContext.ts - Verbesserungen
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
  forceRefreshProfile: () => Promise<void>; // Neue Funktion
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
  forceRefreshProfile: async () => {}, // Neue Funktion
});

// [Export] Auth Provider Component
export const AuthProvider = ({ children }: AuthProvider): React.ReactElement => {

  // [Initialize] React Hooks
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastProfileFetch, setLastProfileFetch] = useState(0);

  // Verbesserte Funktion zum Laden des Profils mit Retry-Mechanismus
  const loadUserProfile = async (userId: string): Promise<any> => {
    try {
      console.log(`Versuche Profil zu laden für User ID: ${userId}`);
      const userProfile = await AuthService.getProfilebyUserID(userId);
      
      if (userProfile) {
        console.log("Profil erfolgreich geladen:", userProfile.email);
        setProfile(userProfile);
        return userProfile;
      } else {
        // Profil nicht gefunden - wir warten kurz und versuchen es erneut
        console.log(`Profil nicht gefunden für ${userId}, Versuch ${retryCount + 1}`);
        
        if (retryCount < 5) { // Max 5 Wiederholungen
          setRetryCount(prev => prev + 1);
          return new Promise(resolve => {
            setTimeout(async () => {
              const retriedProfile = await AuthService.getProfilebyUserID(userId);
              if (retriedProfile) {
                console.log("Profil beim Wiederholungsversuch gefunden");
                setProfile(retriedProfile);
                resolve(retriedProfile);
              } else {
                console.log("Profil auch nach Wiederholung nicht gefunden");
                resolve(null);
              }
            }, 2000); // 2 Sekunden warten
          });
        }
        
        return null;
      }
    } catch (error) {
      console.error("Fehler beim Laden des Profils:", error);
      return null;
    }
  };

  // Neue Funktion: Erzwingt eine Profilaktualisierung
  const forceRefreshProfile = async (): Promise<void> => {
    if (!user?.id) {
      console.log("Kann Profil nicht aktualisieren - kein Benutzer angemeldet");
      return;
    }
    
    console.log("Erzwinge Profilaktualisierung für:", user.id);
    setLastProfileFetch(Date.now());
    const freshProfile = await loadUserProfile(user.id);
    
    if (freshProfile) {
      console.log("Profil aktualisiert:", freshProfile.email);
    } else {
      console.log("Profilaktualisierung fehlgeschlagen");
    }
  };

  // [Subscribe] to auth state changes when the component mounts
  useEffect(() => {
    console.log("AuthProvider wird initialisiert");

    // [API Call] Subscribes to AuthentificationState Change Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        

        // [CASE] Signed In
        if (event === 'SIGNED_IN') {
          console.log("Sign-In erkannt");
          // [Validates] User 
          if (session?.user) {
            console.log(`User eingeloggt: ${session.user.email}`);
            setUser(session.user);

            // [Get] public/profiles => sets local rec var
            const userProfile = await loadUserProfile(session.user.id);
            
            // [Validated] public/Profile Rec
            if (userProfile) {
              console.log("Profil gefunden, Navigation zur Team-Auswahl");
              // [Navigate] Team Screen (=User+Profile exists)
              router.replace('/features/teams/screens/selection');
            } else {
              console.log("Kein Profil gefunden nach Sign-In");
            }
          }
          setIsLoading(false);


          // [Case] Signed Out 
        } else if (event === 'SIGNED_OUT') {
          console.log("Sign-Out erkannt");
          // [Cleaning] Initializing the Session Objects
          setUser(null);
          setProfile(null);
          setRetryCount(0);
          setIsLoading(false);


          // [Case] User Updated
        } else if (event === 'USER_UPDATED') {
          console.log("User-Update erkannt");
          // [Validates] User 
          if (session?.user) {
            console.log(`User aktualisiert: ${session.user.email}`);
            setUser(session.user);

            // [API Call] Get public/profiles
            const userProfile = await loadUserProfile(session.user.id);
            
            // [Check] Is User Confirmed + profile created
            if (session.user.confirmed_at && userProfile) {
              console.log("Bestätigter Benutzer mit Profil, Navigation zur Team-Auswahl");
              // [Navigate] Team Selection Screen
              router.replace('/features/teams/screens/selection');
            } else {
              setProfile(userProfile);
              console.log("Benutzer aktualisiert, aber keine Navigation");
            }
          }
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token erneuert, prüfe auf Profil");
          if (session?.user) {
            setUser(session.user);
            
            // Nur Profil aktualisieren, wenn seit der letzten Aktualisierung 
            // mindestens 5 Sekunden vergangen sind
            const now = Date.now();
            if (now - lastProfileFetch > 5000) {
              setLastProfileFetch(now);
              const userProfile = await loadUserProfile(session.user.id);
              if (!userProfile) {
                console.log("Kein Profil nach Token-Erneuerung gefunden");
              }
            }
          }
          setIsLoading(false);
        } else {
          console.log(`Anderes Auth-Ereignis: ${event}`);
          setIsLoading(false);
        }
      }
    );

    // [Checks] for existing Session, while mounting component
    const checkUser = async (): Promise<void> => {
      try {
        console.log("Prüfe bestehende Session");
        // [API Call] Retrieves current session
        const session = await AuthService.getSession();

        /// [Validate] User in Session
        if (session?.user) {
          console.log(`Bestehende Session gefunden für: ${session.user.email}`);
          setUser(session.user);

          // [API Call] Retrieves public/profiles
          const userProfile = await loadUserProfile(session.user.id);
          if (userProfile) {
            console.log("Profil für bestehende Session gefunden");
          } else {
            console.log("Kein Profil für bestehende Session gefunden");
          }
        } else {
          console.log("Keine bestehende Session gefunden");
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
        console.log(`Aktualisiere Profil für: ${currentUser.id}`);
        // [API Call] retrieve public/profiles   
        const userProfile = await loadUserProfile(currentUser.id);
        if (!userProfile) {
          console.log("Kein Profil während refreshUser gefunden");
        }
      } else {
        setProfile(null);
        console.log("Kein Benutzer zum Aktualisieren gefunden");
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
    setRetryCount(0);
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
        forceRefreshProfile,
      }
    },
    children
  );
};

// Create a hook for using the auth context
export const useAuth = (): AuthContext => useContext(AuthContext);