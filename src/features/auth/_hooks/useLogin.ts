// src/features/auth/_hooks/useLogin.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { AUTH_ROUTES, TEAM_ROUTES } from "../_constants/routes";
import { customAlert } from "@/common/lib/alert";
import { LoginMsg } from "../_constants/AuthErrorText";

export function useLogin() {
  const router = useRouter();
  const [emailValue, setEmail] = useState<string>("");
  const [passwordValue, setPassword] = useState<string>("");
  const [isRememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!emailValue.trim() || !passwordValue.trim()) {
      customAlert(LoginMsg.ErrorHeader, LoginMsg.ErrorBody);
      return;
    }

    try {
      setIsLoading(true);
      
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
        setIsLoading(false);
        router.replace(TEAM_ROUTES.SELECTION);
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      customAlert("Login Error", "An unexpected error occurred. Please try again.");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const navigateToResetPassword = () => {
    router.push(AUTH_ROUTES.RESET_PASSWORD);
  };

  return {
    emailValue,
    setEmail,
    passwordValue,
    setPassword,
    isRememberMe,
    setRememberMe,
    isLoading,
    handleLogin,
    handleGoBack,
    navigateToResetPassword,
  };
}