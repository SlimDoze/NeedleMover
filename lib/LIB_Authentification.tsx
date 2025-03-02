import { Alert } from 'react-native';

export interface UserSignupData {
  name: string;
  handle: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createSignupFormManager = () => {
  const initialState: UserSignupData = {
    name: '',
    handle: '',
    email: '',
    password: '',
    stayLoggedIn: false
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateFirstStep = (data: Pick<UserSignupData, 'name' | 'handle'>) => {
    if (!data.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }
    if (!data.handle.trim()) {
      Alert.alert('Validation Error', 'Please enter your handle');
      return false;
    }
    return true;
  };

  const validateSecondStep = (data: Pick<UserSignupData, 'email' | 'password'>) => {
    if (!data.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return false;
    }
    if (!validateEmail(data.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }
    if (!data.password.trim()) {
      Alert.alert('Validation Error', 'Please enter a password');
      return false;
    }
    if (!validatePassword(data.password)) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  return {
    initialState,
    validateFirstStep,
    validateSecondStep,
  };
};