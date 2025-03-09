// src/features/auth/_hooks/useReset.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { CustomAlert } from "@/common/lib/alert";
import { ResetMsg } from "../_constants/AuthErrorText";
import { Auth_Routes } from "../_constants/routes";
import { ValidateEmail,ValidateMatch,ValidatePassword,ValidateRequired } from "../_lib/AuthValidation";


export function UseResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailSubmit = async () => {
    if (!ValidateEmail(email)) {
      CustomAlert(ResetMsg.InvalidEmailHeader, ResetMsg.InvalidEmailErr);
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
        CustomAlert(
          ResetMsg.EmailSentHeader, ResetMsg.EmailSentBody,
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      CustomAlert("Error", "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const checkVerificationCode = () => {
    if (ValidateRequired(verificationCode) && verificationCode.length === 6) {
      setStep(3);
    } else {
      CustomAlert(ResetMsg.InvalidCodeHeader, ResetMsg.InvalidCodeHeader);
    }
  };

  const handleUpdatePassword = async () => {
    if (!ValidateMatch(newPassword, confirmPassword)) {
      CustomAlert(ResetMsg.PasswordMismatchHeader, ResetMsg.PasswordMismatchBody);
      return;
    }

    if (!ValidatePassword(newPassword)) {
      CustomAlert(ResetMsg.WeakPasswordHeader, ResetMsg.WeakPasswordBody);
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
        CustomAlert(ResetMsg.SuccessHeader, ResetMsg.SuccessBody, [
          { text: 'OK', onPress: () => router.replace(Auth_Routes.Login) }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error resetting password:", error);
      CustomAlert("Error", "An unexpected error occurred. Please try again.");
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