// app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/lib/LIB_AuthContext';
import { AuthGuard } from '@/lib/LIB_AuthGuard';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <StatusBar style="dark" />
        <Slot />
      </AuthGuard>
    </AuthProvider>
  );
}