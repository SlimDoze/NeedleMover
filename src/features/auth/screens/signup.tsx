import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/src/features/auth/_components/UserInput";
import { Const_AuthInfoText } from "../_constants/AuthInfoText";
import { View, Text, Button, TouchableOpacity, Image, Dimensions, Switch, ActivityIndicator  } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { AppColors } from "@/common/constants/AppColors";
import { styles } from "../_constants/signUpStylesheet";
import { useSignUp } from "../_hooks/useSignup";

const { width } = Dimensions.get("window");

export default function SignUpScreen() {
  const router = useRouter();
  const {
    formStep,
    userData,
    isLoading,
    updateField,
    nextStep,
    prevStep,
    handleSignUp
  } = useSignUp();
  
  const handleUserAvatarClick = () => {
    console.log("Profilbild angeklickt");
  };

  const handleGoBack = () => {
    if (formStep > 1) {
      prevStep();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleGoBack}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.Title}>{Const_AuthInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={handleUserAvatarClick}>
        <Image 
          source={require("@/assets/images/userAvatar.png")} 
          style={styles.userAvatar} 
        />
      </TouchableOpacity>

      {/* Erster Schritt: Name und Handle */}
      {formStep === 1 && (
        <>
          <UserInput 
            placeholder={Const_AuthInfoText.InputName} 
            value={userData.name}  
            onChangeText={(text) => updateField('name', text)}  
          />

          <UserInput
            placeholder={Const_AuthInfoText.InputHandle}
            value={userData.handle}  
            onChangeText={(text) => updateField('handle', text)}  
          />

          <View style={styles.Button}>
            <Button 
              title={Const_AuthInfoText.Continue} 
              onPress={nextStep} 
            />
          </View>
        </>
      )}

      {/* Zweiter Schritt: E-Mail, Passwort und Auto-Login */}
      {formStep === 2 && (
        <>
          <UserInput 
            placeholder={Const_AuthInfoText.InputEmail} 
            value={userData.email}  
            onChangeText={(text) => updateField('email', text)}  
          />

          <UserInput
            placeholder={Const_AuthInfoText.InputPassword}
            value={userData.password}  
            onChangeText={(text) => updateField('password', text)}
            secureTextEntry
          />

          <View style={styles.Button}>
            {isLoading ? (
              <ActivityIndicator size="large" color={AppColors.primary} />
            ) : (
              <Button 
                title={Const_AuthInfoText.Register} 
                onPress={handleSignUp} 
              />
            )}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>{Const_AuthInfoText.StayLoggedIn}</Text>
            <Switch
              value={userData.stayLoggedIn}
              onValueChange={(value) => updateField('stayLoggedIn', value)}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
