/**
 * [BEREITSTELLUNG] Login-Logik für Authentifizierung
 * 
 * Dieser Hook handhabt die gesamte Login-Funktionalität, einschließlich:
 * - Formularstatusverwaltung für E-Mail und Passwort
 * - "Remember Me"-Funktionalität mit AsyncStorage
 * - Login-Prozess mit Validierung und Fehlerbehandlung
 * - Navigation nach erfolgreicher Anmeldung
 */
import { useState } from "react";
import { useRouter } from "expo-router";
import { Auth_Routes, Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { LoginMsg } from "../_constants/AuthErrorText";
import { AuthService } from "@/lib/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function UseLogin() {
  const router = useRouter();
  const [emailValue, setEmail] = useState<string>("");
  const [passwordValue, setPassword] = useState<string>("");
  const [isRememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, SetIsLoading] = useState<boolean>(false);

  // [VERARBEITET] Login-Anfrage mit Validierung und Fehlerbehandlung
const HandleLogin = async () => {
  if (!emailValue.trim() || !passwordValue.trim()) {
    CustomAlert(LoginMsg.ErrorHeader, LoginMsg.ErrorBody);
    return;
  }

  try {
    SetIsLoading(true);
    
    // [SPEICHERT] "Stay logged in"-Status in sessionStorage
    await sessionStorage.setPersistSession(isRememberMe);
    
    // [RUFT] AuthService für Login-Prozess auf
    const response = await AuthService.login({
      email: emailValue,
      password: passwordValue
    });
    
    SetIsLoading(false);
    
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
      CustomAlert("Login Error", response.message || "Invalid email or password");
    }
  } catch (error) {
    SetIsLoading(false);
    console.error("Login error:", error);
    CustomAlert("Login Error", "An unexpected error occurred. Please try again.");
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

  // [HINWEIS] Diese Funktion sollte in useEffect im Login-Screen aufgerufen werden

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