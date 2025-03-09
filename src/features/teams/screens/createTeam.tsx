// app/(teams)/create.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../_constants/createTeamStyleSheet';
import {Team_Routes } from '../_constants/routes'
import { ComponentCaptions } from '../_constants/componentCaptions';

export default function CreateTeamScreen() {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const router = useRouter();
  
  const handleCreateTeam = () => {
    // Implement team creation logic here
    // After creating the team, navigate to the team home
    router.replace(Team_Routes.Selection);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
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
          >
            <Text style={styles.cancelButtonText}>{ComponentCaptions.createTeam.cancelButtonText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateTeam}
          >
            <Text style={styles.createButtonText}>{ComponentCaptions.createTeam.createTeamLabel}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
