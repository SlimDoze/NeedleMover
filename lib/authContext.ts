/**
 * [BEREITSTELLUNG] Authentifizierungskontext für die gesamte Anwendung
 * 
 * Diese Datei implementiert einen React-Kontext für die Authentifizierung,
 * der übergreifend in der gesamten Anwendung verwendet wird.
 * Verwaltet den Benutzerzustand, Profilinformationen und Authentifizierungsereignisse.
 * Nutzt Supabase für die Authentifizierung und Expo SplashScreen zur Steuerung des Ladebildschirms.
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from './auth';
import { supabase } from './supabase';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

// [VERHINDERT] Automatisches Ausblenden des Splash-Screens bis Authentifizierung abgeschlossen
SplashScreen.preventAutoHideAsync();

// [DEFINIERT] Struktur des Authentifizierungskontexts
interface AuthContext {
  user: any | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forceRefreshProfile: () => Promise<void>; // Erzwungene Profilaktualisierung
}

// [DEFINIERT] Eigenschaften für den AuthProvider
interface AuthProvider {
  children: ReactNode;
}

// [INITIALISIERT] Leeren Authentifizierungskontext mit Standardwerten
const AuthContext = createContext<AuthContext>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
  forceRefreshProfile: async () => {}, // Standardimplementierung
});

// [EXPORTIERT] AuthProvider-Komponente für die App
export const AuthProvider = ({ children }: AuthProvider): React.ReactElement => {

  // [INITIALISIERT] Zustandsvariablen für den Kontext
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastProfileFetch, setLastProfileFetch] = useState(0);

  // [LÄDT] Benutzerprofil mit Wiederholungsmechanismus
  const loadUserProfile = async (userId: string): Promise<any> => {
    try {
      console.log(`Versuche Profil zu laden für User ID: ${userId}`);
      const userProfile = await AuthService.getProfilebyUserID(userId);
      
      if (userProfile) {
        console.log("Profil erfolgreich geladen:", userProfile.email);
        setProfile(userProfile);
        return userProfile;
      } else {
        // [IMPLEMENTIERT] Wiederholungsversuch bei nicht gefundenem Profil
        console.log(`Profil nicht gefunden für ${userId}, Versuch ${retryCount + 1}`);
        
        if (retryCount < 5) { // [BEGRENZT] Auf maximal 5 Wiederholungen
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
            }, 2000); // [WARTET] 2 Sekunden zwischen Versuchen
          });
        }
        
        return null;
      }
    } catch (error) {
      console.error("Fehler beim Laden des Profils:", error);
      return null;
    }
  };

  // [ERZWINGT] Aktualisierung des Benutzerprofils unabhängig von Cachingmechanismen
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

  // [ÜBERWACHT] Authentifizierungsstatuswechsel beim Komponenten-Mount
  useEffect(() => {
    console.log("AuthProvider wird initialisiert");

    // [ABONNIERT] Authentifizierungsstatuswechsel von Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        

        // [BEHANDELT] Anmeldeereignis
        if (event === 'SIGNED_IN') {
          console.log("Sign-In erkannt");
          // [VALIDIERT] Benutzerdaten in der Session
          if (session?.user) {
            console.log(`User eingeloggt: ${session.user.email}`);
            setUser(session.user);

            // [LÄDT] Benutzerprofil aus der Datenbank
            const userProfile = await loadUserProfile(session.user.id);
            
            // [NAVIGIERT] Bei vorhandenem Profil zur Team-Auswahl
            if (userProfile) {
              console.log("Profil gefunden, Navigation zur Team-Auswahl");
              router.replace('/features/teams/screens/selection');
            } else {
              console.log("Kein Profil gefunden nach Sign-In");
            }
          }
          setIsLoading(false);


          // [BEHANDELT] Abmeldeereignis
        } else if (event === 'SIGNED_OUT') {
          console.log("Sign-Out erkannt");
          // [BEREINIGT] Sitzungsinformationen beim Abmelden
          setUser(null);
          setProfile(null);
          setRetryCount(0);
          setIsLoading(false);


          // [BEHANDELT] Aktualisierungsereignis
        } else if (event === 'USER_UPDATED') {
          console.log("User-Update erkannt");
          // [AKTUALISIERT] Benutzerdaten bei Änderungen
          if (session?.user) {
            console.log(`User aktualisiert: ${session.user.email}`);
            setUser(session.user);

            // [LÄDT] Aktuelles Profil aus der Datenbank
            const userProfile = await loadUserProfile(session.user.id);
            
            // [PRÜFT] Bestätigungsstatus und Profilvorhandensein
            if (session.user.confirmed_at && userProfile) {
              console.log("Bestätigter Benutzer mit Profil, Navigation zur Team-Auswahl");
              // [NAVIGIERT] Zur Team-Auswahl bei bestätigtem Benutzer
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
            
            // [VERHINDERT] Zu häufige Profilaktualisierungen
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

    // [PRÜFT] Bestehende Sitzung beim Anwendungsstart
    const checkUser = async (): Promise<void> => {
      try {
        console.log("Prüfe bestehende Session");
        // [LÄDT] Aktuelle Sitzungsinformationen
        const session = await AuthService.getSession();

        // [VALIDIERT] Benutzerdaten in vorhandener Sitzung
        if (session?.user) {
          console.log(`Bestehende Session gefunden für: ${session.user.email}`);
          setUser(session.user);

          // [LÄDT] Benutzerprofil für vorhandene Sitzung
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

    // [BEREINIGT] Abonnements beim Komponenten-Unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // [AKTUALISIERT] Benutzerdaten aus aktueller Sitzung
  const refreshUser = async (): Promise<void> => {
    try {
      // [LÄDT] Aktuelle Benutzerdaten
      setIsLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      // [AKTUALISIERT] Profilinformationen für aktualisierten Benutzer
      if (currentUser?.id) {
        console.log(`Aktualisiere Profil für: ${currentUser.id}`);
        // [LÄDT] Aktuelles Profil aus der Datenbank
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

  // [BEENDET] Aktuelle Benutzersitzung
  const signOut = async (): Promise<void> => {
    // [RUFT] Logout-Funktion von AuthService auf
    await AuthService.logout();
    setUser(null);
    setProfile(null);
    setRetryCount(0);
  };

  // [ERSTELLT] Provider mit Kontextwerten
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

// [EXPORTIERT] Hook für einfachen Zugriff auf den Authentifizierungskontext
export const useAuth = (): AuthContext => useContext(AuthContext);