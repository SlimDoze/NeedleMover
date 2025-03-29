/**
 * [BEREITSTELLUNG] Haupt-Layout der Anwendung
 * 
 * Diese Datei definiert das Root-Layout der gesamten Anwendung.
 * Sie implementiert:
 * - Den AuthProvider für die anwendungsweite Authentifizierungslogik
 * - Die SplashScreen-Steuerung während des Authentifizierungsprozesses
 * - Die StatusBar-Konfiguration für die gesamte Anwendung
 * - Die Deep-Link-Verarbeitung für verschiedene Anwendungsfälle
 */
import React, { useEffect } from 'react';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';
import * as Linking from 'expo-linking';

// [VERHINDERT] Automatisches Verschwinden des Splash-Screens
// Anmerkung: preventAutoHideAsync() wird bereits in authContext.ts aufgerufen

// [DEFINIERT] Inneres Layout ohne Authentifizierungsprüfung
function RootLayoutNav() {
  const { isLoading } = useAuth();
  const router = useRouter();

  // [DEEP-LINK] Handler für Links und Weiterleitungen
  useEffect(() => {
    // [HANDLER] Für initiale URL beim App-Start
    const handleInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        handleDeepLink(initialURL);
      }
    };

    // [EVENT] Listener für Links, wenn die App bereits läuft
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // [PARSER] URL analysieren und entsprechend handeln
    const handleDeepLink = (url: string) => {
      console.log('Deep Link empfangen:', url);
      
      // [ERSTELLT] URL-Objekt zur Analyse
      const parsedURL = Linking.parse(url);
      
      // [PRÜFT] Ob es sich um einen Verify-Link handelt
      if (parsedURL.path === 'verify') {
        console.log('Verifizierungs-Link erkannt mit Parametern:', parsedURL.queryParams);
        
        // [NAVIGIERT] Zur Verifizierungsseite mit den Parametern
        router.replace({
          pathname: '/features/auth/screens/verify',
          params: parsedURL.queryParams || undefined
        });
      }
      
      // [PRÜFT] Ob es sich um einen Passwort-Reset-Link handelt
      if (parsedURL.path === 'reset-password') {
        console.log('Passwort-Reset-Link erkannt mit Parametern:', parsedURL.queryParams);
        
        // [NAVIGIERT] Zur Reset-Seite mit den Token-Parametern
        router.replace({
          pathname: '/features/auth/screens/reset',
          params: parsedURL.queryParams || undefined
        });
      }
    };

    // [STARTET] Initiale URL-Verarbeitung beim App-Start
    handleInitialURL();

    // [CLEANUP] Beim Unmount der Komponente
    return () => {
      subscription.remove();
    };
  }, [router]);
  
  // [BLENDET] Splash-Screen aus, sobald die Authentifizierungsprüfung abgeschlossen ist
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // [ZEIGT] Nichts während des Ladevorgangs
  if (isLoading) {
    return null;
  }

  // [RENDERT] Die App nach abgeschlossenem Ladevorgang
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

// [EXPORTIERT] Root-Layout mit AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}