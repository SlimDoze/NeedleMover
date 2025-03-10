// app/features/auth/_hooks/useReset.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { CustomAlert } from "@/common/lib/alert";
import { ResetMsg } from "../_constants/AuthErrorText";
import { Auth_Routes } from "../_constants/routes";
import { ValidateEmail, ValidateMatch, ValidatePassword, ValidateRequired } from "../_lib/AuthValidation";
import { AuthService } from "@/common/lib/auth";

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
      setIsLoading(true);
      
      // Call the AuthService to request a password reset
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

  const checkVerificationCode = () => {
    if (ValidateRequired(verificationCode) && verificationCode.length === 6) {
      setStep(3);
    } else {
      CustomAlert(ResetMsg.InvalidCodeHeader, ResetMsg.InvalidCodeBody);
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

      // Call the AuthService to reset the password
      const response = await AuthService.resetPassword(newPassword);
      
      setIsLoading(false);
      
      if (response.success) {
        CustomAlert(ResetMsg.SuccessHeader, ResetMsg.SuccessBody, [
          { text: 'OK', onPress: () => router.replace(Auth_Routes.Login) }
        ]);
      } else {
        CustomAlert("Error", response.message || "Failed to reset password");
      }
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