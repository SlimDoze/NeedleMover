// File: /app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Implement authentication logic here
    // For now, we'll just navigate to the teams page
    router.replace('../teams');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-800">MusicCollab</Text>
          <Text className="text-lg text-center text-gray-600 mt-2">Collaborate on your music projects</Text>
        </View>
        
        <View className="bg-white rounded-xl shadow-sm p-6">
          <Text className="text-xl font-semibold text-gray-800 mb-4">Log In</Text>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View className="mb-6">
            <Text className="text-gray-700 mb-2">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mb-4"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-semibold">Log In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('../auth/signup')}>
            <Text className="text-blue-600 text-center">Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}