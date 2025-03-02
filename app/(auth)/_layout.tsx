// app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AppColors } from '@/constants/AppColors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: AppColors.background,
        },
      }}
    />
  );
}