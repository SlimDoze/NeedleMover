import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { SignupMsg } from "../_constants/AuthErrorText";
import { ValidateEmail, ValidatePassword, ValidateRequired } from "../_lib/AuthValidation";
import { AuthService, UserSignupProfileDetails } from "@/lib/auth";
import { sessionStorage } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Setzt Struktur für die Nutzerdaten
interface SignUpData {
  name: string;
  handle: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export function UseSignUp() {
  const router = useRouter();
  
  const initialState: SignUpData = {
    name: '',
    handle: '',
    email: '',
    password: '',
    stayLoggedIn: false
  };
  
  // useState Hooks werden initialisiert
  const [formStep, setFormStep] = useState<number>(1);
  const [userData, setUserData] = useState<SignUpData>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmMailSent, setIsConfirmMailSent] = useState<boolean>(false);
  
  // Polling-Status werden initialisiert => Prüfen ob public/profiles Rec. existiert 
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // [Polling] Intervall wird gecleard beim Unmount der Komponente
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // [Function] Start Polling for Email Confirm 
  const startConfirmMailPolling = () => {
    if (isPolling || !userData.email) return;
    
    console.log("Starting profile polling for email:", userData.email);
    setIsPolling(true);
    
    // Alle 3 Sekunden prüfen, ob das Profil erstellt wurde
    pollingIntervalRef.current = setInterval(checkProfileCreated, 3000);
  };

  // [Function] Validates the creation of public/profile Record
  const checkProfileCreated = async () => {
    try {
      console.log("Checking for profile with email:", userData.email);
      
      // Sucht nach Profil über E-Mail adresse
      const profile = await AuthService.getProfileByEmail(userData.email);
      

      // Profil gefunden => Stop Polling, Nav. zur Selection
      if (profile) {
        console.log("Profile found, redirecting to team selection");
        stopConfirmMailPolling();
        
        router.replace(Team_Routes.Selection);
      } else {
        console.log("Profile not found yet, continuing polling");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  // [Function] Stops Polling for Email Confirmation
  const stopConfirmMailPolling = () => {
    // Setzt sich auf aktives intervall
    if (pollingIntervalRef.current) {
      // Stoppt aktives Intervall
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  };
  
  // [Function] Can update single Fields of UserData, instead of setting the whole new State
  const UpdateField = (field: keyof SignUpData, value: string | boolean) => {
    setUserData(prev => ({
      // Kopiert alle bestehenden Felder aus dem vorherigen Zustand
      ...prev,
      // Aktualisiert das spezifische Feld mit dem neuen Wert
      [field]: value
    }));
  };

  // [Function] Validates First Form Step
  const ValidateFirstStep = () => {
    // Name eingegeben?
    if (!ValidateRequired(userData.name)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterNameErr);
      return false;
    }
    // Handle eingegeben?
    if (!ValidateRequired(userData.handle)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterHandleErr);
      return false;
    } 
    return true;
  };

  // [Function] Validates Second Form Step
  const ValidateSecondStep = () => {
    // Email eingegeben?
    if (!ValidateRequired(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterEmailErr);
      return false;
    }
    // Email Valide?
    if (!ValidateEmail(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterValidMailEr);
      return false;
    }
    // Password eingegeben?
    if (!ValidateRequired(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterPasswordErr);
      return false;
    }
    // Password valid?
    if (!ValidatePassword(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.PasswordCharErr);
      return false;
    }
    return true;
  };

  // [Function] Moves the Form Step forward
  const NextStep = () => {
    if (formStep === 1 && ValidateFirstStep()) {
      setFormStep(2);
    }
  };

  // [Function] Moves the Form Step back
  const PrevStep = () => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    } else {
      router.back();
    }
  };
  // [Function] Executes Sign-Up DB Logic
  const HandleSignUp = async () => {
    try {
      console.log("Starting Sign-Up with data:", userData);

      // [Validiert] Letzte Form-Inputs
      const isValid = ValidateSecondStep();
      if (isValid) {
        setIsLoading(true);
        // [Prüft] SessionStorage-Objekt verfügbar && benötigte Funktion verfügbar
        if (typeof sessionStorage !== 'undefined' && sessionStorage.setPersistSession) {
          // [Speichert] "Stay logged in"-Status im SessionStorage
          await sessionStorage.setPersistSession(userData.stayLoggedIn);
        }
        // Supabase API Call => Erstellt auth/user aus UserData Object
        const response = await AuthService.signUp({
          name: userData.name,
          handle: userData.handle,
          email: userData.email,
          password: userData.password
        });
        setIsLoading(false);
        
        if (response.success) {
          // [Speicher Email] Wenn "Stay logged in" aktiviert ist
          if (userData.stayLoggedIn) {
            await AsyncStorage.setItem('rememberedEmail', userData.email);
          }
          CustomAlert(SignupMsg.SuceessHeader, "Registration started. Please check your email to confirm your account.", 
            [{ text: "OK" }]
           );
          setIsConfirmMailSent(true);
          // [Start] Polling für Profil-Check
          startConfirmMailPolling();
        } else {
          // [Handle] Registrierungs Fehler
          CustomAlert(SignupMsg.ErrorHeader, response.message || SignupMsg.ErrorBody);
        }
      }
    } catch (error) {
      console.error("Error during Sign-Up:", error);
      CustomAlert(SignupMsg.ErrorHeader, SignupMsg.ErrorBody);
      setIsLoading(false);
    }
  };

  // [Function] Resends Mail, Manages isLoading & Profile-Polling
  const HandleResendEmail = async () => {
    try {
      // Wenn Email leer => Ausstieg
      if (!userData.email) {
        CustomAlert(SignupMsg.ErrorHeader, "Please enter your email first.");
        return;
      }
      setIsLoading(true);
      const response = await AuthService.resendConfirmationEmail(userData.email);
      setIsLoading(false);
      
      CustomAlert(SignupMsg.SuceessHeader, response.message || "A new confirmation email has been sent.");
      startConfirmMailPolling();
    } 
    catch (error) {
      console.error("Error resending confirmation email:", error);
      setIsLoading(false);
      CustomAlert(SignupMsg.ErrorHeader, "Failed to resend confirmation email.");
    }
  };
  
  return {
    formStep,
    userData,
    isLoading,
    isConfirmMailSent,
    isPolling,
    updateField: UpdateField,
    nextStep: NextStep,
    prevStep: PrevStep,
    handleSignUp: HandleSignUp,
    handleResendEmail: HandleResendEmail,
  };
}