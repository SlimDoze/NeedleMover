// app/index.tsx
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { AppColors } from '@/common/constants/AppColors';
import { supabase } from '@/lib/supabase';

export default function AuthSelectionScreen() {
  const router = useRouter();

  // Deep-Link & Hash-Parameter verarbeiten
  useEffect(() => {
    const processHashParams = async () => {
      try {
        if (typeof window !== 'undefined') {
          const hash = window.location.hash;
          console.log("URL Hash gefunden:", hash);
          
          // Nach access_token suchen
          const accessTokenMatch = hash.match(/access_token=([^&]*)/);
          const refreshTokenMatch = hash.match(/refresh_token=([^&]*)/);
          const typeMatch = hash.match(/type=([^&]*)/);
          
          if (accessTokenMatch && accessTokenMatch[1]) {
            const accessToken = decodeURIComponent(accessTokenMatch[1]);
            console.log("Access token extrahiert (erste 10 Zeichen):", accessToken.substring(0, 10));
            
            let refreshToken = '';
            if (refreshTokenMatch && refreshTokenMatch[1]) {
              refreshToken = decodeURIComponent(refreshTokenMatch[1]);
              console.log("Refresh token gefunden");
            }
            
            // Session mit dem Token setzen
            console.log("Setze Session mit dem Token...");
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error("Fehler beim Setzen der Session:", error);
            } else {
              console.log("Session erfolgreich gesetzt für:", data.user?.email);
              
              // Prüfe den Typ des Auth-Vorgangs
              const type = typeMatch && typeMatch[1] ? typeMatch[1] : '';
              console.log("Auth-Typ:", type);
              
              // Bei Signup zur Verify-Seite weiterleiten
              if (type === 'signup') {
                console.log("Signups werden zur Verify-Seite weitergeleitet");
                router.replace('/features/auth/screens/verify');
              } else {
                // Bei anderen Auth-Typen, zur Team-Auswahl weiterleiten
                console.log("Andere Auth-Typen zur Team-Auswahl weiterleiten");
                setTimeout(() => {
                  router.replace('/features/teams/screens/selection');
                }, 1000);
              }
            }
          }
        }
      } catch (err) {
        console.error("Fehler bei URL-Hash-Verarbeitung:", err);
      }
    };
    
    processHashParams();
  }, [router]);

  const navigateToSignUp = () => {
    router.push('/features/auth/screens/signup');
  };
  
  const navigateToLogin = () => {
    router.push('/features/auth/screens/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Needle Mover</Text>
        <Text style={styles.subtitle}>Music collaboration made simple</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: AppColors.primary }]} 
          onPress={navigateToSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: AppColors.primary }]} 
          onPress={navigateToLogin}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Styles bleiben gleich...
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: AppColors.text.dark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: AppColors.text.muted,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: AppColors.text.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
});