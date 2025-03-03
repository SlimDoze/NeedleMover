// app/(teams)/join.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppColors } from '@/constants/AppColors';

export default function JoinTeamScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const router = useRouter();

  const handleJoinTeam = () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    // Implement team joining logic here
    // This would typically validate the code against your backend
    console.log('Joining team with code:', inviteCode);
    
    // For now, simulate successful join and navigate to the team selection
    Alert.alert('Success', 'You have joined the team successfully!', [
      {
        text: 'OK',
        onPress: () => router.replace('../(teams)/selection')
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Join a Team</Text>
          <Text style={styles.subtitle}>Enter the invite code to join an existing team</Text>
        </View>
        
        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Invite Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter invite code"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              The invite code is provided by the team admin
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.joinButton]}
            onPress={handleJoinTeam}
          >
            <Text style={styles.joinButtonText}>Join Team</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.text.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.text.muted,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: AppColors.text.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFC',
  },
  helperText: {
    fontSize: 14,
    color: AppColors.text.muted,
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  joinButton: {
    backgroundColor: AppColors.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: AppColors.text.dark,
    fontWeight: '600',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});