// app/(teams)/[id]/create-space.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { AppColors } from '@/common/constants/AppColors';
import { styles } from "../../_constants/createSpaceStyleSheet";
import { CustomAlert } from '@/common/lib/alert';
import { ComponentCaptions } from '../../_constants/componentCaptions';

export default function CreateSpaceScreen() {
  const { id: teamId } = useLocalSearchParams();
  const router = useRouter();
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('single'); // 'single' or 'multi'

  const handleCreateSpace = () => {
    if (!spaceName.trim()) {
      CustomAlert('Error', 'Please enter a space name');
      return;
    }

    // Implement space creation logic here
    console.log('Creating space:', {
      teamId,
      name: spaceName,
      type: spaceType
    });

    // After creating the space, navigate back to the team details
    CustomAlert('Success', 'Space created successfully!', [
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
          <Text style={styles.title}>{ComponentCaptions.createWorkspace.title}</Text>
          <Text style={styles.subtitle}>{ComponentCaptions.createWorkspace.subtitle}</Text>
        </View>
        
        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{ComponentCaptions.createWorkspace.spaceNameLabel}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter space name"
              value={spaceName}
              onChangeText={setSpaceName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{ComponentCaptions.createWorkspace.spaceTypeLabel}</Text>
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
                  {ComponentCaptions.createWorkspace.singleReleaseLabel}
                </Text>
                <Text style={styles.typeDescription}>
                {ComponentCaptions.createWorkspace.singleReleaseDescription}
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
                  {ComponentCaptions.createWorkspace.multiReleaseLabel}
                </Text>
                <Text style={styles.typeDescription}>
                {ComponentCaptions.createWorkspace.multiReleaseDescription}
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
            <Text style={styles.cancelButtonText}>{ComponentCaptions.createWorkspace.cancelButton}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateSpace}
          >
            <Text style={styles.createButtonText}>{ComponentCaptions.createWorkspace.createButton}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
