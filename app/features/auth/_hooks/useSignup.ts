import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { SignupMsg } from "../_constants/AuthErrorText";
import { ValidateEmail, ValidatePassword, ValidateRequired } from "../_lib/AuthValidation";
import { AuthService, UserSignupData } from "@/lib/auth";
import { sessionStorage } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// User data interface
interface UserSignupState {
  name: string;
  handle: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export function UseSignUp() {
  const router = useRouter();
  
  const initialState: UserSignupState = {
    name: '',
    handle: '',
    email: '',
    password: '',
    stayLoggedIn: false
  };
  
  const [formStep, setFormStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserSignupState>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmationMsg, setShowConfirmationMsg] = useState<boolean>(false);
  
  // Polling-Status für die Profilüberprüfung
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Aufräumen beim Unmount der Komponente
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Funktionen für Polling des Profils nach Email-Bestätigung
  const startProfilePolling = () => {
    if (isPolling || !userData.email) return;
    
    console.log("Starting profile polling for email:", userData.email);
    setIsPolling(true);
    
    // Alle 3 Sekunden prüfen, ob das Profil erstellt wurde
    pollingIntervalRef.current = setInterval(checkProfileCreated, 3000);
  };
  
  const stopProfilePolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  };
  
  const checkProfileCreated = async () => {
    try {
      console.log("Checking for profile with email:", userData.email);
      
      // Nach Profil mit der angegebenen E-Mail suchen
      const profile = await AuthService.getProfileByEmail(userData.email);
      
      if (profile) {
        console.log("Profile found, redirecting to team selection");
        stopProfilePolling();
        
        // Profil gefunden, zur Team-Auswahl weiterleiten
        router.replace(Team_Routes.Selection);
      } else {
        console.log("Profile not found yet, continuing polling");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const UpdateField = (field: keyof UserSignupState, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const ValidateFirstStep = () => {
    if (!ValidateRequired(userData.name)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterNameErr);
      return false;
    }
    if (!ValidateRequired(userData.handle)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterHandleErr);
      return false;
    }
    return true;
  };

  const ValidateSecondStep = () => {
    if (!ValidateRequired(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterEmailErr);
      return false;
    }
    if (!ValidateEmail(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterValidMailEr);
      return false;
    }
    if (!ValidateRequired(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterPasswordErr);
      return false;
    }
    if (!ValidatePassword(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.PasswordCharErr);
      return false;
    }
    return true;
  };

  const NextStep = () => {
    if (formStep === 1 && ValidateFirstStep()) {
      setFormStep(2);
    }
  };

  const PrevStep = () => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const HandleSignUp = async () => {
    try {
      console.log("Starting Sign-Up with data:", userData);
      
      const isValid = ValidateSecondStep();
      console.log("Validation result:", isValid);
      
      if (isValid) {
        setIsLoading(true);
        
        // Speichere den "Stay logged in"-Status im SessionStorage
        if (typeof sessionStorage !== 'undefined' && sessionStorage.setPersistSession) {
          await sessionStorage.setPersistSession(userData.stayLoggedIn);
        }
        
        // Call the AuthService to create the user account
        const response = await AuthService.signUp({
          name: userData.name,
          handle: userData.handle,
          email: userData.email,
          password: userData.password
        });
        
        setIsLoading(false);
        
        if (response.success) {
          // Wenn "Stay logged in" aktiviert ist, speichere die E-Mail
          if (userData.stayLoggedIn) {
            await AsyncStorage.setItem('rememberedEmail', userData.email);
          }
          
          // Show confirmation message
          CustomAlert(
            SignupMsg.SuceessHeader, 
            "Registration started. Please check your email to confirm your account.", 
            [{ text: "OK" }]
          );
          setShowConfirmationMsg(true);
          
          // Starte das Polling nach dem Profil
          startProfilePolling();
        } else {
          // Handle registration error
          CustomAlert(SignupMsg.ErrorHeader, response.message || SignupMsg.ErrorBody);
        }
      }
    } catch (error) {
      console.error("Error during Sign-Up:", error);
      CustomAlert(SignupMsg.ErrorHeader, SignupMsg.ErrorBody);
      setIsLoading(false);
    }
  };

  const HandleResendEmail = async () => {
    try {
      if (!userData.email) {
        CustomAlert(SignupMsg.ErrorHeader, "Please enter your email first.");
        return;
      }
  
      setIsLoading(true);
      
      const response = await AuthService.resendConfirmationEmail(userData.email);
      
      setIsLoading(false);
      
      CustomAlert(SignupMsg.SuceessHeader, response.message || "A new confirmation email has been sent.");
      
      // Starte das Polling nach dem Erneuten Senden der E-Mail
      startProfilePolling();
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      setIsLoading(false);
      CustomAlert(SignupMsg.ErrorHeader, "Failed to resend confirmation email.");
    }
  };
  
  return {
    formStep,
    userData,
    isLoading,
    showConfirmationMsg,
    isPolling,
    updateField: UpdateField,
    nextStep: NextStep,
    prevStep: PrevStep,
    handleSignUp: HandleSignUp,
    handleResendEmail: HandleResendEmail,
  };
}