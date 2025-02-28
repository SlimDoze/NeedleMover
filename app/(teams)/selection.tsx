

// File: /app/teams/selection.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function TeamSelectionScreen() {
  const router = useRouter();

  const handleCreateTeam = () => {
    router.push('/teams/create');
  };

  const handleJoinTeam = () => {
    router.push('/teams/join');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-800">Welcome to MusicCollab</Text>
          <Text className="text-lg text-center text-gray-600 mt-2">Get started with a team</Text>
        </View>
        
        <View className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <Text className="text-xl font-semibold text-gray-800 mb-2">Create a New Team</Text>
          <Text className="text-gray-600 mb-4">Start fresh with your own music collaboration team</Text>
          
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3"
            onPress={handleCreateTeam}
          >
            <Text className="text-white text-center font-semibold">Create Team</Text>
          </TouchableOpacity>
        </View>
        
        <View className="bg-white rounded-xl shadow-sm p-6">
          <Text className="text-xl font-semibold text-gray-800 mb-2">Join an Existing Team</Text>
          <Text className="text-gray-600 mb-4">Join a team you've been invited to</Text>
          
          <TouchableOpacity
            className="bg-gray-800 rounded-lg py-3"
            onPress={handleJoinTeam}
          >
            <Text className="text-white text-center font-semibold">Join Team</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
