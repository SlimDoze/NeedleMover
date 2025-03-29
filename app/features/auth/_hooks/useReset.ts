/**
 * [BEREITSTELLUNG] Passwort-Zurücksetzungs-Logik
 * 
 * Dieser Hook verwaltet den mehrstufigen Prozess der Passwort-Zurücksetzung:
 * - E-Mail-Eingabe und Validierung
 * - Verifikationscode-Eingabe
 * - Neue Passwort-Eingabe und Validierung
 * - Integration mit AuthService für Backend-Kommunikation
 */
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CustomAlert } from "@/common/lib/alert";
import { ResetMsg } from "../_constants/AuthErrorText";
import { Auth_Routes } from "../_constants/routes";
import { ValidateEmail, ValidateMatch, ValidatePassword, ValidateRequired } from "../_lib/AuthValidation";
import { AuthService } from "@/lib/auth";

// [ENUM] Status des Passwort-Reset-Flows
export enum ResetStep {
  REQUEST_EMAIL = 1,
  ENTER_CODE = 2,
  RESET_PASSWORD = 3,
  SUCCESS = 4
}

export function UseResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // [EXTRACTS] Token aus URL-Parametern für Deep-Link-Verarbeitung
  const tokenFromParams = params.token as string;
  const typeFromParams = params.type as string;
  const emailFromParams = params.email as string;
  
  // [INITIALIZE] States
  const [step, setStep] = useState<ResetStep>(
    tokenFromParams && typeFromParams === 'recovery' 
      ? ResetStep.RESET_PASSWORD 
      : ResetStep.REQUEST_EMAIL
  );
  const [email, setEmail] = useState<string>(emailFromParams || "");
  const [verificationCode, setVerificationCode] = useState<string>(tokenFromParams || "");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // [VERARBEITET] E-Mail-Eingabe und sendet Zurücksetzungs-Link
  const handleEmailSubmit = async () => {
    if (!ValidateEmail(email)) {
      CustomAlert(ResetMsg.InvalidEmailHeader, ResetMsg.InvalidEmailErr);
      return;
    }

    try {
      setIsLoading(true);
      
      // [RUFT] AuthService für Zurücksetzungsanfrage auf
      const response = await AuthService.requestPasswordReset(email);
      
      setIsLoading(false);
      
      if (response.success) {
        CustomAlert(
          ResetMsg.EmailSentHeader, 
          ResetMsg.EmailSentBody,
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
      } else {
        CustomAlert("Error", response.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      CustomAlert("Error", "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // [VALIDIERT] Eingabe des Verifikationscodes
  const checkVerificationCode = () => {
    if (ValidateRequired(verificationCode) && verificationCode.length === 6) {
      setStep(3);
    } else {
      CustomAlert(ResetMsg.InvalidCodeHeader, ResetMsg.InvalidCodeBody);
    }
  };

  // [AKTUALISIERT] Passwort nach Validierung
  const handleUpdatePassword = async () => {
    // [VALIDATION] Passwort-Übereinstimmung prüfen
    if (!ValidateMatch(newPassword, confirmPassword)) {
      CustomAlert(ResetMsg.PasswordMismatchHeader, ResetMsg.PasswordMismatchBody);
      return;
    }

    // [VALIDATION] Passwort-Stärke prüfen
    if (!ValidatePassword(newPassword)) {
      CustomAlert(ResetMsg.WeakPasswordHeader, ResetMsg.WeakPasswordBody);
      return;
    }

    try {
      setIsLoading(true);

      let response;
      
      // [UNTERSCHEIDET] zwischen Token-basiertem Reset (Deep-Link) und Code-basiertem Reset
      if (tokenFromParams && typeFromParams === 'recovery') {
        // [VERWENDET] Token aus URL für Reset
        response = await AuthService.verifyPasswordReset(
          tokenFromParams,
          emailFromParams || email,
          newPassword
        );
      } else if (verificationCode) {
        // [VERWENDET] manuell eingegebenen Code für Reset
        response = await AuthService.verifyPasswordReset(
          verificationCode,
          email,
          newPassword
        );
      } else {
        // [FALLBACK] auf alte Methode, falls kein Token/Code vorhanden
        response = await AuthService.resetPassword(newPassword);
      }
      
      setIsLoading(false);
      
      if (response.success) {
        setStep(ResetStep.SUCCESS);
        
        try {
          // [ABMELDEN] Bestehende Sitzung nach Passwort-Reset beenden und warten bis abgeschlossen
          const logoutResponse = await AuthService.logout();
          
          // Kurze Verzögerung, um sicherzustellen, dass alle Auth-Events verarbeitet wurden
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (logoutResponse.success) {
            console.log("Erfolgreich abgemeldet nach Passwort-Reset");
          } else {
            console.warn("Abmeldung nach Passwort-Reset fehlgeschlagen:", logoutResponse.message);
          }
          
          // Erst jetzt Alert anzeigen und zur Login-Seite navigieren
          CustomAlert(ResetMsg.SuccessHeader, ResetMsg.SuccessBody, [
            { text: 'OK', onPress: () => router.replace(Auth_Routes.Login) }
          ]);
        } catch (error) {
          console.error("Fehler beim Abmelden nach Passwort-Reset:", error);
          // Trotzdem zur Login-Seite navigieren, falls ein Fehler auftritt
          CustomAlert(ResetMsg.SuccessHeader, ResetMsg.SuccessBody, [
            { text: 'OK', onPress: () => router.replace(Auth_Routes.Login) }
          ]);
        }
      } else {
        CustomAlert("Error", response.message || "Fehler beim Zurücksetzen des Passworts");
      }
    } catch (error) {
      console.error("Fehler beim Zurücksetzen des Passworts:", error);
      CustomAlert("Error", "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.");
      setIsLoading(false);
    }
  };

  // [NAVIGIERT] Zurück zum vorherigen Schritt oder zur vorherigen Seite
  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return {
    step,
    setStep,
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
    // Neue Hilfseigenschaften für Deep-Link-Verarbeitung
    hasToken: !!tokenFromParams,
    tokenType: typeFromParams,
    tokenEmail: emailFromParams
  };
}