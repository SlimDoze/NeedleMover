/**
 * [BEREITSTELLUNG] Haupt-Layout der Anwendung
 * 
 * Diese Datei definiert das Root-Layout der gesamten Anwendung.
 * Sie implementiert:
 * - Den AuthProvider für die anwendungsweite Authentifizierungslogik
 * - Die SplashScreen-Steuerung während des Authentifizierungsprozesses
 * - Die StatusBar-Konfiguration für die gesamte Anwendung
 */
import React, { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';

// [VERHINDERT] Automatisches Verschwinden des Splash-Screens
// Anmerkung: preventAutoHideAsync() wird bereits in authContext.ts aufgerufen

// [DEFINIERT] Inneres Layout ohne Authentifizierungsprüfung
function RootLayoutNav() {
  const { isLoading } = useAuth();

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