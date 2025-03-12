// app/_layout.tsx
import React, { useEffect } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/lib/authContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Root layout without auth check
function RootLayoutNav() {
  const { isLoading, user } = useAuth();

  useEffect(() => {
    // Hide splash screen when auth check is done
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Render the app once loading is complete
  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

// Root layout with auth provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}