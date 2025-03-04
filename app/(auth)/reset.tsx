import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, Button, TouchableOpacity, Image, TextInput, ActivityIndicator } from "react-native";
import { useResetPassword } from "@/hooks/(auth)/useReset";
import { styles } from "@/constants/(Auth)/resetStylesheet";
import { Const_AuthInfoText } from "@/constants/(Auth)/AuthInfoText";
import { Const_Image } from "@/constants/CONST_Image";
import UserInput from "@/components/(Auth)/UserInput";

export default function ResetPasswordFlow() {
  const {
    step,
    setStep, // Updated to match the hook's naming convention
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
  } = useResetPassword();

  const renderEmailPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}> {Const_AuthInfoText.EnterEmail_Reset}</Text>
      <UserInput placeholder={Const_AuthInfoText.EmailPlaceholder} value={email} onChangeText={setEmail} />
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={"#8A4FFF"} />
        ) : (
          <Button title={Const_AuthInfoText.SendVerificationCode} onPress={handleEmailSubmit} />
        )}
      </View>
    </View>
  );

  const renderVerificationPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>
        {Const_AuthInfoText.EnterVerificationCode.replace("{email}", email)}
      </Text>
      <TextInput
        style={styles.codeInput}
        placeholder={Const_AuthInfoText.EnterSixDigitCode}
        keyboardType="numeric"
        maxLength={6}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <View style={styles.Button}>
        <Button title={Const_AuthInfoText.VerifyCode} onPress={checkVerificationCode} />
      </View>
      <TouchableOpacity onPress={handleEmailSubmit}>
        <Text style={styles.resendText}>{Const_AuthInfoText.ResentCode}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>{Const_AuthInfoText.CreateNewPassword}</Text>
      <UserInput placeholder={Const_AuthInfoText.NewPassword} value={newPassword} onChangeText={setNewPassword} secureTextEntry />
      <UserInput placeholder={Const_AuthInfoText.ConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={"#8A4FFF"} />
        ) : (
          <Button title={Const_AuthInfoText.ResetPassword} onPress={handleUpdatePassword} />
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

      <Text style={styles.Title}>{Const_AuthInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={() => console.log("Profile picture clicked")}>
        <Image source={Const_Image.ProfilePictureIcon} style={styles.profilePicture} />
      </TouchableOpacity>

      {step === 1 && renderEmailPage()}
      {step === 2 && renderVerificationPage()}
      {step === 3 && renderNewPasswordPage()}
    </SafeAreaView>
  );
}