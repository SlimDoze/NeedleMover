// app/common/components/ProfileDebugButton.tsx
import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

interface ProfileDebugButtonProps {
  style?: object;
}

const ProfileDebugButton: React.FC<ProfileDebugButtonProps> = ({ style }) => {
  const { profile, user } = useAuth();

  const showDebugInfo = async () => {
    console.log("=== AUTH DEBUG INFO ===");
    console.log("Current profile:", profile);
    console.log("Current user:", user);

    // Session prüfen
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("Current session:", sessionData.session);

    // Profil direkt aus der Datenbank abrufen
    if (user?.id) {
      const { data: dbProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log("DB Profile:", dbProfile);
      if (error) {
        console.error("DB Profile error:", error);
      }
    }

    Alert.alert(
      "Auth Debug Info",
      `Anmeldestatus: ${user ? 'Eingeloggt' : 'Nicht eingeloggt'}\n` +
      `User ID: ${user?.id || 'Nicht verfügbar'}\n` +
      `Email: ${user?.email || 'Nicht verfügbar'}\n` +
      `Profil: ${profile ? 'Vorhanden' : 'Nicht vorhanden'}\n` +
      `Session: ${sessionData.session ? 'Aktiv' : 'Keine'}\n\n` +
      "Vollständige Informationen in der Konsole."
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={showDebugInfo}
    >
      <Text style={styles.buttonText}>Debug Auth</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
  }
});

export default ProfileDebugButton;