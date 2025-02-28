
// File: /app/teams/index.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

// Mock data for teams
const mockTeams = [
  { id: '1', name: 'Beats Collective', description: 'Hip hop production team', memberCount: 5 },
  { id: '2', name: 'Studio 42', description: 'Rock band and production', memberCount: 4 },
  { id: '3', name: 'Electronic Vibes', description: 'EDM production team', memberCount: 3 },
];

export default function TeamsScreen() {
  const router = useRouter();

  const renderTeamItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl shadow-sm p-4 mb-4"
      onPress={() => router.push(`/teams/${item.id}`)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
        <View className="flex-row items-center">
          <Feather name="users" size={16} color="#6B7280" />
          <Text className="text-gray-500 ml-1">{item.memberCount}</Text>
        </View>
      </View>
      <Text className="text-gray-600">{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Your Teams</Text>
        <TouchableOpacity 
          className="bg-blue-600 rounded-full w-10 h-10 items-center justify-center"
          onPress={() => router.push('/teams/create')}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={mockTeams}
        renderItem={renderTeamItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}
