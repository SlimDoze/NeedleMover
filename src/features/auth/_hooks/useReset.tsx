import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export function useResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simple email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Simulating sending reset email
    setIsLoading(true);
    
    setTimeout(() => {
      Alert.alert(
        'Reset Email Sent',
        'Check your email for instructions to reset your password',
        [{ text: 'OK', onPress: () => setStep(2) }] // Updated to use setStep
      );
      setIsLoading(false);
    }, 1000);
  };

  const checkVerificationCode = () => {
    if (verificationCode.length === 6) {
      setStep(3); // Updated to use setStep
    } else {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your email');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords Don\'t Match', 'Passwords must match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      Alert.alert('Success', 'Your password has been reset', [
        { text: 'OK', onPress: () => router.replace('./login') }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1); // Updated to use setStep
    } else {
      router.back();
    }
  };

  return {
    step,
    setStep, // Updated for consistent naming
    email,
    setEmail,
    verificationCode,
    setVerificationCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleEmailSubmit,
    checkVerificationCode,
    handleUpdatePassword,
    handleGoBack,
  };
}