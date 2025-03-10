// app/features/teams/screens/createTeam.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../_constants/createTeamStyleSheet';
import { Team_Routes } from '../_constants/routes';
import { ComponentCaptions } from '../_constants/componentCaptions';
import { useCreateTeam } from '../_hooks/useCreateTeam';
import { AppColors } from '@/common/constants/AppColors';

export default function CreateTeamScreen() {
  const router = useRouter();
  const {
    teamName,
    setTeamName,
    teamDescription,
    setTeamDescription,
    isLoading,
    handleCreateTeam
  } = useCreateTeam();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{ComponentCaptions.createTeam.title}</Text>
            <Text style={styles.subtitle}>{ComponentCaptions.createTeam.subtitle}</Text>
          </View>
          
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{ComponentCaptions.createTeam.teamNamelabel}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter team name"
                value={teamName}
                onChangeText={setTeamName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{ComponentCaptions.createTeam.descriptionLabel}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your team and its goals"
                value={teamDescription}
                onChangeText={setTeamDescription}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>{ComponentCaptions.createTeam.cancelButtonText}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleCreateTeam}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={AppColors.text.light} />
              ) : (
                <Text style={styles.createButtonText}>{ComponentCaptions.createTeam.createTeamLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}