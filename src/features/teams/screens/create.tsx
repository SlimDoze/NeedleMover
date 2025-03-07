// app/(teams)/create.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppColors } from '@/common/constants/AppColors';
import { Platform } from 'react-native';

export default function CreateTeamScreen() {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const router = useRouter();

  const handleCreateTeam = () => {
    // Implement team creation logic here
    // After creating the team, navigate to the team home
    router.replace('../(teams)/selection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Create a New Team</Text>
          <Text style={styles.subtitle}>Set up your music collaboration team</Text>
        </View>
        
        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Team Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter team name"
              value={teamName}
              onChangeText={setTeamName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
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
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateTeam}
          >
            <Text style={styles.createButtonText}>Create Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.text.dark,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.text.muted,
    marginTop: 8,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
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
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
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
  createButton: {
    backgroundColor: AppColors.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: AppColors.text.dark,
    fontWeight: '600',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});