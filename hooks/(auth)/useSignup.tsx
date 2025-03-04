import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { AppColors } from "@/constants/AppColors";
import { Const_AuthInfoText } from "@/constants/(Auth)/AuthInfoText";

// Benutzerdatenschnittstelle
interface UserSignupData {
  name: string;
  handle: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export function useSignUp() {
  const router = useRouter();
  
  const initialState: UserSignupData = {
    name: '',
    handle: '',
    email: '',
    password: '',
    stayLoggedIn: false
  };
  
  const [formStep, setFormStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserSignupData>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateField = (field: keyof UserSignupData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Einfache Validierungsfunktionen
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateFirstStep = () => {
    if (!userData.name.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib deinen Namen ein');
      return false;
    }
    if (!userData.handle.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib dein Handle ein');
      return false;
    }
    return true;
  };

  const validateSecondStep = () => {
    if (!userData.email.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib deine E-Mail ein');
      return false;
    }
    if (!validateEmail(userData.email)) {
      Alert.alert('Validierungsfehler', 'Bitte gib eine gültige E-Mail ein');
      return false;
    }
    if (!userData.password.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib ein Passwort ein');
      return false;
    }
    if (!validatePassword(userData.password)) {
      Alert.alert('Validierungsfehler', 'Das Passwort muss mindestens 6 Zeichen lang sein');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (formStep === 1 && validateFirstStep()) {
      setFormStep(2);
    }
  };

  const prevStep = () => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    }
  };

  const handleSignUp = () => {
    if (validateSecondStep()) {
      setIsLoading(true);
      
      setTimeout(() => {
        console.log('Registrierungsdaten:', userData);
        
        // Nach erfolgreicher Registrierung zur Team-Auswahl navigieren
        Alert.alert('Erfolg', 'Registrierung abgeschlossen!', [
          {
            text: 'OK',
            onPress: () => router.replace('../(teams)/selection')
          }
        ]);
        setIsLoading(false);
      }, 1500);
    }
  };

  return {
    formStep,
    userData,
    isLoading,
    updateField,
    nextStep,
    prevStep,
    handleSignUp
  };
}
