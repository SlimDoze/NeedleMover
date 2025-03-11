import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/app/features/auth/_components/UserInput";
import { AuthInfoText } from "../_constants/AuthInfoText";
import { View, Text, Button, TouchableOpacity, Image, Dimensions, Switch, ActivityIndicator, Platform  } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { AppColors } from "@/common/constants/AppColors";
import { styles } from "../_constants/signUpStylesheet";
import { UseSignUp } from "../_hooks/useSignup";
import { formStyles, webFormStyles } from "../_constants/formStyle";

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
  } = UseSignUp();
  
  // Füge CSS-Stil für Web-Formulare hinzu
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Füge einmal den Style zum Dokument hinzu
      const style = document.createElement('style');
      style.textContent = webFormStyles;
      document.head.appendChild(style);
      
      // Clean-up beim Unmount
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  
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
      
      <Text style={styles.Title}>{AuthInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={handleUserAvatarClick}>
        <Image 
          source={require("@/assets/images/userAvatar.png")} 
          style={styles.userAvatar} 
        />
      </TouchableOpacity>

      {/* Erster Schritt: Name und Handle */}
      {formStep === 1 && (
        <>
          {Platform.OS === 'web' ? (
            <form className="web-form-container">
              <UserInput 
                placeholder={AuthInfoText.InputName} 
                value={userData.name}   
                onChangeText={(text) => updateField('name', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputHandle}
                value={userData.handle}  
                onChangeText={(text) => updateField('handle', text)}
              />
            </form>
          ) : (
            <View style={formStyles.formContainer}>
              <UserInput 
                placeholder={AuthInfoText.InputName} 
                value={userData.name}   
                onChangeText={(text) => updateField('name', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputHandle}
                value={userData.handle}  
                onChangeText={(text) => updateField('handle', text)}
              />
            </View>
          )}

          <View style={styles.Button}>
            <Button 
              title={AuthInfoText.Continue} 
              onPress={nextStep} 
            />
          </View>
        </>
      )}

      {/* Zweiter Schritt: E-Mail, Passwort und Auto-Login */}
      {formStep === 2 && (
        <>
          {Platform.OS === 'web' ? (
            <form className="web-form-container">
              <UserInput 
                placeholder={AuthInfoText.InputEmail} 
                value={userData.email}  
                onChangeText={(text) => updateField('email', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputPassword}
                value={userData.password}  
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
              />
            </form>
          ) : (
            <View style={formStyles.formContainer}>
              <UserInput 
                placeholder={AuthInfoText.InputEmail} 
                value={userData.email}  
                onChangeText={(text) => updateField('email', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputPassword}
                value={userData.password}  
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
              />
            </View>
          )}

          <View style={styles.Button}>
            {isLoading ? (
              <ActivityIndicator size="large" color={AppColors.primary} />
            ) : (
              <Button 
                title={AuthInfoText.Register} 
                onPress={handleSignUp} 
              />
            )}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>{AuthInfoText.StayLoggedIn}</Text>
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