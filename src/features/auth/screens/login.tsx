import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import UserInput from "@/src/features/auth/_components/UserInput";
import { Const_AuthInfoText } from "../_constants/AuthInfoText";
import { styles } from "../_constants/LoginStylesheet";
import { useLogin } from "../_hooks/useLogin";
import { Const_Image } from "@/common/constants/CONST_Image";
import { View, Text, TouchableOpacity} from "react-native";
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
  } = useLogin();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <BackButton onPress={handleGoBack} />
      
      <Text style={styles.Title}>{Const_AuthInfoText.NeedleMover}</Text>
      
      <ProfilePicture 
        source={Const_Image.userAvatar} 
        onPress={() => console.log("Profile picture clicked")} 
      />
      
      <UserInput
        placeholder={Const_AuthInfoText.InputEmail}
        value={emailValue}
        onChangeText={setEmail}
      />
      
      <UserInput
        placeholder={Const_AuthInfoText.InputPassword}
        value={passwordValue}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <View style={styles.Button}>
        <LoadingButton
          title="Log In"
          onPress={handleLogin}
          isLoading={isLoading}
          loadingColor="#8A4FFF"
        />
      </View>
      
      <ToggleSwitch
        label={Const_AuthInfoText.RememberMe}
        value={!!isRememberMe}
        onValueChange={setRememberMe}
        containerStyle={styles.switchContainer}
        labelStyle={styles.switchText}
      />
      
      <TouchableOpacity onPress={navigateToResetPassword}>
        <Text style={styles.forgotPasswordText}>{Const_AuthInfoText.forgotPassword}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;