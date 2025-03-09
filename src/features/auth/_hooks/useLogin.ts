// src/features/auth/_hooks/useLogin.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { Auth_Routes, Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { LoginMsg } from "../_constants/AuthErrorText";

export function UseLogin() {
  const router = useRouter();
  const [emailValue, setEmail] = useState<string>("");
  const [passwordValue, setPassword] = useState<string>("");
  const [isRememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, SetIsLoading] = useState<boolean>(false);

  const HandleLogin = async () => {
    if (!emailValue.trim() || !passwordValue.trim()) {
      CustomAlert(LoginMsg.ErrorHeader, LoginMsg.ErrorBody);
      return;
    }

    try {
      SetIsLoading(true);
      
      // This is where you would make your API call
      // Example structure for future implementation:
      /*
      const response = await authService.login({
        email: emailValue,
        password: passwordValue
      });
      
      if (response.success) {
        // Store tokens, user info, etc.
        if (isRememberMe) {
          // Persist auth state
        }
        router.replace(TEAM_ROUTES.SELECTION);
      } else {
        customAlert('Login Failed', response.message);
      }
      */
      
      // Temporary simulation for development
      console.log("Login attempt with:", {
        email: emailValue,
        password: "[REDACTED]",
        rememberMe: isRememberMe,
      });
      
      setTimeout(() => {
        SetIsLoading(false);
        router.replace(Team_Routes.Selection);
      }, 1000);
      
    } catch (error) {
      SetIsLoading(false);
      console.error("Login error:", error);
      CustomAlert("Login Error", "An unexpected error occurred. Please try again.");
    }
  };

  const HandleGoBack = () => {
    router.back();
  };

  const NavigateToResetPassword = () => {
    router.push(Auth_Routes.ResetPassword);
  };

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
  };
}