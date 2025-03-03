// app/(teams)/[id]/_layout.tsx
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { AppColors } from '@/constants/AppColors';

export default function TeamDetailLayout() {
  const { id } = useLocalSearchParams();
  const teamId = Array.isArray(id) ? id[0] : id || '';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: AppColors.background,
        },
        headerShadowVisible: false,
        headerTintColor: AppColors.text.dark,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: AppColors.background,
        },
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          title: `Team ${teamId}`,
        }} 
      />
      <Stack.Screen 
        name="create-space"
        options={{ 
          title: 'Create Space',
        }} 
      />
      <Stack.Screen 
        name="roadmap"
        options={{ 
          title: 'Team Roadmap',
        }} 
      />
    </Stack>
  );
}