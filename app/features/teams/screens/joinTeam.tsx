// app/features/teams/screens/joinTeam.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../_constants/joinTeamStyleSheet';
import { ComponentCaptions } from '../_constants/componentCaptions';
import { useJoinTeam } from '../_hooks/useJoinTeam';
import { AppColors } from '@/common/constants/AppColors';

export default function JoinTeamScreen() {
  const router = useRouter();
  const { 
    inviteCode, 
    setInviteCode, 
    isLoading, 
    handleJoinTeam 
  } = useJoinTeam();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{ComponentCaptions.joinTeam.title}</Text>
            <Text style={styles.subtitle}>{ComponentCaptions.joinTeam.subtitle}</Text>
          </View>
          
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{ComponentCaptions.joinTeam.label}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter invite code"
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>
                {ComponentCaptions.joinTeam.helperText}
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>{ComponentCaptions.joinTeam.cancelButtonText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.joinButton]}
              onPress={handleJoinTeam}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={AppColors.text.light} />
              ) : (
                <Text style={styles.joinButtonText}>{ComponentCaptions.joinTeam.joinButtonText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}