// src/features/auth/_hooks/useReset.tsx
import { useState } from "react";
import { useRouter } from "expo-router";
import { customAlter } from "@/common/lib/altert";

export function useResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simple email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      customAlter('Ungültige E-Mail', 'Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    // Simulating sending reset email
    setIsLoading(true);
    
    setTimeout(() => {
      customAlter(
        'Reset-E-Mail gesendet',
        'Überprüfe deine E-Mails für Anweisungen zum Zurücksetzen deines Passworts',
        [{ text: 'OK', onPress: () => setStep(2) }]
      );
      setIsLoading(false);
    }, 1000);
  };

  const checkVerificationCode = () => {
    if (verificationCode.length === 6) {
      setStep(3);
    } else {
      customAlter('Ungültiger Code', 'Bitte gib den 6-stelligen Code ein, der an deine E-Mail gesendet wurde');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      customAlter('Passwörter stimmen nicht überein', 'Die Passwörter müssen übereinstimmen');
      return;
    }

    if (newPassword.length < 6) {
      customAlter('Schwaches Passwort', 'Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      customAlter('Erfolg', 'Dein Passwort wurde zurückgesetzt', [
        { text: 'OK', onPress: () => router.replace('./login') }
      ]);
      setIsLoading(false);
    }, 1000);
  };

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
  };
}
export default function DummyComponent() { return null; }