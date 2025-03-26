// app/features/auth/screens/verify.tsx
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
    
    // 1. Funktion, um Token aus der URL zu extrahieren und zu verarbeiten
    async function processUrlToken() {
      try {
        // Nur für Web-Plattform relevant
        if (Platform.OS === 'web' && window.location.hash) {
          setMessage('Verarbeite Bestätigungslink...');
          
          const hash = window.location.hash;
          console.log('URL-Hash gefunden:', hash);
            
          // Token aus der URL extrahieren
          const params = new URLSearchParams(hash.replace('#', ''));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');
          
          if (!accessToken || !refreshToken) {
            console.error('Keine gültigen Tokens in der URL gefunden');
            // Wir machen trotzdem weiter, um zu sehen, ob bereits eine aktive Session existiert
          } else {
            console.log('Token extrahiert, Typ:', type);
            
            // Session mit den Tokens setzen
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
            
            // URL-Fragment entfernen, damit wir nicht mehrfach verarbeiten
            if (window.history && window.history.replaceState) {
              window.history.replaceState(null, "", window.location.pathname);
            }
          }
        }
        
        // Nach Token-Verarbeitung mit normaler Profilprüfung fortfahren
        await checkUserProfile();
      } catch (err) {
        console.error('Fehler bei der Token-Verarbeitung:', err);
        setError(`Fehler bei der Token-Verarbeitung: ${err}`);
        setIsLoading(false);
      }
    }
    
    // 2. Funktion zum Abrufen des Benutzerprofils (bestehende Logik)
    async function checkUserProfile() {
      try {
        // Aktuelle Session abrufen
        setMessage('Prüfe Anmeldestatus...');
        const { data: { session } } = await supabase.auth.getSession();
        
        // Wenn keine Session vorhanden ist, zeigen wir einen Fehler an
        if (!session) {
          console.error('Keine aktive Session gefunden');
          setError('Keine aktive Benutzersitzung gefunden. Bitte logge dich erneut ein.');
          setIsLoading(false);
          return;
        }
        
        console.log('Session gefunden für:', session.user.email);
        setMessage(`Suche Profil für ${session.user.email}...`);
        
        // Profil direkt mit der Benutzer-ID suchen
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
        
        // Profil sofort suchen
        const initialProfile = await findProfile();
        
        // Wenn das Profil gefunden wurde, direkt weiterleiten
        if (initialProfile) {
          console.log('Profil sofort gefunden:', initialProfile.name);
          router.replace(Team_Routes.Selection);
          return;
        }
        
        // Wenn kein Profil gefunden wurde, starten wir das Polling
        console.log('Kein Profil gefunden, starte Polling...');
        setMessage('Warte auf Profilaktivierung...');
        
        // Polling-Logik
        let attempts = 0;
        const maxAttempts = 15; // 15 Versuche mit je 2 Sekunden Abstand (30 Sekunden gesamt)
        
        pollInterval = setInterval(async () => {
          attempts++;
          setPollCount(attempts);
          
          console.log(`Polling-Versuch ${attempts}/${maxAttempts}`);
          
          // Prüfen, ob das maximale Limit erreicht wurde
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval!);
            setError('Zeitüberschreitung bei der Suche nach deinem Profil. Bitte versuche, dich erneut anzumelden.');
            setIsLoading(false);
            return;
          }
          
          // Profil erneut suchen
          const profile = await findProfile();
          
          if (profile) {
            console.log('Profil nach Polling gefunden:', profile.name);
            clearInterval(pollInterval!);
            router.replace(Team_Routes.Selection);
          }
        }, 2000); // Alle 2 Sekunden prüfen
        
      } catch (err) {
        console.error('Unerwarteter Fehler:', err);
        setError(`Ein unerwarteter Fehler ist aufgetreten: ${err}`);
        setIsLoading(false);
        
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      }
    }
    
    // 3. Starte den Prozess mit Token-Verarbeitung
    processUrlToken();
    
    // 4. Aufräumen bei Komponenten-Unmount
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
          <>
            <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />
            <Text style={styles.message}>{message}</Text>
            {pollCount > 0 && (
              <Text style={styles.pollCount}>Versuch {pollCount}/15...</Text>
            )}
          </>
        ) : error ? (
          <>
            <Text style={styles.errorTitle}>Fehler</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </>
        ) : (
          <>
            <Text style={styles.successTitle}>Verifiziert!</Text>
            <Text style={styles.message}>Du wirst weitergeleitet...</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

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