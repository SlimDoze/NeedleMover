// app/(teams)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AppColors } from '@/common/constants/AppColors';

export default function TeamsLayout() {
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
        name="selection" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Team',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="join" 
        options={{ 
          title: 'Join Team',
        }} 
      />
      {/* Add this to hide the [id] header */}
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}