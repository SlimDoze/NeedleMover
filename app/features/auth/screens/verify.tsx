import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { CustomAlert } from '@/common/lib/alert';
import { AppColors } from '@/common/constants/AppColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function VerifyScreen() {
  const router = useRouter();
  const { token, type } = useLocalSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token as string,
            type: 'signup',
          });

          if (error) {
            CustomAlert('Verification Failed', error.message);
            router.replace('/');
          } else {
            CustomAlert('Success', 'Email verified successfully');
            router.replace('/features/teams/screens/selection');
          }
        } catch (err) {
          CustomAlert('Error', 'An unexpected error occurred');
          router.replace('/');
        }
      } else {
        router.replace('/');
      }
    };

    verifyToken();
  }, [token, type]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.text}>Verifying your email...</Text>
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
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: AppColors.text.dark,
  },
});