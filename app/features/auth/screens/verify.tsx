// app/features/auth/screens/verify.tsx - Überarbeitete Version
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppColors } from '@/common/constants/AppColors';
import { Team_Routes } from '../_constants/routes';
import { AuthService } from '@/lib/auth';
import { useAuth } from '@/lib/authContext';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('Validiere E-Mail...');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  useEffect(() => {
    async function verifyEmail() {
      try {
        const token = params.token as string;
        const type = params.type as string;
        const emailParam = params.email as string;
        
        if (!token || !type || !emailParam) {
          setError('Ungültige Parameter. Erforderlich: token, type, email');
          setIsLoading(false);
          return;
        }
        
        setEmail(emailParam);
        
        // Verifizierung mit Supabase
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: emailParam,
          token,
          type: 'signup',
        });
        
        if (verifyError) {
          console.error('Verifizierungsfehler:', verifyError);
          setError(verifyError.message);
          setIsLoading(false);
          return;
        }
        
        // Email wurde erfolgreich verifiziert
        setIsVerified(true);
        setMessage('E-Mail bestätigt! Du kannst dich jetzt anmelden.');
        setIsLoading(false);
        
      } catch (err) {
        console.error('Unerwarteter Fehler:', err);
        setError('Ein unerwarteter Fehler ist aufgetreten');
        setIsLoading(false);
      }
    }
    
    verifyEmail();
  }, [params, router]);
  
  // Funktion zum automatischen Login nach Verifizierung
  const handleLogin = async () => {
    if (!email) return;
    
    setIsLoading(true);
    setMessage('Melde dich an...');
    
    try {
      // Verzögerung hinzufügen, um sicherzustellen, dass das Profil erstellt wurde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Nach erfolgreicher Verifizierung den Login-Vorgang starten
      const response = await AuthService.loginAfterEmailConfirmation(email);
      
      if (response.success) {
        // Aktualisiere den Auth-Zustand mit dem neuen Benutzer
        await refreshUser();
        
        // Zur Team-Auswahl weiterleiten
        router.replace(Team_Routes.Selection);
      } else {
        setError('Login fehlgeschlagen: ' + (response.message || 'Unbekannter Fehler'));
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login-Fehler:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten beim Login');
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>E-Mail-Bestätigung</Text>
        
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
          <>
            <Text style={styles.successTitle}>Bestätigt!</Text>
            <Text style={styles.message}>{message}</Text>
            
            {isVerified && (
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Jetzt anmelden</Text>
              </TouchableOpacity>
            )}
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
    marginBottom: 24,
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
  loginButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});