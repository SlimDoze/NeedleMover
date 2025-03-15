// app/features/auth/screens/callback.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { sessionStorage } from '@/lib/supabase';
import { AppColors } from '@/common/constants/AppColors';
import { Team_Routes } from '../_constants/routes';
import { useAuth } from '@/lib/authContext';

export default function AuthCallback() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Authentifizierung wird verarbeitet...');
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Markiere Komponente als montiert
  useEffect(() => {
    console.log("Auth Callback wurde gemounted");
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Extrahiere Token aus URL-Fragment
  const extractTokensFromURL = () => {
    if (Platform.OS !== 'web') {
      return null; // Wir sind nicht im Web
    }

    try {
      // Direkter Zugriff auf das window.location.hash
      console.log("Versuche Tokens zu extrahieren. URL-Hash vorhanden:", !!window.location.hash);
      
      if (window.location.hash) {
        // Hash ohne das führende # bekommen
        const hash = window.location.hash.substring(1);
        console.log("Hash-Inhalt (gekürzt):", hash.substring(0, 30) + "...");
        
        // Hash als URL-Parameter parsen
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        console.log("Token-Extraktion:", {
          accessTokenGefunden: !!accessToken,
          refreshTokenGefunden: !!refreshToken,
          type
        });
        
        if (accessToken && refreshToken) {
          return { accessToken, refreshToken, type };
        }
      }
    } catch (err) {
      console.error("Fehler bei Token-Extraktion:", err);
    }
    
    return null;
  };
  
  // Hauptlogik für die Token-Verarbeitung
  useEffect(() => {
    // Warte, bis die Komponente gemounted ist, bevor wir irgendetwas tun
    if (!isMounted) return;
    
    const processAuthentication = async () => {
      try {
        console.log('Auth Callback: Starte Token-Verarbeitung');
        
        // Token aus URL extrahieren
        const tokens = extractTokensFromURL();
        
        if (!tokens) {
          console.error("Keine Tokens in der URL gefunden");
          setError('Keine gültigen Auth-Tokens gefunden');
          setIsLoading(false);
          return;
        }
        
        console.log('Auth Callback: Tokens extrahiert', {
          type: tokens.type,
          accessTokenPrefix: tokens.accessToken.substring(0, 10) + '...',
          refreshTokenPrefix: tokens.refreshToken.substring(0, 5) + '...'
        });
        
        // 1. Session-Persistenz aktivieren
        setMessage('Aktiviere Session-Persistenz...');
        await sessionStorage.setPersistSession(true);
        console.log("Session-Persistenz auf TRUE gesetzt");
        
        // 2. Session mit Tokens setzen
        setMessage('Setze Session mit Tokens...');
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken
        });
        
        if (sessionError) {
          console.error('Fehler beim Setzen der Session:', sessionError);
          setError('Fehler beim Setzen der Session: ' + sessionError.message);
          setIsLoading(false);
          return;
        }
        
        if (!data?.session) {
          console.error("Session konnte nicht gesetzt werden");
          setError('Keine Session nach dem Setzen der Token');
          setIsLoading(false);
          return;
        }
        
        console.log('Auth Callback: Session erfolgreich gesetzt, User ID:', data.session.user.id);
        
        // 3. Auth-Kontext aktualisieren
        setMessage('Aktualisiere Benutzerkontext...');
        await refreshUser();
        console.log("Benutzerkontext aktualisiert");
        
        // 4. Session speichern, um sicherzustellen, dass sie persistiert wird
        await sessionStorage.setPersistSession(true);
        
        // Kurze Verzögerung für UI-Feedback
        setMessage('Authentifizierung erfolgreich, leite weiter...');
        
        setTimeout(() => {
          if (isMounted) {
            console.log("Navigiere zum Team-Selection Screen");
            // Explizite Navigation zur Team-Auswahl
            router.replace(Team_Routes.Selection);
          }
        }, 1000);
        
      } catch (e) {
        console.error('Unerwarteter Fehler im Auth Callback:', e);
        setError('Ein unerwarteter Fehler ist aufgetreten: ' + (e instanceof Error ? e.message : String(e)));
        setIsLoading(false);
      }
    };

    // Füge eine kurze Verzögerung hinzu, damit der Browser Zeit hat, das URL-Fragment zu verarbeiten
    setTimeout(() => {
      processAuthentication();
    }, 300);
  }, [router, refreshUser, isMounted]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Authentifizierung</Text>
        
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color={AppColors.primary} style={styles.loader} />
            <Text style={styles.message}>{message}</Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.errorTitle}>Fehler</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </>
        ) : (
          <Text style={styles.successMessage}>Authentifizierung erfolgreich!</Text>
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
    maxWidth: '80%',
  },
  successMessage: {
    fontSize: 18,
    color: '#38A169',
    textAlign: 'center',
  },
});