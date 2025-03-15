// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Root layout without auth check
function RootLayoutNav() {
  const { isLoading, user, refreshUser } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Komponente als montiert markieren
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Überwachen des URL-Hashes für Auth-Token (nur auf Web)
  useEffect(() => {
    // Nur auf der Web-Plattform ausführen und erst nachdem die Komponente montiert ist
    if (Platform.OS === 'web' && typeof window !== 'undefined' && isMounted) {
      const checkUrlHash = async () => {
        if (window.location.hash && window.location.hash.includes('access_token=')) {
          console.log('Auth Hash erkannt, aktualisiere Benutzer...');
          
          try {
            // Token aus Hash extrahieren
            const hashParams = new URLSearchParams(
              window.location.hash.substring(1) // Entferne das # am Anfang
            );
            
            const token = hashParams.get('access_token');
            const type = hashParams.get('type');
            
            // Prüfen, ob es sich um eine Anmeldung oder Bestätigung handelt
            if (token && type === 'signup') {
              console.log('Bestätigungstoken erkannt, aktualisiere Benutzersitzung...');
              
              // Benutzer aktualisieren
              await refreshUser();
              
              // Hash aus URL entfernen (für saubere URL)
              window.history.replaceState(null, '', window.location.pathname);
              
              // Verzögerung hinzufügen, um sicherzustellen, dass alles montiert ist
              setTimeout(() => {
                // Zur Team-Auswahl navigieren
                router.replace('/features/teams/screens/selection');
              }, 500);
            }
          } catch (error) {
            console.error('Fehler bei der Verarbeitung des Auth-Hashes:', error);
          }
        }
      };
      
      // Sofort beim Laden prüfen (mit kleiner Verzögerung)
      setTimeout(() => {
        checkUrlHash();
      }, 100);
      
      // Bei Hash-Änderungen überprüfen
      const handleHashChange = () => {
        checkUrlHash();
      };
      
      window.addEventListener('hashchange', handleHashChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
  }, [refreshUser, router, isMounted]);

  // Deep Link-Handler für Mobile-Apps
  useEffect(() => {
    if (!isMounted) return;

    // Handler für initiale URL beim App-Start
    const handleInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        handleDeepLink(initialURL);
      }
    };

    // Event-Listener für Links, wenn die App bereits läuft
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // URL parsen und entsprechend handeln
    const handleDeepLink = async (url: string) => {
      console.log('Deep Link empfangen:', url);
      
      // URL-Objekt erstellen
      const parsedURL = Linking.parse(url);
      
      // Prüfen, ob es sich um ein Verify-Link handelt (Mobile)
      if (parsedURL.path === 'verify') {
        console.log('Verifizierungs-Link erkannt mit Parametern:', parsedURL.queryParams);
        
        if (parsedURL.queryParams?.token && parsedURL.queryParams?.type && parsedURL.queryParams?.email) {
          // Hier könnten wir die OTP-Verifizierung manuell durchführen
          // Aber stattdessen nutzen wir den refreshUser für Konsistenz
          await refreshUser();
          
          // Zur Team-Auswahl navigieren mit Verzögerung
          setTimeout(() => {
            router.replace('/features/teams/screens/selection');
          }, 500);
        }
      }
    };

    // Initiale URL beim App-Start verarbeiten
    handleInitialURL();

    // Cleanup beim Unmount der Komponente
    return () => {
      subscription.remove();
    };
  }, [router, refreshUser, isMounted]);

 // In app/_layout.tsx - Den Deep-Link-Handler verbessern
useEffect(() => {
  // Handler für initiale URL beim App-Start
  const handleInitialURL = async () => {
    const initialURL = await Linking.getInitialURL();
    if (initialURL) {
      console.log('Initial URL beim App-Start:', initialURL);
      handleDeepLink(initialURL);
    }
  };

  // Event-Listener für Links, wenn die App bereits läuft
  const subscription = Linking.addEventListener('url', (event) => {
    console.log('Deep Link empfangen während App läuft:', event.url);
    handleDeepLink(event.url);
  });

  // URL parsen und entsprechend handeln
  const handleDeepLink = (url: string) => {
    console.log('Deep Link wird verarbeitet:', url);
    
    // URL-Objekt erstellen
    const parsedURL = Linking.parse(url);
    console.log('Geparste URL:', parsedURL);
    
    // Prüfen, ob es sich um ein Verify-Link handelt
    if (parsedURL.scheme === 'needlemover' && parsedURL.path === 'verify') {
      console.log('Verifizierungs-Link erkannt mit Parametern:', parsedURL.queryParams);
      
      // Zur Verifizierungsseite navigieren mit den Parametern
      router.replace({
        pathname: '/features/auth/screens/verify',
        params: parsedURL.queryParams || undefined
      });
    }
  };

  // Initiale URL beim App-Start verarbeiten
  handleInitialURL();

  // Cleanup beim Unmount der Komponente
  return () => {
    subscription.remove();
  };
}, [router]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Render the app once loading is complete
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

// Root layout with auth provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}