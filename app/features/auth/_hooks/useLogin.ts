// app/features/auth/_hooks/useLogin.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { Auth_Routes, Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { LoginMsg } from "../_constants/AuthErrorText";
import { AuthService } from "@/common/lib/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      
      // Call the AuthService to log in the user
      const response = await AuthService.login({
        email: emailValue,
        password: passwordValue
      });
      
      SetIsLoading(false);
      
      if (response.success) {
        // If the user selected "Remember Me", store their email
        if (isRememberMe) {
          await AsyncStorage.setItem('rememberedEmail', emailValue);
        } else {
          // If "Remember Me" is not selected, clear any saved email
          await AsyncStorage.removeItem('rememberedEmail');
        }
        
        // Navigate to the team selection screen
        router.replace(Team_Routes.Selection);
      } else {
        // Handle login error
        CustomAlert("Login Error", response.message || "Invalid email or password");
      }
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

  // Load remembered email when component mounts
  const loadRememberedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Error loading remembered email:", error);
    }
  };

  // Call this function from useEffect in the login screen component

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
    loadRememberedEmail
  };
}