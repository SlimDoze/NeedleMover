// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';
import * as Linking from 'expo-linking';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Root layout without auth check
function RootLayoutNav() {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  // Deep Link-Handler einrichten
  useEffect(() => {
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
    const handleDeepLink = (url: string) => {
      console.log('Deep Link empfangen:', url);
      
      // URL-Objekt erstellen
      const parsedURL = Linking.parse(url);
      
      // Prüfen, ob es sich um ein Verify-Link handelt
      if (parsedURL.path === 'verify') {
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