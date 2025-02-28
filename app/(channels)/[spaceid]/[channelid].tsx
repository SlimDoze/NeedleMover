// File: /app/channels/[spaceId]/[channelId].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

// Components for each channel type
import TracklistChannel from '../../../components/channels/TracklistChannel';
import InstrumentalsChannel from '../../../components/channels/InstrumentalChannel';
import TracksChannel from '../../../components/channels/TracksChannel';
import PlannerChannel from '../../../components/channels/PlannerChannel';
import SettingsChannel from '../../../components/channels/SettingsChannel';

export default function ChannelScreen() {
  const { spaceId, channelId, name } = useLocalSearchParams();
  const router = useRouter();

  // Determine which channel component to render based on channelId prefix
  const renderChannelContent = () => {
    const id = channelId as string;
    
    if (id.startsWith('tl')) {
      return <TracklistChannel spaceId={spaceId as string} channelId={id} />;
    } else if (id.startsWith('in')) {
      return <InstrumentalsChannel spaceId={spaceId as string} channelId={id} />;
    } else if (id.startsWith('tr')) {
      return <TracksChannel spaceId={spaceId as string} channelId={id} />;
    } else if (id.startsWith('pl')) {
      return <PlannerChannel spaceId={spaceId as string} channelId={id} />;
    } else if (id.startsWith('st')) {
      return <SettingsChannel spaceId={spaceId as string} channelId={id} />;
    }
    
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Channel not found</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">{name}</Text>
      </View>
      
      {renderChannelContent()}
    </SafeAreaView>
  );
}