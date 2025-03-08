// src/features/auth/_hooks/useReset.tsx
import { useState } from "react";
import { useRouter } from "expo-router";
import { customAlert } from "@/common/lib/altert";
import { AuthErrTxt } from "../_constants/AuthErrorText";
import { AUTH_ROUTES } from "../_constants/routes";

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
      customAlert(AuthErrTxt.Reset_InvalidEmailHeader, AuthErrTxt.Reset_InvalidEmailBody);
      return;
    }

    // Simulating sending reset email
    setIsLoading(true);
    
    setTimeout(() => {
      customAlert(
        AuthErrTxt.Reset_EmailSentHeader, AuthErrTxt.Reset_EmailSentBody,
        [{ text: 'OK', onPress: () => setStep(2) }]
      );
      setIsLoading(false);
    }, 1000);
  };

  const checkVerificationCode = () => {
    if (verificationCode.length === 6) {
      setStep(3);
    } else {
      customAlert(AuthErrTxt.Reset_InvalidCodeHeader, AuthErrTxt.Reset_InvalidCodeHeader);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      customAlert(AuthErrTxt.Reset_PasswordMismatchHeader, AuthErrTxt.Reset_PasswordMismatchBody);
      return;
    }

    if (newPassword.length < 6) {
      customAlert(AuthErrTxt.Reset_WeakPasswordHeader, AuthErrTxt.Reset_WeakPasswordBody);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      customAlert(AuthErrTxt.Reset_SuccessHeader, AuthErrTxt.Reset_SuccessBody, [
        { text: 'OK', onPress: () => router.replace(AUTH_ROUTES.LOGIN) }
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