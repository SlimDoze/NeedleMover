// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { sessionStorage } from '@/lib/supabase';
import { Team_Routes } from '@/app/features/auth/_constants/routes';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Root layout without auth check
function RootLayoutNav() {
  const { isLoading, user, refreshUser } = useAuth();
  const router = useRouter();

  // Deep Link-Handler einrichten
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
      // Prüfen, ob es sich um einen Access-Token-Link handelt
      else if (url.includes('access_token=')) {
        console.log('Auth Hash erkannt, aktualisiere Benutzer...');
        
        // WICHTIG: Session-Persistenz aktivieren
        sessionStorage.setPersistSession(true).then(() => {
          // Manuelles Session-Update auslösen, um sicherzustellen, dass 
          // der Benutzer korrekt eingeloggt wird
          supabase.auth.getSession().then(({ data }) => {
            if (data?.session) {
              console.log('Bestätigungstoken erkannt, aktualisiere Benutzersitzung...');
              refreshUser().then(() => {
                // Nach erfolgreichem Login zur Team-Auswahl navigieren
                router.replace(Team_Routes.Selection);
              });
            } else {
              console.log('Keine aktive Session gefunden');
            }
          });
        });
      }
    };

    // Initiale URL beim App-Start verarbeiten
    handleInitialURL();

    // Cleanup beim Unmount der Komponente
    return () => {
      subscription.remove();
    };
  }, [router, refreshUser]);

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