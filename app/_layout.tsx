// app/_layout.tsx - mit verzögerter Navigation
import React, { useEffect, useRef } from 'react';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Root layout without auth check
function RootLayoutNav() {
  const { isLoading } = useAuth();
  const router = useRouter();
  const isMounted = useRef(false);

  // Setze den mounted-Status
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Deep Link-Handler einrichten
  useEffect(() => {
    // Warte kurz, um sicherzustellen, dass das Root-Layout gerendert wurde
    const initTimeout = setTimeout(() => {
      // Handler für initiale URL beim App-Start
      const handleInitialURL = async () => {
        try {
          const initialURL = await Linking.getInitialURL();
          if (initialURL && isMounted.current) {
            console.log('Initial URL beim App-Start:', initialURL);
            handleDeepLink(initialURL);
          }
        } catch (error) {
          console.error('Fehler beim Verarbeiten der initialen URL:', error);
        }
      };

      handleInitialURL();
    }, 500); // Verzögerung für den initialen Check

    // Event-Listener für Links, wenn die App bereits läuft
    const subscription = Linking.addEventListener('url', (event) => {
      if (isMounted.current) {
        console.log('Deep Link empfangen während App läuft:', event.url);
        handleDeepLink(event.url);
      }
    });

    // URL parsen und entsprechend handeln
    const handleDeepLink = (url: string) => {
      console.log('Deep Link wird verarbeitet:', url);
      
      // WICHTIG: Timing-Problem vermeiden
      setTimeout(() => {
        if (!isMounted.current) return;
        
        // Prüfen, ob es sich um einen Auth-Callback mit Token handelt
        if (url.includes('access_token=')) {
          console.log('Auth Token in URL gefunden, leite zum Auth-Callback weiter');
          
          // In der Web-Umgebung lassen wir die URL unverändert, da der Fragment für den Callback wichtig ist
          // Der Callback wird durch die normale Routing-Mechanik aufgerufen
          if (Platform.OS !== 'web') {
            router.replace('/features/auth/screens/callback');
          } else {
            // Im Web ist das Fragment (#) nicht in der URL-Parameter enthalten,
            // daher navigieren wir direkt zum Callback
            router.replace('/features/auth/screens/callback');
          }
          return;
        }
        
        // URL-Objekt für normale Deep Links erstellen
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
      }, 500); // Navigations-Verzögerung
    };

    // Cleanup beim Unmount der Komponente
    return () => {
      clearTimeout(initTimeout);
      subscription.remove();
    };
  }, [router]);

  useEffect(() => {
    // Hide splash screen when auth check is done
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

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