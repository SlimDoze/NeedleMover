/**
 * [BEREITSTELLUNG] Layout für Authentifizierungsbildschirme
 * 
 * Diese Datei definiert das gemeinsame Layout für alle Authentifizierungsbildschirme
 * (Login, Registrierung, Passwort-Zurücksetzung).
 * Verwendet Expo-Router Stack für die Navigation zwischen den Bildschirmen.
 */
import React from 'react';
import { Stack } from 'expo-router';
import { AppColors } from '@/common/constants/AppColors';

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