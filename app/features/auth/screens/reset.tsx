import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, Button, TouchableOpacity, Image, TextInput, ActivityIndicator, Platform } from "react-native";
import { UseResetPassword } from "../_hooks/useReset";
import { styles } from "../_constants/resetStylesheet";
import { formStyles, webFormStyles } from "../_constants/formStyle";
import { AuthInfoText } from "../_constants/AuthInfoText";
import { CommonImages } from "@/common/constants/CONST_Image"
import UserInput from "../_components/UserInput";

export default function ResetPasswordFlow() {
  const {
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
  } = UseResetPassword();

  // Füge CSS-Stil für Web-Formulare hinzu
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

  const renderEmailPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}> {AuthInfoText.EnterEmail_Reset}</Text>
      {Platform.OS === 'web' ? (
        <form className="web-form-container">
          <UserInput placeholder={AuthInfoText.EmailPlaceholder} value={email} onChangeText={setEmail} />
        </form>
      ) : (
        <View style={formStyles.formContainer}>
          <UserInput placeholder={AuthInfoText.EmailPlaceholder} value={email} onChangeText={setEmail} />
        </View>
      )}
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={"#8A4FFF"} />
        ) : (
          <Button title={AuthInfoText.SendVerificationCode} onPress={handleEmailSubmit} />
        )}
      </View>
    </View>
  );

  const renderVerificationPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>
        {AuthInfoText.EnterVerificationCode.replace("{email}", email)}
      </Text>
      <TextInput
        style={styles.codeInput}
        placeholder={AuthInfoText.EnterSixDigitCode}
        keyboardType="numeric"
        maxLength={6}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <View style={styles.Button}>
        <Button title={AuthInfoText.VerifyCode} onPress={checkVerificationCode} />
      </View>
      <TouchableOpacity onPress={handleEmailSubmit}>
        <Text style={styles.resendText}>{AuthInfoText.ResentCode}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>{AuthInfoText.CreateNewPassword}</Text>
      {Platform.OS === 'web' ? (
        <form className="web-form-container">
          <UserInput placeholder={AuthInfoText.NewPassword} value={newPassword} onChangeText={setNewPassword} secureTextEntry />
          <UserInput placeholder={AuthInfoText.ConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </form>
      ) : (
        <View style={formStyles.formContainer}>
          <UserInput placeholder={AuthInfoText.NewPassword} value={newPassword} onChangeText={setNewPassword} secureTextEntry />
          <UserInput placeholder={AuthInfoText.ConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>
      )}
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={"#8A4FFF"} />
        ) : (
          <Button title={AuthInfoText.ResetPassword} onPress={handleUpdatePassword} />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.Title}>{AuthInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={() => console.log("Profile picture clicked")}>
        <Image source={CommonImages.userAvatar} style={styles.userAvatar} />
      </TouchableOpacity>

      {step === 1 && renderEmailPage()}
      {step === 2 && renderVerificationPage()}
      {step === 3 && renderNewPasswordPage()}
    </SafeAreaView>
  );
}