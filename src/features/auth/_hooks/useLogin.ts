// src/features/auth/_hooks/useLogin.tsx
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

  const handleLogin = () => {
    if (emailValue.trim() && passwordValue.trim()) {
      setIsLoading(true);

      setTimeout(() => {
        console.log("Login Versuch mit:", {
          email: emailValue,
          rememberMe: isRememberMe,
        });

        setIsLoading(false);
        router.replace(TEAM_ROUTES.SELECTION);
      }, 1000);
    } else {
      customAlert(LoginMsg.ErrorHeader, LoginMsg.ErrorBody);
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