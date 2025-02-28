
// File: /app/teams/[id].tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

// Mock data for spaces
const mockSpaces = [
  { id: '1', name: 'Summer EP', type: 'Multi Track Release', trackCount: 4 },
  { id: '2', name: 'Winter Single', type: 'Single Release', trackCount: 1 },
  { id: '3', name: 'Collaboration X', type: 'Single Release', trackCount: 1 },
];

export default function TeamDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Mock team data (in a real app, fetch this based on the ID)
  const team = {
    id,
    name: 'Beats Collective',
    description: 'Hip hop production team focused on creating unique beats and collaborations.',
    memberCount: 5,
  };

  const renderSpaceItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl shadow-sm p-4 mb-4"
      onPress={() => router.push(`/spaces/${item.id}`)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
        <View className="bg-gray-100 px-3 py-1 rounded-full">
          <Text className="text-gray-600 text-sm">{item.type}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <Feather name="music" size={16} color="#6B7280" />
        <Text className="text-gray-500 ml-1">{item.trackCount} track{item.trackCount !== 1 ? 's' : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  const navigateToRoadmap = () => {
    router.push(`/teams/${id}/roadmap`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">{team.name}</Text>
      </View>
      
      <View className="p-6 bg-white border-b border-gray-200">
        <Text className="text-gray-600 mb-4">{team.description}</Text>
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <Feather name="users" size={16} color="#6B7280" />
            <Text className="text-gray-500 ml-1">{team.memberCount} members</Text>
          </View>
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={navigateToRoadmap}
          >
            <Feather name="map" size={16} color="#3B82F6" />
            <Text className="text-blue-500 ml-1">Roadmap</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="px-6 py-4 flex-row justify-between items-center">
        <Text className="text-xl font-semibold text-gray-800">Spaces</Text>
        <TouchableOpacity 
          className="bg-blue-600 rounded-full w-8 h-8 items-center justify-center"
          onPress={() => router.push(`/teams/${id}/create-space`)}
        >
          <Feather name="plus" size={18} color="white" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={mockSpaces}
        renderItem={renderSpaceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}