// app/features/auth/screens/verify.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppColors } from '@/common/constants/AppColors';
import { Team_Routes } from '../_constants/routes';
import { AuthService } from '@/lib/auth';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Validiere E-Mail...');
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  
  // Neue Funktion: URL Hash analysieren
  const extractTokenFromHash = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      console.log("Full URL hash:", hash);
      
      // Verschiedene Hash-Formate verarbeiten
      if (hash) {
        // Nach access_token suchen
        const tokenMatch = hash.match(/access_token=([^&]*)/);
        const refreshMatch = hash.match(/refresh_token=([^&]*)/);
        
        if (tokenMatch && tokenMatch[1]) {
          console.log("Access token gefunden im Hash");
          return {
            accessToken: decodeURIComponent(tokenMatch[1]),
            refreshToken: refreshMatch && refreshMatch[1] ? decodeURIComponent(refreshMatch[1]) : null
          };
        }
      }
    }
    return null;
  };
  
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    
    async function verifyEmail() {
      try {
        // 1. Prüfen, ob wir Tokens im URL-Hash haben (direkte Weiterleitung von Supabase)
        const hashTokens = extractTokenFromHash();
        
        if (hashTokens?.accessToken) {
          console.log("Verarbeite Auth-Tokens aus URL-Hash");
          try {
            // Der authState wird automatisch durch den supabase-Client aktualisiert
            const { data, error } = await supabase.auth.setSession({
              access_token: hashTokens.accessToken,
              refresh_token: hashTokens.refreshToken || '',
            });
            
            if (error) {
              console.error("Fehler beim Setzen der Session:", error);
              setError(`Fehler beim Setzen der Session: ${error.message}`);
              setIsLoading(false);
              return;
            }
            
            // Erfolgreich authentifiziert, jetzt nach dem Profil suchen
            setMessage('Authentifizierung erfolgreich! Warte auf Profilaktivierung...');
            
            // User-Email aus dem Auth-Objekt holen
            const email = data.user?.email;
            if (!email) {
              setError('Keine E-Mail-Adresse in den Auth-Daten gefunden');
              setIsLoading(false);
              return;
            }
            
            // Nach Profil suchen starten
            await startPollingForProfile(email);
          } catch (err) {
            console.error("Fehler bei der Hash-Token-Verarbeitung:", err);
            setError(`Unerwarteter Fehler: ${err}`);
            setIsLoading(false);
          }
          return;
        }
        
        // 2. URL-Parameter aus unserer Edge Function-Weiterleitung prüfen
        const verified = params.verified as string;
        const email = params.email as string;
        const token = params.token as string;
        const type = params.type as string;
        
        console.log("URL-Parameter:", { verified, email, token, type });
        
        // 2a. Bereits von Edge Function verifiziert
        if (verified === 'true' && email) {
          setMessage('E-Mail bestätigt! Warte auf Profilaktivierung...');
          await startPollingForProfile(email);
          return;
        }
        
        // 2b. Muss noch verifiziert werden mit Token
        if (token && type && email) {
          setMessage('Bestätige E-Mail-Adresse...');
          
          const { error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
          });
          
          if (verifyError) {
            console.error('Verifizierungsfehler:', verifyError);
            setError(verifyError.message);
            setIsLoading(false);
            return;
          }
          
          setMessage('E-Mail bestätigt! Warte auf Profilaktivierung...');
          await startPollingForProfile(email);
          return;
        }
        
        // 3. Fallback: Versuchen über die aktuelle Session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          console.log("Benutze aktuelle Session mit Email:", session.user.email);
          await startPollingForProfile(session.user.email);
          return;
        }
        
        // Keine der Methoden hat funktioniert
        setError('Keine gültigen Authentifizierungsdaten gefunden. Bitte versuche erneut, dich anzumelden.');
        setIsLoading(false);
      } catch (err) {
        console.error('Unerwarteter Fehler:', err);
        setError(`Ein unerwarteter Fehler ist aufgetreten: ${err}`);
        setIsLoading(false);
      }
    }
    
    // Funktion zum Starten des Profilpollings
    async function startPollingForProfile(email: string) {
      try {
        // Sofort prüfen
        const profile = await AuthService.getProfileByEmail(email);
        console.log("Initiales Profilprüfungsergebnis:", profile);
        
        if (profile) {
          console.log("Profil sofort gefunden, leite weiter");
          router.replace(Team_Routes.Selection);
          return;
        }
        
        // Polling starten
        let maxPolls = 30; // 30 Versuche = 1 Minute bei 2-Sekunden-Intervall
        
        pollInterval = setInterval(async () => {
          setPollCount(prevCount => {
            const newCount = prevCount + 1;
            console.log(`Polling-Versuch ${newCount}/${maxPolls}`);
            
            if (newCount >= maxPolls) {
              clearInterval(pollInterval!);
              setMessage('Zeitüberschreitung bei der Profilerstellung. Bitte aktualisiere die Seite oder kontaktiere den Support.');
              setIsLoading(false);
              return newCount;
            }
            return newCount;
          });
          
          try {
            const profileCheck = await AuthService.getProfileByEmail(email);
            console.log(`Polling-Ergebnis #${pollCount+1}:`, profileCheck);
            
            if (profileCheck) {
              console.log("Profil gefunden, leite weiter zur Team-Auswahl");
              clearInterval(pollInterval!);
              router.replace(Team_Routes.Selection);
            }
          } catch (pollingError) {
            console.error("Fehler während Polling:", pollingError);
          }
        }, 2000);
      } catch (error) {
        console.error("Fehler beim Starten des Profilpollings:", error);
        setError(`Fehler beim Prüfen des Profils: ${error}`);
        setIsLoading(false);
      }
    }
    
    verifyEmail();
    
    // Cleanup beim Unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [params, router]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>E-Mail-Bestätigung</Text>
        
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />
            <Text style={styles.message}>{message}</Text>
            {pollCount > 0 && (
              <Text style={styles.pollCount}>Prüfung {pollCount}/30...</Text>
            )}
          </>
        ) : error ? (
          <>
            <Text style={styles.errorTitle}>Fehler</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </>
        ) : (
          <>
            <Text style={styles.successTitle}>Bestätigt!</Text>
            <Text style={styles.message}>{message}</Text>
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