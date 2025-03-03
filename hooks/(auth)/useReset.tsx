import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export function useResetPassword() {
  const router = useRouter();
  const [step, setPageTwo] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Einfache E-Mail-Validierung
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Ungültige E-Mail', 'Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    // Senden der Zurücksetzungs-E-Mail simulieren
    setIsLoading(true);
    
    setTimeout(() => {
      Alert.alert(
        'Zurücksetzungs-E-Mail gesendet',
        'Prüfe deine E-Mail für Anweisungen zum Zurücksetzen deines Passworts',
        [{ text: 'OK', onPress: () => setPageTwo(2) }]
      );
      setIsLoading(false);
    }, 1000);
  };

  const checkVerificationCode = () => {
    if (verificationCode.length === 6) {
      setPageTwo(3);
    } else {
      Alert.alert('Ungültiger Code', 'Bitte gib den 6-stelligen Code ein, der an deine E-Mail gesendet wurde');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwörter stimmen nicht überein', 'Die Passwörter müssen übereinstimmen');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Schwaches Passwort', 'Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      Alert.alert('Erfolg', 'Dein Passwort wurde zurückgesetzt', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleGoBack = () => {
    if (step > 1) {
      setPageTwo(step - 1);
    } else {
      router.back();
    }
  };

  return {
    step,
    setPageTwo,
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
  };
}
