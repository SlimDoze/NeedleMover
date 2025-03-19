// app/features/auth/screens/verify.tsx - Vereinfachter Debugging-Ansatz
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppColors } from '@/common/constants/AppColors';
import { Team_Routes } from '../_constants/routes';

export default function VerifyScreen() {
  const router = useRouter();
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  
  // Einfache Log-Funktion, die Nachrichten auf dem Bildschirm anzeigt
  const log = (message: string) => {
    console.log(message);
    setLogMessages(prev => [...prev, message]);
  };
  
  // Extrahiere Token aus der vollständigen URL
  const extractTokensFromUrl = (url: string) => {
    log(`Analysiere URL: ${url}`);
    
    // Nach access_token im Hash suchen
    const hashMatch = url.match(/#(?:access_token)=([^&]*)/);
    if (hashMatch && hashMatch[1]) {
      const accessToken = decodeURIComponent(hashMatch[1]);
      log(`Access Token gefunden (erste 10 Zeichen): ${accessToken.substring(0, 10)}...`);
      
      // Nach refresh_token suchen
      const refreshMatch = url.match(/refresh_token=([^&]*)/);
      const refreshToken = refreshMatch && refreshMatch[1] 
        ? decodeURIComponent(refreshMatch[1]) 
        : '';
      
      return { accessToken, refreshToken };
    }
    
    log("Kein Access Token im Hash gefunden");
    return null;
  };
  
  useEffect(() => {
    async function handleVerification() {
      try {
        log("=== VERIFIKATIONS-DEBUGGER GESTARTET ===");
        
        if (typeof window !== 'undefined') {
          const fullUrl = window.location.href;
          log(`Volle URL: ${fullUrl}`);
          
          // Direkt aus der vollen URL extrahieren
          const tokens = extractTokensFromUrl(fullUrl);
          
          if (tokens) {
            log("Tokens gefunden, versuche Session zu setzen...");
            
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken
              });
              
              if (error) {
                log(`Session-Fehler: ${error.message}`);
              } else {
                log("Session erfolgreich gesetzt!");
                log(`User ID: ${data.user?.id || 'Nicht verfügbar'}`);
                log(`User Email: ${data.user?.email || 'Nicht verfügbar'}`);
                
                // Aktuelle Session prüfen
                const { data: sessionData } = await supabase.auth.getSession();
                if (sessionData.session) {
                  log("Session erfolgreich verifiziert");
                  
                  // Profil abrufen und prüfen
                  log("Warte 2 Sekunden auf Profilerstellung...");
                  setTimeout(async () => {
                    try {
                      const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', sessionData.session!.user.id)
                        .single();
                      
                      if (profileError) {
                        log(`Profil-Fehler: ${profileError.message}`);
                      } else if (profileData) {
                        log("Profil gefunden!");
                        log(JSON.stringify(profileData, null, 2));
                        
                        // Weiterleitung zur Team-Auswahl
                        log("Erfolg! Leite zur Team-Auswahl weiter...");
                        setComplete(true);
                      } else {
                        log("Kein Profil gefunden für diese Benutzer-ID");
                      }
                    } catch (err) {
                      log(`Fehler bei Profilabfrage: ${err}`);
                    }
                  }, 2000);
                } else {
                  log("Keine Session nach setSession");
                }
              }
            } catch (err) {
              log(`Fehler bei setSession: ${err}`);
            }
          } else {
            // Alternative Methode: Prüfen auf URL-Parameter (token, type, email)
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const type = urlParams.get('type');
            const email = urlParams.get('email');
            
            if (token && type === 'signup' && email) {
              log(`OTP-Parameter gefunden: Token=${token.substring(0, 10)}..., Type=${type}, Email=${email}`);
              
              try {
                const { error } = await supabase.auth.verifyOtp({
                  email,
                  token,
                  type: 'signup'
                });
                
                if (error) {
                  log(`OTP-Verifikationsfehler: ${error.message}`);
                } else {
                  log("OTP erfolgreich verifiziert");
                  
                  // Aktuelle Session prüfen
                  const { data: sessionData } = await supabase.auth.getSession();
                  if (sessionData.session) {
                    log("Session nach OTP-Verifikation gefunden");
                    // Weitere Prozesse wie oben...
                  } else {
                    log("Keine Session nach OTP-Verifikation");
                  }
                }
              } catch (err) {
                log(`Fehler bei OTP-Verifikation: ${err}`);
              }
            } else {
              log("Keine Token-Parameter in der URL gefunden");
              
              // Fallback: Bestehende Session prüfen
              try {
                const { data: sessionData } = await supabase.auth.getSession();
                if (sessionData.session) {
                  log("Bestehende Session gefunden");
                  log(`User: ${sessionData.session.user.email}`);
                  // Weitere Prozesse...
                } else {
                  log("Keine bestehende Session gefunden");
                }
              } catch (err) {
                log(`Fehler bei Session-Abfrage: ${err}`);
              }
            }
          }
        } else {
          log("Window-Objekt nicht verfügbar");
        }
      } catch (err) {
        log(`Allgemeiner Fehler: ${err}`);
      }
    }
    
    handleVerification();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Auth-Debugger</Text>
        <Text style={styles.subtitle}>
          {complete ? 'Verifizierung erfolgreich!' : 'Verifizierung läuft...'}
        </Text>
      </View>
      
      <ScrollView style={styles.logContainer}>
        {logMessages.map((message, index) => (
          <Text key={index} style={styles.logMessage}>{message}</Text>
        ))}
      </ScrollView>
      
      {complete && (
        <View style={styles.buttonContainer}>
          <Button 
            title="Zur Team-Auswahl" 
            onPress={() => router.replace(Team_Routes.Selection)} 
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    padding: 20,
    backgroundColor: AppColors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  logContainer: {
    flex: 1,
    padding: 10,
  },
  logMessage: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f5f5f5',
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  }
});