/**
 * [BEREITSTELLUNG] Layout für Team-Bildschirme
 * 
 * Diese Datei definiert das gemeinsame Layout für alle Team-bezogenen Bildschirme
 * (Team-Auswahl, Team-Erstellung, Team-Beitritt, Team-Detailansicht).
 * Konfiguriert Header-Stile und Navigationsoptionen für die verschiedenen Team-Routen.
 */
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
        name="createTeam" 
        options={{ 
          title: 'Create Team',
          presentation: 'modal',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="joinTeam" 
        options={{ 
          presentation: 'modal',
          title: 'Join Team',
          headerShown: false
        }} 
      />
      {/* [VERSTECKT] Team-ID-Header */}
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}