import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { CustomAlert } from '@/common/lib/alert';

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
            router.replace('/login');
          } else {
            CustomAlert('Success', 'Email verified successfully');
            router.replace('/teams/selection');
          }
        } catch (err) {
          CustomAlert('Error', 'An unexpected error occurred');
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    };

    verifyToken();
  }, [token, type]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Verifying your email...</Text>
    </View>
  );
}