// app/features/auth/screens/login.tsx
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import UserInput from "@/app/features/auth/_components/UserInput";
import { AuthInfoText } from "../_constants/AuthInfoText";
import { styles } from "../_constants/LoginStylesheet";
import { formStyles, webFormStyles } from "../_constants/formStyle";
import { UseLogin } from "../_hooks/useLogin";
import { CommonImages } from "@/common/constants/CONST_Image";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import BackButton from "@/common/components/backButton";
import ProfilePicture from "@/common/components/userAvatar";
import LoadingButton from "@/common/components/loadingButton";
import ToggleSwitch from "@/common/components/toggleSwitch";

const LoginScreen: React.FC = () => {
  const {
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
    loadRememberedEmail
  } = UseLogin();

  // Load remembered email on component mount
  useEffect(() => {
    loadRememberedEmail();
  }, []);

  // Add CSS style for web forms
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = webFormStyles;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <BackButton onPress={handleGoBack} />
      
      <Text style={styles.Title}>{AuthInfoText.NeedleMover}</Text>
      
      <ProfilePicture 
        source={CommonImages.userAvatar} 
        onPress={() => console.log("Profile picture clicked")} 
      />
      
      {Platform.OS === 'web' ? (
        <form className="web-form-container" onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}>
          <UserInput
            placeholder={AuthInfoText.InputEmail}
            value={emailValue}
            onChangeText={setEmail}
          />
          
          <UserInput
            placeholder={AuthInfoText.InputPassword}
            value={passwordValue}
            onChangeText={setPassword}
            secureTextEntry
          />
        </form>
      ) : (
        <View style={formStyles.formContainer}>
          <UserInput
            placeholder={AuthInfoText.InputEmail}
            value={emailValue}
            onChangeText={setEmail}
          />
          
          <UserInput
            placeholder={AuthInfoText.InputPassword}
            value={passwordValue}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      )}
      
      <View style={styles.Button}>
        <LoadingButton
          title="Log In"
          onPress={handleLogin}
          isLoading={isLoading}
          loadingColor="#8A4FFF"
        />
      </View>
      
      <ToggleSwitch
        label={AuthInfoText.RememberMe}
        value={isRememberMe}
        onValueChange={setRememberMe}
        containerStyle={styles.switchContainer}
        labelStyle={styles.switchText}
      />
      
      <TouchableOpacity onPress={navigateToResetPassword}>
        <Text style={styles.forgotPasswordText}>{AuthInfoText.forgotPassword}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;