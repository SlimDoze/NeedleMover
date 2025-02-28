  // File: /app/spaces/[id].tsx
  import React, { useState } from 'react';
  import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useLocalSearchParams, useRouter } from 'expo-router';
  import { StatusBar } from 'expo-status-bar';
  import { Feather } from '@expo/vector-icons';

  // Mock data for a space
  const mockSingleSpace = {
    id: '1',
    name: 'Winter Single',
    type: 'Single Release',
    created: '2023-01-15',
    channels: [
      { id: 'tl1', name: 'Tracklist', icon: 'list' },
      { id: 'in1', name: 'Instrumentals', icon: 'headphones' },
      { id: 'tr1', name: 'Tracks', icon: 'music' },
      { id: 'pl1', name: 'Planner', icon: 'calendar' },
      { id: 'st1', name: 'Settings', icon: 'settings' },
    ]
  };

  const mockMultiSpace = {
    id: '2',
    name: 'Summer EP',
    type: 'Multi Track Release',
    created: '2023-06-20',
    channels: [
      { id: 'tl2', name: 'Tracklist', icon: 'list' },
      { id: 'in2', name: 'Instrumentals', icon: 'headphones' },
      { id: 'tr2', name: 'Tracks', icon: 'music' },
      { id: 'pl2', name: 'Planner', icon: 'calendar' },
      { id: 'st2', name: 'Settings', icon: 'settings' },
    ]
  };

  export default function SpaceDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    // For demo purposes, choose between the two mock spaces
    const space = id === '1' ? mockSingleSpace : mockMultiSpace;

    const navigateToChannel = (channelId: string, channelName: string) => {
      // Use the structured object approach which is more reliable with TypeScript
      router.push({
        pathname: '../channels/[spaceId]/[channelId]',
        params: { 
          spaceId: space.id, 
          channelId: channelId,
          name: channelName 
        }
      });
    };
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#4B5563" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-800">{space.name}</Text>
            <Text className="text-gray-500">{space.type}</Text>
          </View>
        </View>
        
        <ScrollView className="flex-1 p-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Channels</Text>
          
          {space.channels.map(channel => (
            <TouchableOpacity 
              key={channel.id}
              className="bg-white rounded-xl shadow-sm mb-4 flex-row items-center p-4"
              onPress={() => navigateToChannel(channel.id, channel.name)}
            >
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Feather name={channel.icon} size={20} color="#3B82F6" />
              </View>
              <Text className="text-lg font-medium text-gray-800">{channel.name}</Text>
              <Feather name="chevron-right" size={20} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
