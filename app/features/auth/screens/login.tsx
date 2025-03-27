/**
 * [BEREITSTELLUNG] Login-Bildschirm
 * 
 * Diese Datei implementiert den Anmeldebildschirm für die Anwendung.
 * Bietet Benutzern die Möglichkeit, sich mit E-Mail und Passwort anzumelden.
 * Unterstützt die "Eingeloggt bleiben"-Funktion und enthält Links zur Passwort-Zurücksetzung.
 * Verwendet plattformspezifische Anpassungen für Web und Mobile.
 */
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import UserInput from "@/app/features/auth/_components/UserInput";
import { AuthInfoText } from "../_constants/AuthInfoText";
import { styles } from "../_constants/LoginStylesheet";
import { formStyles, webFormStyles } from "../_constants/formStyle";
import { UseLogin } from "../_hooks/useLogin";
import { CommonImages } from "@/common/constants/CONST_Image";
import { View, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
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
    navigateToResetPassword
  } = UseLogin();

  // [FÜGT] Web-spezifische Stile für Formulare hinzu
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

  // [HANDHABT] Formular-Absendung bei Drücken der Enter-Taste im Web
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <BackButton onPress={handleGoBack} />
      
      <Text style={styles.Title}>{AuthInfoText.NeedleMover}</Text>
      
      <ProfilePicture 
        source={CommonImages.userAvatar} 
        onPress={() => console.log("Profile picture clicked")} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ width: '100%' }}
      >
        {Platform.OS === 'web' ? (
          // [RENDERT] Web-spezifisches Formular
          <form className="web-form-container" onSubmit={handleSubmit}>
            <UserInput
              placeholder={AuthInfoText.InputEmail}
              value={emailValue}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <UserInput
              placeholder={AuthInfoText.InputPassword}
              value={passwordValue}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <button type="submit" style={{ display: 'none' }}></button>
          </form>
        ) : (
          // [RENDERT] Mobile-spezifisches Formular
          <View style={formStyles.formContainer}>
            <UserInput
              placeholder={AuthInfoText.InputEmail}
              value={emailValue}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <UserInput
              placeholder={AuthInfoText.InputPassword}
              value={passwordValue}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        )}
      </KeyboardAvoidingView>
      
      <View style={styles.Button}>
        <LoadingButton
          title="Anmelden"
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