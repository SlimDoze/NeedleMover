import { useState } from "react";
import { useRouter } from "expo-router";

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
        router.replace("../(teams)/selection");
      }, 1000);
    } else {
      alert("Bitte E-Mail und Passwort eingeben");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const navigateToResetPassword = () => {
    router.push("/reset");
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
