// app/(teams)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AppColors } from '@/constants/AppColors';

// Define the type for route params
type TeamParams = {
  id: string;
};

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
      <Stack.Screen 
        name="[id]/index"
        options={({ route }) => {
          // Type assertion for route.params
          const params = route.params as TeamParams;
          return { 
            title: `Team ${params?.id || ''}`,
          };
        }} 
      />
      <Stack.Screen 
        name="[id]/create-space"
        options={{ 
          title: 'Create Space',
        }} 
      />
      <Stack.Screen 
        name="[id]/roadmap"
        options={{ 
          title: 'Team Roadmap',
        }} 
      />
    </Stack>
  );
}