import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { AppColors } from '@/common/constants/AppColors';

export default function AuthSelectionScreen() {
  const router = useRouter();

  const navigateToSignUp = () => {
    router.push('/features/auth/screens/signup');
  };
  
  const navigateToLogin = () => {
    router.push('/features/auth/screens/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Needle Mover</Text>
        <Text style={styles.subtitle}>Music collaboration made simple</Text>
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
  subtitle: {
    fontSize: 18,
    color: AppColors.text.muted,
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