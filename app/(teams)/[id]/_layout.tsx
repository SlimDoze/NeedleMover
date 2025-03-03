// app/(teams)/[id]/_layout.tsx
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { AppColors } from '@/constants/AppColors';

export default function TeamDetailLayout() {
  const { id } = useLocalSearchParams();
  
  return (
    <Stack
      screenOptions={{
        // Hide ALL headers in this stack
        headerShown: false,
        contentStyle: {
          backgroundColor: AppColors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create-space" />
      <Stack.Screen name="roadmap" />
    </Stack>
  );
}