// app/features/auth/screens/verify.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppColors } from '@/common/constants/AppColors';
import { Team_Routes } from '../_constants/routes';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Validiere E-Mail...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function verifyEmail() {
      try {
        const token = params.token as string;
        const type = params.type as string;
        const email = params.email as string;
        
        if (!token || !type || !email) {
          setError('Ungültige Parameter. Erforderlich: token, type, email');
          setIsLoading(false);
          return;
        }
        
        // Verifizierung mit Supabase
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        });
        
        if (error) {
          console.error('Verifizierungsfehler:', error);
          setError(error.message);
          setIsLoading(false);
          return;
        }
        
        setMessage('E-Mail bestätigt! Du wirst weitergeleitet...');
        
        // Warte einen kurzen Moment, bevor zur Team-Auswahl weitergeleitet wird
        setTimeout(() => {
          router.replace(Team_Routes.Selection);
        }, 1500);
        
      } catch (err) {
        console.error('Unerwarteter Fehler:', err);
        setError('Ein unerwarteter Fehler ist aufgetreten');
        setIsLoading(false);
      }
    }
    
    verifyEmail();
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