// app/common/components/logoutButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/lib/authContext';
import { AppColors } from '@/common/constants/AppColors';

interface LogoutButtonProps {
  variant?: 'icon' | 'text' | 'full';
  style?: object;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'full',
  style 
}) => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (variant === 'icon') {
    return (
      <TouchableOpacity 
        style={[styles.iconButton, style]} 
        onPress={handleLogout}
      >
        <Feather name="log-out" size={24} color={AppColors.text.dark} />
      </TouchableOpacity>
    );
  }

  if (variant === 'text') {
    return (
      <TouchableOpacity 
        style={[styles.textButton, style]} 
        onPress={handleLogout}
      >
        <Text style={styles.textButtonLabel}>Abmelden</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.fullButton, style]} 
      onPress={handleLogout}
    >
      <Feather name="log-out" size={20} color="white" />
      <Text style={styles.fullButtonLabel}>Abmelden</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  },
  textButton: {
    padding: 8,
  },
  textButtonLabel: {
    color: AppColors.text.muted,
    fontSize: 16,
  },
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    padding: 12,
    borderRadius: 8,
  },
  fullButtonLabel: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LogoutButton;