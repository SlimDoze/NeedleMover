// app/(teams)/join.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../../teams/_constants/joinTeamStyleSheet';
import { Team_Routes } from '../_constants/routes';
import { JoinTeamMsg } from '../_constants/TeamAlertMsg'
import { ComponentCaptions } from '../_constants/componentCaptions'

export default function JoinTeamScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const router = useRouter();

  const handleJoinTeam = () => {
    if (!inviteCode.trim()) {
      Alert.alert(JoinTeamMsg.ErrorHeader, JoinTeamMsg.ErrorNoInviteCode);
      return;
    }

    // Implement team joining logic here
    // This would typically validate the code against your backend
    console.log('Joining team with code:', inviteCode);
    
    // For now, simulate successful join and navigate to the team selection
    Alert.alert(JoinTeamMsg.SucessHeader, JoinTeamMsg.SuccessBody, [
      {
        text: 'OK',
        onPress: () => router.replace(Team_Routes.Selection)
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{ComponentCaptions.joinTeam.title}</Text>
          <Text style={styles.subtitle}>{ComponentCaptions.joinTeam.subtitle}</Text>
        </View>
        
        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{ComponentCaptions.joinTeam.helperText}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter invite code"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
            {ComponentCaptions.joinTeam.subtitle}
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>{ComponentCaptions.joinTeam.cancelButtonText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.joinButton]}
            onPress={handleJoinTeam}
          >
            <Text style={styles.joinButtonText}>{ComponentCaptions.joinTeam.joinButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
