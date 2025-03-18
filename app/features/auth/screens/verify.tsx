// app/features/auth/screens/verify.tsx - überarbeitete Version
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '@/lib/auth';
import { AppColors } from '@/common/constants/AppColors';
import { Team_Routes } from '../_constants/routes';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Überprüfe Bestätigung...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Polling-Intervall für Profilprüfung
    let pollingInterval: NodeJS.Timeout | null = null;

    async function checkEmailConfirmation() {
      try {
        const email = params.email as string;
        
        if (!email) {
          setError('E-Mail-Parameter fehlt');
          setIsLoading(false);
          return;
        }
        
        console.log('Überprüfe E-Mail-Bestätigung für:', email);
        
        // Versuche, das Profil zu finden (was bedeutet, dass die E-Mail bestätigt wurde)
        const checkProfile = async () => {
          const profile = await AuthService.getProfileByEmail(email);
          
          if (profile) {
            console.log('Profil gefunden:', profile);
            // Erfolg - Profil existiert
            if (pollingInterval) {
              clearInterval(pollingInterval);
              pollingInterval = null;
            }
            
            setMessage('E-Mail bestätigt! Du wirst weitergeleitet...');
            
            // Kurze Verzögerung für bessere Benutzererfahrung
            setTimeout(() => {
              router.replace(Team_Routes.Selection);
            }, 1500);
          }
        };
        
        // Prüfe sofort einmal
        await checkProfile();
        
        // Wenn kein Profil gefunden wurde, starte Polling
        if (isLoading) {
          pollingInterval = setInterval(checkProfile, 2000); // Alle 2 Sekunden prüfen
          
          // Nach 30 Sekunden Timeout
          setTimeout(() => {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              pollingInterval = null;
              
              if (isLoading) {
                setError('Zeitüberschreitung bei der Bestätigung. Bitte versuche es später erneut.');
                setIsLoading(false);
              }
            }
          }, 30000);
        }
        
      } catch (err) {
        console.error('Unerwarteter Fehler:', err);
        setError('Ein unerwarteter Fehler ist aufgetreten');
        setIsLoading(false);
      }
    }
    
    checkEmailConfirmation();
    
    // Cleanup beim Unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
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
  // Styles unverändert
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