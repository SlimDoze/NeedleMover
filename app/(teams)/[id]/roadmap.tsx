// app/(teams)/[id]/roadmap.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { AppColors } from '@/constants/AppColors';

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
          <Text style={styles.title}>Team Roadmap</Text>
          <Text style={styles.subtitle}>Track your team's goals and milestones</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddGoal}
          >
            <Feather name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Goal</Text>
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
          <Text style={styles.emptyStateText}>
            Add more goals to track your team's progress
          </Text>
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  roadmapContainer: {
    marginBottom: 20,
  },
  roadmapCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  roadmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roadmapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.text.dark,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  deadlineIcon: {
    marginRight: 4,
  },
  deadlineText: {
    fontSize: 12,
    color: AppColors.text.muted,
  },
  roadmapDescription: {
    fontSize: 14,
    color: AppColors.text.muted,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: AppColors.text.muted,
    width: 36,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    color: AppColors.text.muted,
    fontSize: 14,
  },
});