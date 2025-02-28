// File: /app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { TeamProvider } from '../context/TeamContext';

export default function AppLayout() {
  return (
    <AuthProvider>
      <TeamProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </TeamProvider>
    </AuthProvider>
  );
}