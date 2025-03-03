// app/(teams)/[id]/create-space.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { AppColors } from '@/constants/AppColors';

export default function CreateSpaceScreen() {
  const { id: teamId } = useLocalSearchParams();
  const router = useRouter();
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('single'); // 'single' or 'multi'

  const handleCreateSpace = () => {
    if (!spaceName.trim()) {
      Alert.alert('Error', 'Please enter a space name');
      return;
    }

    // Implement space creation logic here
    console.log('Creating space:', {
      teamId,
      name: spaceName,
      type: spaceType
    });

    // After creating the space, navigate back to the team details
    Alert.alert('Success', 'Space created successfully!', [
      {
        text: 'OK',
        onPress: () => router.back()
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Create a New Space</Text>
          <Text style={styles.subtitle}>Set up a workspace for your music release</Text>
        </View>
        
        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Space Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter space name"
              value={spaceName}
              onChangeText={setSpaceName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Space Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity 
                style={[
                  styles.typeCard,
                  spaceType === 'single' && styles.typeCardSelected
                ]}
                onPress={() => setSpaceType('single')}
              >
                <Feather 
                  name="music" 
                  size={24} 
                  color={spaceType === 'single' ? AppColors.primary : '#6B7280'} 
                  style={styles.typeIcon} 
                />
                <Text style={[
                  styles.typeName,
                  spaceType === 'single' && styles.typeNameSelected
                ]}>
                  Single Release
                </Text>
                <Text style={styles.typeDescription}>
                  For releasing a single track
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.typeCard,
                  spaceType === 'multi' && styles.typeCardSelected
                ]}
                onPress={() => setSpaceType('multi')}
              >
                <Feather 
                  name="disc" 
                  size={24} 
                  color={spaceType === 'multi' ? AppColors.primary : '#6B7280'} 
                  style={styles.typeIcon} 
                />
                <Text style={[
                  styles.typeName,
                  spaceType === 'multi' && styles.typeNameSelected
                ]}>
                  Multi-Track Release
                </Text>
                <Text style={styles.typeDescription}>
                  For EP, album, or mixtape
                </Text>
              </TouchableOpacity>
            </View>
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
            onPress={handleCreateSpace}
          >
            <Text style={styles.createButtonText}>Create Space</Text>
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
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
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeCard: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F9FAFC',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  typeCardSelected: {
    borderColor: AppColors.primary,
    backgroundColor: `${AppColors.primary}10`, // 10% opacity
  },
  typeIcon: {
    marginBottom: 8,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text.dark,
    marginBottom: 4,
  },
  typeNameSelected: {
    color: AppColors.primary,
  },
  typeDescription: {
    fontSize: 12,
    color: AppColors.text.muted,
    textAlign: 'center',
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