// app/(teams)/join.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../../teams/_constants/joinTeamStyleSheet';

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
