import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

import { AppColors } from '@/common/constants/AppColors';

export default function AuthSelectionScreen() {
  const router = useRouter();

  const navigateToSignUp = () => {
    router.push('../features/auth/screens/signup');
  };
  
  const navigateToLogin = () => {
    router.push('../features/auth/screens/login');
  };

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      if (url) {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname.replace("/", ""); // Extract "verify"
        const token = parsedUrl.searchParams.get("token");

        if (path === "verify" && token) {
          router.push(`/verify?token=${token}`); // Navigate to the Verify screen
        }
      }
    };

    // Listen for deep links when the app is already open
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle deep links that open the app from a closed state
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Needle Mover</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: AppColors.primary }]} 
          onPress={navigateToSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: AppColors.primary }]} 
          onPress={navigateToLogin}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: AppColors.text.dark,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: AppColors.text.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
