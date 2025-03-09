// src/features/auth/_hooks/useSignUp.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { TEAM_ROUTES } from "../_constants/routes";
import { customAlert } from "@/common/lib/alert";
import { SignupMsg } from "../_constants/AuthErrorText";
import { validateEmail,validatePassword, validateRequired } from "../_lib/AuthValidation";


// User data interface
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

  const validateFirstStep = () => {
    if (!validateRequired(userData.name)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterNameErr);
      return false;
    }
    if (!validateRequired(userData.handle)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterHandleErr);
      return false;
    }
    return true;
  };

  const validateSecondStep = () => {
    if (!validateRequired(userData.email)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterEmailErr);
      return false;
    }
    if (!validateEmail(userData.email)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterValidMailEr);
      return false;
    }
    if (!validateRequired(userData.password)) {
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

  const handleSignUp = async () => {
    try {
      console.log("Starting Sign-Up with data:", userData);
      console.log("Email validation:", validateEmail(userData.email));
      
      const isValid = validateSecondStep();
      console.log("Validation result:", isValid);
      
      if (isValid) {
        setIsLoading(true);
        
        // This is where you would make your API call
        // Example structure for future implementation:
        /*
        const response = await authService.signup({
          name: userData.name,
          handle: userData.handle,
          email: userData.email,
          password: userData.password
        });
        
        if (response.success) {
          // Store tokens, user info, etc.
          if (userData.stayLoggedIn) {
            // Persist auth state
          }
          customAlert(SignupMsg.SuceessHeader, SignupMsg.SuccessBody, [
            { text: 'OK', onPress: () => router.replace(TEAM_ROUTES.SELECTION) }
          ]);
        } else {
          customAlert(SignupMsg.ErrorHeader, response.message || SignupMsg.ErrorBody);
        }
        */
        
        // Temporary simulation for development
        setTimeout(() => {
          console.log('Registration data:', userData);
          
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
      console.error("Error during Sign-Up:", error);
      customAlert(SignupMsg.ErrorHeader, SignupMsg.ErrorBody);
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