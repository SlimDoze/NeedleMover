// src/features/auth/_hooks/useSignup.tsx
import { useState } from "react";
import { useRouter } from "expo-router";
import { TEAM_ROUTES } from "../_constants/routes";
import { customAlert } from "@/common/lib/altert";
import { SignupMsg } from "../_constants/AuthErrorText";

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
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterNameErr);
      return false;
    }
    if (!userData.handle.trim()) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterHandleErr);
      return false;
    }
    return true;
  };

  const validateSecondStep = () => {
    if (!userData.email.trim()) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterEmailErr);
      return false;
    }
    if (!validateEmail(userData.email)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterValidMailEr);
      return false;
    }
    if (!userData.password.trim()) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterPasswordErr);
      return false;
    }
    if (!validatePassword(userData.password)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.PasswordCharErr);
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
    try {
      console.log("Starte Sign-Up mit Daten:", userData);
      console.log("E-Mail-Validierung:", validateEmail(userData.email));
      
      const isValid = validateSecondStep();
      console.log("Validierungsergebnis:", isValid);
      
      if (isValid) {
        setIsLoading(true);
        
        setTimeout(() => {
          console.log('Registrierungsdaten:', userData);
          
          // Nach erfolgreicher Registrierung zur Team-Auswahl navigieren
          customAlert(SignupMsg.SuceessHeader, SignupMsg.SuccessBody, [
            {
              text: 'OK',
              onPress: () => router.replace(TEAM_ROUTES.SELECTION)
            }
          ]);
          
          setIsLoading(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Fehler beim Sign-Up:", error);
      customAlert( SignupMsg.ErrorHeader,SignupMsg.ErrorBody);
      setIsLoading(false);
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
export default function DummyComponent() { return null; }