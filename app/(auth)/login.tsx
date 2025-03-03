import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import UserInput from "@/components/(Auth)/UserInput";
import { Const_AuthInfoText } from "@/constants/(Auth)/AuthInfoText";
import { styles } from "@/constants/(Auth)/LoginStylesheet";
import { useLogin } from "@/hooks/(auth)/useLogin";
import { Const_Image } from "@/constants/CONST_Image";

import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
} from "react-native";

export default function LoginScreen() {
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
  } = useLogin();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Zurück-Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.Title}>{Const_AuthInfoText.NeedleMover}</Text>

      {/* Profilbild */}
      <TouchableOpacity onPress={() => console.log("Profile picture clicked")}>
      <Image source={Const_Image.ProfilePictureIcon} style={styles.profilePicture} /> 
      </TouchableOpacity>

      {/* E-Mail-Eingabe */}
      <UserInput
        placeholder={Const_AuthInfoText.InputEmail}
        value={emailValue}
        onChangeText={setEmail}
      />

      {/* Passwort-Eingabe */}
      <UserInput
        placeholder={Const_AuthInfoText.InputPassword}
        value={passwordValue}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login-Button */}
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={"#8A4FFF"} />
        ) : (
          <Button title="Log In" onPress={handleLogin} />
        )}
      </View>

      {/* "Angemeldet bleiben"-Schalter */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>{Const_AuthInfoText.RememberMe}</Text>
        <Switch value={isRememberMe} onValueChange={setRememberMe} />
      </View>

      <TouchableOpacity onPress={navigateToResetPassword}>
        <Text style={styles.forgotPasswordText}>{Const_AuthInfoText.forgotPassword}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
