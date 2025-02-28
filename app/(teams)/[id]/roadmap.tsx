

// File: /app/teams/[id]/roadmap.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Team Roadmap</Text>
      </View>
      
      <ScrollView className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-semibold text-gray-800">Goals & Milestones</Text>
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center"
            onPress={() => router.push(`/teams/${id}/add-goal`)}
          >
            <Feather name="plus" size={16} color="white" />
            <Text className="text-white ml-1">Add Goal</Text>
          </TouchableOpacity>
        </View>
        
        {mockRoadmapItems.map(item => (
          <View key={item.id} className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-gray-600 text-sm">{item.deadline}</Text>
              </View>
            </View>
            <Text className="text-gray-600 mb-3">{item.description}</Text>
            <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <View 
                className="bg-blue-500 h-full"
                style={{ width: `${item.progress}%` }}
              />
            </View>
            <Text className="text-gray-500 text-right mt-1">{item.progress}%</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}