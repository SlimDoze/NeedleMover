import 'dotenv/config';

export default {
  expo: {
    name: "NeedleMover",
    slug: "needle-mover",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "needlemover",
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    eas: {
      "projectId": "b7586997-b6a6-405b-b517-f148f8f9f266"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.musictech.needlemover",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.musictech.needlemover",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
