// src/features/auth/_hooks/useReset.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { customAlert } from "@/common/lib/alert";
import { ResetMsg } from "../_constants/AuthErrorText";
import { AUTH_ROUTES } from "../_constants/routes";
import { validateEmail,validateMatch,validatePassword,validateRequired } from "../_lib/AuthValidation";


export function useResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      customAlert(ResetMsg.InvalidEmailHeader, ResetMsg.InvalidEmailErr);
      return;
    }

    try {
      // Simulating sending reset email
      setIsLoading(true);
      
      // This is where you would make your API call
      // Example structure for future implementation:
      /*
      const response = await authService.requestPasswordReset({
        email: email
      });
      
      if (response.success) {
        customAlert(
          ResetMsg.EmailSentHeader, ResetMsg.EmailSentBody,
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
      } else {
        customAlert("Error", response.message || "Failed to send reset email");
      }
      */
      
      // Temporary simulation for development
      setTimeout(() => {
        customAlert(
          ResetMsg.EmailSentHeader, ResetMsg.EmailSentBody,
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      customAlert("Error", "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const checkVerificationCode = () => {
    if (validateRequired(verificationCode) && verificationCode.length === 6) {
      setStep(3);
    } else {
      customAlert(ResetMsg.InvalidCodeHeader, ResetMsg.InvalidCodeHeader);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validateMatch(newPassword, confirmPassword)) {
      customAlert(ResetMsg.PasswordMismatchHeader, ResetMsg.PasswordMismatchBody);
      return;
    }

    if (!validatePassword(newPassword)) {
      customAlert(ResetMsg.WeakPasswordHeader, ResetMsg.WeakPasswordBody);
      return;
    }

    try {
      setIsLoading(true);

      // This is where you would make your API call
      // Example structure for future implementation:
      /*
      const response = await authService.resetPassword({
        email: email,
        code: verificationCode,
        newPassword: newPassword
      });
      
      if (response.success) {
        customAlert(ResetMsg.SuccessHeader, ResetMsg.SuccessBody, [
          { text: 'OK', onPress: () => router.replace(AUTH_ROUTES.LOGIN) }
        ]);
      } else {
        customAlert("Error", response.message || "Failed to reset password");
      }
      */
      
      // Temporary simulation for development
      setTimeout(() => {
        customAlert(ResetMsg.SuccessHeader, ResetMsg.SuccessBody, [
          { text: 'OK', onPress: () => router.replace(AUTH_ROUTES.LOGIN) }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error resetting password:", error);
      customAlert("Error", "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
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