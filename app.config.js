import 'dotenv/config';

export default {
  expo: {
    name: "NeedleMover",
    slug: "needle-mover",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "needlemover",
    // New Architecture aktivieren
    newArchEnabled: true,
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        "projectId": "b7586997-b6a6-405b-b517-f148f8f9f266"
      },
    },
    // Deep Linking Konfiguration hinzufügen
    plugins: [
      "expo-router"
    ],
    // Mehrere URL-Schemas unterstützen
    schemes: ["needlemover", "com.slimdoze.needlemover"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.musictech.needlemover",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      },
      associatedDomains: ["applinks:needlemover.app", "applinks:localhost:8081"],
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.musictech.needlemover",
    },
    web: {
      favicon: "./assets/favicon.png",
    }
  },
};