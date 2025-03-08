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
import { AppColors } from '@/common/constants/AppColors';
import { styles } from "../../_constants/createSpaceStyleSheet";

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
