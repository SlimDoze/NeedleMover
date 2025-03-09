// app/(teams)/[id]/roadmap.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { AppColors } from '@/common/constants/AppColors';
import { styles } from '../../_constants/roadmapStyleSheet';
import { ComponentCaptions } from '../../_constants/componentCaptions';

// Mock data for roadmap items
const mockRoadmapItems = [
  { 
    id: '1', 
    title: 'Summer EP Release', 
    description: 'Complete and release the Summer EP', 
    deadline: '2023-08-15',
    progress: 75
  },
  { 
    id: '2', 
    title: 'Studio Session', 
    description: 'Book studio for recording final vocals', 
    deadline: '2023-07-20',
    progress: 50
  },
  { 
    id: '3', 
    title: 'Music Video Production', 
    description: 'Film and edit music video for lead single', 
    deadline: '2023-07-30',
    progress: 25
  },
];

export default function TeamRoadmapScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const teamId = Array.isArray(id) ? id[0] : id || '1';
  
  const handleAddGoal = () => {
    Alert.alert('Add Goal', 'This feature is coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{ComponentCaptions.roadmap.title}</Text>
          <Text style={styles.subtitle}>{ComponentCaptions.roadmap.subtitle}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddGoal}
          >
            <Feather name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>{ComponentCaptions.roadmap.addButtonText}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.roadmapContainer}>
          {mockRoadmapItems.map(item => (
            <TouchableOpacity 
              key={item.id}
              style={styles.roadmapCard}
              onPress={() => {}}
            >
              <View style={styles.roadmapHeader}>
                <Text style={styles.roadmapTitle}>{item.title}</Text>
                <View style={styles.deadlineContainer}>
                  <Feather name="calendar" size={14} color={AppColors.text.muted} style={styles.deadlineIcon} />
                  <Text style={styles.deadlineText}>{item.deadline}</Text>
                </View>
              </View>
              
              <Text style={styles.roadmapDescription}>{item.description}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${item.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{item.progress}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{ComponentCaptions.roadmap.emptyStateText}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}