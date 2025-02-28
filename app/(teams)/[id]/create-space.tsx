

// File: /app/teams/[id]/create-space.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

export default function CreateSpaceScreen() {
  const { id: teamId } = useLocalSearchParams();
  const router = useRouter();
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('single'); // 'single' or 'multi'

  const handleCreateSpace = () => {
    // Implement space creation logic here
    // After creating the space, navigate back to the team details
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Create Space</Text>
      </View>
      
      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Space Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Enter space name"
            value={spaceName}
            onChangeText={setSpaceName}
          />
        </View>
        
        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Space Type</Text>
          <View className="flex-row">
            <TouchableOpacity 
              className={`flex-1 mr-2 p-4 rounded-lg border ${spaceType === 'single' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onPress={() => setSpaceType('single')}
            >
              <Feather name="music" size={24} color={spaceType === 'single' ? '#3B82F6' : '#6B7280'} style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text className={`text-center font-semibold ${spaceType === 'single' ? 'text-blue-500' : 'text-gray-700'}`}>Single Release</Text>
              <Text className="text-center text-gray-500 text-sm mt-1">For releasing a single track</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 ml-2 p-4 rounded-lg border ${spaceType === 'multi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onPress={() => setSpaceType('multi')}
            >
              <Feather name="disc" size={24} color={spaceType === 'multi' ? '#3B82F6' : '#6B7280'} style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text className={`text-center font-semibold ${spaceType === 'multi' ? 'text-blue-500' : 'text-gray-700'}`}>Multi Track Release</Text>
              <Text className="text-center text-gray-500 text-sm mt-1">For EP, album, or mixtape</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-3 mt-4"
          onPress={handleCreateSpace}
        >
          <Text className="text-white text-center font-semibold">Create Space</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}