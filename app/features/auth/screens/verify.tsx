/**
 * [BEREITSTELLUNG] E-Mail-Verifizierungsbildschirm
 * 
 * Diese Datei implementiert den Verifizierungsbildschirm, der nach der Bestätigung der 
 * E-Mail-Adresse angezeigt wird. Sie verarbeitet Token aus der URL und prüft
 * kontinuierlich auf die Erstellung des Benutzerprofils.
 * Zeigt verschiedene Statusinformationen während des Verifizierungsprozesses.
 * Plattformspezifische Anpassungen für Web-Token-Verarbeitung.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppColors } from '@/common/constants/AppColors';
import { Team_Routes } from '../_constants/routes';

export default function VerifyScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Prüfe Anmeldestatus...');
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    
    // [VERARBEITET] Token aus der URL und initialisiert die Authentifizierung
    async function processUrlToken() {
      try {
        // [PRÜFT] Plattformspezifische URL-Token-Verarbeitung (nur Web)
        if (Platform.OS === 'web' && window.location.hash) {
          setMessage('Verarbeite Bestätigungslink...');
          
          const hash = window.location.hash;
          console.log('URL-Hash gefunden:', hash);
            
          // [EXTRAHIERT] Authentifizierungstoken aus der URL
          const params = new URLSearchParams(hash.replace('#', ''));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');
          
          if (!accessToken || !refreshToken) {
            console.error('Keine gültigen Tokens in der URL gefunden');
            // [FÄHRT] Mit Sitzungsprüfung fort, auch ohne gültige Tokens
          } else {
            console.log('Token extrahiert, Typ:', type);
            
            // [SETZT] Sitzung mit den extrahierten Tokens
            setMessage('Authentifiziere mit Token...');
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (sessionError) {
              console.error('Fehler beim Setzen der Session:', sessionError);
              setError('Fehler bei der Authentifizierung. Bitte versuche es erneut.');
              setIsLoading(false);
              return;
            }
            
            console.log('Session erfolgreich mit Token aus URL gesetzt');
            
            // [BEREINIGT] URL nach erfolgreicher Token-Verarbeitung
            if (window.history && window.history.replaceState) {
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        }
        
        // [SETZT] Profilprüfung nach Token-Verarbeitung fort
        await checkUserProfile();
      } catch (err) {
        console.error('Fehler bei der Token-Verarbeitung:', err);
        setError(`Fehler bei der Token-Verarbeitung: ${err}`);
        setIsLoading(false);
      }
    }
    
    // [PRÜFT] Benutzerprofil mit Supabase-Abfragen
    async function checkUserProfile() {
      try {
        // [RUFT] Aktuelle Sitzung ab
        setMessage('Prüfe Anmeldestatus...');
        const { data: { session } } = await supabase.auth.getSession();
        
        // [VALIDIERT] Vorhandene Sitzung
        if (!session) {
          console.error('Keine aktive Session gefunden');
          setError('Keine aktive Benutzersitzung gefunden. Bitte logge dich erneut ein.');
          setIsLoading(false);
          return;
        }
        
        console.log('Session gefunden für:', session.user.email);
        setMessage(`Suche Profil für ${session.user.email}...`);
        
        // [DEFINIERT] Funktion für Profilsuche
        const findProfile = async () => {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Fehler beim Suchen des Profils:', profileError);
            return null;
          }
          
          return profile;
        };
        
        // [PRÜFT] Sofortige Profilsuche
        const initialProfile = await findProfile();
        
        // [NAVIGIERT] Direkt bei gefundenem Profil
        if (initialProfile) {
          console.log('Profil sofort gefunden:', initialProfile.name);
          router.replace(Team_Routes.Selection);
          return;
        }
        
        // [STARTET] Polling für verzögerte Profilprüfung
        console.log('Kein Profil gefunden, starte Polling...');
        setMessage('Warte auf Profilaktivierung...');
        
        // [KONFIGURIERT] Polling-Parameter
        let attempts = 0;
        const maxAttempts = 15; // [BEGRENZT] Auf 15 Versuche (30 Sekunden)
        
        pollInterval = setInterval(async () => {
          attempts++;
          setPollCount(attempts);
          
          console.log(`Polling-Versuch ${attempts}/${maxAttempts}`);
          
          // [BEENDET] Polling bei Erreichen der maximalen Versuche
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval!);
            setError('Zeitüberschreitung bei der Suche nach deinem Profil. Bitte versuche, dich erneut anzumelden.');
            setIsLoading(false);
            return;
          }
          
          // [PRÜFT] Erneut auf Profilvorhandensein
          const profile = await findProfile();
          
          // [NAVIGIERT] Bei gefundenem Profil zur Team-Auswahl
          if (profile) {
            console.log('Profil nach Polling gefunden:', profile.name);
            clearInterval(pollInterval!);
            router.replace(Team_Routes.Selection);
          }
        }, 2000); // [WIEDERHOLT] Alle 2 Sekunden
        
      } catch (err) {
        console.error('Unerwarteter Fehler:', err);
        setError(`Ein unerwarteter Fehler ist aufgetreten: ${err}`);
        setIsLoading(false);
        
        // [BEREINIGT] Aktives Polling bei Fehler
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      }
    }
    
    // [STARTET] Verifikationsprozess
    processUrlToken();
    
    // [BEREINIGT] Ressourcen beim Komponenten-Unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [router]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Konto-Verifizierung</Text>
        
        {isLoading ? (
          // [ZEIGT] Ladeansicht während der Verarbeitung
          <>
            <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />
            <Text style={styles.message}>{message}</Text>
            {pollCount > 0 && (
              <Text style={styles.pollCount}>Versuch {pollCount}/15...</Text>
            )}
          </>
        ) : error ? (
          // [ZEIGT] Fehleransicht bei Problemen
          <>
            <Text style={styles.errorTitle}>Fehler</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </>
        ) : (
          // [ZEIGT] Erfolgsansicht bei erfolgreicher Verifikation
          <>
            <Text style={styles.successTitle}>Verifiziert!</Text>
            <Text style={styles.message}>Du wirst weitergeleitet...</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// [DEFINIERT] Stile für den Verifizierungsbildschirm
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: AppColors.text.dark,
  },
  loader: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: AppColors.text.muted,
    marginBottom: 8,
  },
  pollCount: {
    fontSize: 14,
    color: AppColors.text.muted,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#E53E3E',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E53E3E',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#38A169',
  },
});