/**
 * [BEREITSTELLUNG] Registrierungsprozess-Logik
 * 
 * Dieser Hook verwaltet den mehrstufigen Registrierungsprozess:
 * - Formularstatusverwaltung für alle Benutzerinformationen
 * - Validierung der Eingaben in verschiedenen Schritten
 * - Benutzerregistrierung über AuthService
 * - E-Mail-Bestätigungsverfolgung mit Polling-Mechanismus
 * - Plattformspezifische Tokenverarbeitung (Web/Mobile)
 */
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { SignupMsg } from "../_constants/AuthErrorText";
import { ValidateEmail, ValidatePassword, ValidateRequired } from "../_lib/AuthValidation";
import { AuthService, UserSignupProfileDetails } from "@/lib/auth";
import { sessionStorage } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// [DEFINIERT] Struktur für Registrierungsdaten
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
  
  // [INITIALISIERT] Zustandsvariablen für das Formular
  const [formStep, setFormStep] = useState<number>(1);
  const [userData, setUserData] = useState<SignUpData>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmMailSent, setIsConfirmMailSent] = useState<boolean>(false);
  
  // [INITIALISIERT] Polling-Mechanismus für Profilbestätigung
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // [BEREINIGT] Polling-Intervall beim Unmount der Komponente
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // [STARTET] Polling für E-Mail-Bestätigung
  const startConfirmMailPolling = () => {
    if (isPolling || !userData.email) return;
    
    console.log("Starting profile polling for email:", userData.email);
    setIsPolling(true);
    
    // [PRÜFT] Alle 3 Sekunden auf Profilanlage
    pollingIntervalRef.current = setInterval(checkProfileCreated, 3000);
  };

  // [ÜBERPRÜFT] Ob das Benutzerprofil bereits angelegt wurde
  const checkProfileCreated = async () => {
    try {
      console.log("Checking for profile with email:", userData.email);
      
      // [SUCHT] Profil anhand der E-Mail-Adresse
      const profile = await AuthService.getProfileByEmail(userData.email);
      

      // [NAVIGIERT] Bei gefundenem Profil zur Team-Auswahl
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

  // [BEENDET] Polling für E-Mail-Bestätigung
  const stopConfirmMailPolling = () => {
    // [BEREINIGT] Aktives Intervall
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  };
  
  // [AKTUALISIERT] Einzelne Felder der Benutzerdaten
  const UpdateField = (field: keyof SignUpData, value: string | boolean) => {
    setUserData(prev => ({
      // [ÜBERNIMMT] Bestehende Felder
      ...prev,
      // [AKTUALISIERT] Spezifisches Feld
      [field]: value
    }));
  };

  // [VALIDIERT] Ersten Schritt des Formulars (Name und Handle)
  const ValidateFirstStep = () => {
    // [PRÜFT] Name-Eingabe
    if (!ValidateRequired(userData.name)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterNameErr);
      return false;
    }
    // [PRÜFT] Handle-Eingabe
    if (!ValidateRequired(userData.handle)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterHandleErr);
      return false;
    } 
    return true;
  };

  // [VALIDIERT] Zweiten Schritt des Formulars (E-Mail und Passwort)
  const ValidateSecondStep = () => {
    // [PRÜFT] E-Mail-Eingabe
    if (!ValidateRequired(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterEmailErr);
      return false;
    }
    // [PRÜFT] E-Mail-Format
    if (!ValidateEmail(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterValidMailEr);
      return false;
    }
    // [PRÜFT] Passwort-Eingabe
    if (!ValidateRequired(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterPasswordErr);
      return false;
    }
    // [PRÜFT] Passwort-Komplexität
    if (!ValidatePassword(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.PasswordCharErr);
      return false;
    }
    return true;
  };

  // [WECHSELT] Zum nächsten Formularschritt
  const NextStep = () => {
    if (formStep === 1 && ValidateFirstStep()) {
      setFormStep(2);
    }
  };

  // [WECHSELT] Zum vorherigen Formularschritt oder zurück
  const PrevStep = () => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    } else {
      router.back();
    }
  };
  // [FÜHRT] Registrierung mit validierten Daten durch
  const HandleSignUp = async () => {
    try {
      console.log("Starting Sign-Up with data:", userData);

      // [VALIDIERT] Formulardaten vor Absendung
      const isValid = ValidateSecondStep();
      if (isValid) {
        setIsLoading(true);
        // [SPEICHERT] Anmeldestatuspräferenz
        if (typeof sessionStorage !== 'undefined' && sessionStorage.setPersistSession) {
          await sessionStorage.setPersistSession(userData.stayLoggedIn);
        }
        // [REGISTRIERT] Benutzer über AuthService
        const response = await AuthService.signUp({
          name: userData.name,
          handle: userData.handle,
          email: userData.email,
          password: userData.password
        });
        setIsLoading(false);
        
        if (response.success) {
          // [SPEICHERT] E-Mail bei aktivierter "Stay logged in"-Option
          if (userData.stayLoggedIn) {
            await AsyncStorage.setItem('rememberedEmail', userData.email);
          }
          CustomAlert(SignupMsg.SuceessHeader, "Registration started. Please check your email to confirm your account.", 
            [{ text: "OK" }]
           );
          setIsConfirmMailSent(true);
          // [STARTET] Polling für Profilüberprüfung
          startConfirmMailPolling();
        } else {
          // [ZEIGT] Fehlermeldung bei Registrierungsproblemen
          CustomAlert(SignupMsg.ErrorHeader, response.message || SignupMsg.ErrorBody);
        }
      }
    } catch (error) {
      console.error("Error during Sign-Up:", error);
      CustomAlert(SignupMsg.ErrorHeader, SignupMsg.ErrorBody);
      setIsLoading(false);
    }
  };

  // [SENDET] Bestätigungs-E-Mail erneut und startet Polling
  const HandleResendEmail = async () => {
    try {
      // [PRÜFT] E-Mail-Verfügbarkeit
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

  // [VERARBEITET] Authentifizierungs-Tokens aus URLs oder Deep Links
  const handleAuthTokens = () => {
    useEffect(() => {
      // [BEHANDELT] Plattformspezifische Token-Verarbeitung
      if (Platform.OS === 'web') {
        // [EXTRAHIERT] Tokens aus URL-Hash für Web
        if (window.location.hash) {
          const hash = window.location.hash;
          const params = new URLSearchParams(hash.replace('#', ''));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log("Token in URL gefunden, setze Session...");
            // [SETZT] Session mit extrahierten Tokens
            AuthService.setSessionWithTokens(accessToken, refreshToken)
              .then(response => {
                if (response.success) {
                  console.log("Session erfolgreich mit Token gesetzt");
                  // [BEREINIGT] URL nach erfolgreicher Verarbeitung
                  window.history.replaceState(null, "", window.location.pathname);
                  // [STARTET] Polling für Profilüberprüfung
                  startConfirmMailPolling();
                }
              });
          }
        }
      } else {
        // [HINWEIS] Mobile: Hier würde Deep-Link-Integration folgen
        // Dies würde typischerweise mit einer Expo Linking-Lösung implementiert
        // z.B. Expo Linking.addEventListener
      }
    }, []);
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