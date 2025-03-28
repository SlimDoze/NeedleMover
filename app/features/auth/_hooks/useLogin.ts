/**
 * [BEREITSTELLUNG] Login-Logik für Authentifizierung
 * 
 * Dieser Hook handhabt die gesamte Login-Funktionalität, einschließlich:
 * - Formularstatusverwaltung für E-Mail und Passwort
 * - "Remember Me"-Funktionalität mit AsyncStorage
 * - Login-Prozess mit Validierung und Fehlerbehandlung
 * - Navigation nach erfolgreicher Anmeldung
 */
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Auth_Routes, Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { LoginMsg } from "../_constants/AuthErrorText";
import { AuthService } from "@/lib/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sessionStorage } from "@/lib/supabase";
import { ValidateEmail, ValidateRequired } from "../_lib/AuthValidation";

export function UseLogin() {
  const router = useRouter();
  const [emailValue, setEmail] = useState<string>("");
  const [passwordValue, setPassword] = useState<string>("");
  const [isRememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // [VERARBEITET] Login-Anfrage mit Validierung und Fehlerbehandlung
  const HandleLogin = async () => {
    // [VALIDIERT] E-Mail und Passwort vor dem Senden
    if (!ValidateRequired(emailValue)) {
      CustomAlert(LoginMsg.ErrorHeader, LoginMsg.EmptyEmailErr);
      return;
    }
    
    if (!ValidateEmail(emailValue)) {
      CustomAlert(LoginMsg.ErrorHeader, LoginMsg.InvalidEmailErr);
      return;
    }
    
    if (!ValidateRequired(passwordValue)) {
      CustomAlert(LoginMsg.ErrorHeader, LoginMsg.EmptyPasswordErr);
      return;
    }

    try {
      setIsLoading(true);
      
      // [SPEICHERT] "Stay logged in"-Status in sessionStorage
      await sessionStorage.setPersistSession(isRememberMe);
      
      // [RUFT] AuthService für Login-Prozess auf
      const response = await AuthService.login({
        email: emailValue,
        password: passwordValue
      });
      
      setIsLoading(false);
      
      if (response.success) {
        // [SPEICHERT] E-Mail für "Remember Me"-Funktion
        if (isRememberMe) {
          await AsyncStorage.setItem('rememberedEmail', emailValue);
        } else {
          // [ENTFERNT] Gespeicherte E-Mail, wenn "Remember Me" nicht aktiviert
          await AsyncStorage.removeItem('rememberedEmail');
        }
        
        // [LEITET] Zur Team-Auswahl weiter
        router.replace(Team_Routes.Selection);
      } else {
        // [ZEIGT] Fehlermeldung bei Login-Fehler
        CustomAlert(LoginMsg.ErrorHeader, response.message || LoginMsg.InvalidCredentialsErr);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      CustomAlert(LoginMsg.ErrorHeader, LoginMsg.UnexpectedErr);
    }
  };

  // [NAVIGIERT] Zurück zur vorherigen Seite
  const HandleGoBack = () => {
    router.back();
  };

  // [NAVIGIERT] Zur Passwort-Zurücksetzungsseite
  const NavigateToResetPassword = () => {
    router.push(Auth_Routes.ResetPassword);
  };

  // [LÄDT] Gespeicherte E-Mail-Adresse für "Remember Me"-Funktion
  const loadRememberedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Error loading remembered email:", error);
    }
  };

  // [INITIALISIERT] Gespeicherte E-Mail beim Mounting
  useEffect(() => {
    loadRememberedEmail();
  }, []);

  return {
    emailValue,
    setEmail,
    passwordValue,
    setPassword,
    isRememberMe,
    setRememberMe,
    isLoading,
    handleLogin: HandleLogin,
    handleGoBack: HandleGoBack,
    navigateToResetPassword: NavigateToResetPassword,
    loadRememberedEmail
  };
}