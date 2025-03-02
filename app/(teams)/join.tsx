
// File: /app/teams/join.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function JoinTeamScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const router = useRouter();

  const handleJoinTeam = () => {
    // Implement team joining logic here
    // After joining the team, navigate to the team home
    // router.replace('/teams');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-800">Join a Team</Text>
          <Text className="text-lg text-center text-gray-600 mt-2">Enter the invite code to join</Text>
        </View>
        
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <View className="mb-6">
            <Text className="text-gray-700 mb-2">Invite Code</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              placeholder="Enter the invite code"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
            />
          </View>
        </View>
        
        <View className="flex-row mb-8">
          <TouchableOpacity
            className="bg-gray-200 rounded-lg py-3 flex-1 mr-2"
            onPress={() => router.back()}
          >
            <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 flex-1 ml-2"
            onPress={handleJoinTeam}
          >
            <Text className="text-white text-center font-semibold">Join Team</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
