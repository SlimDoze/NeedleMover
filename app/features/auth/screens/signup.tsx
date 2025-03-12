import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/app/features/auth/_components/UserInput";
import { AuthInfoText } from "../_constants/AuthInfoText";
import { View, Text, Button, TouchableOpacity, Image, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { AppColors } from "@/common/constants/AppColors";
import { styles } from "../_constants/signUpStylesheet";
import { UseSignUp } from "../_hooks/useSignup";
import { formStyles, webFormStyles } from "../_constants/formStyle";
import ToggleSwitch from "@/common/components/toggleSwitch";

export default function SignUpScreen() {
  const router = useRouter();
  const {
    formStep,
    userData,
    isLoading,
    showConfirmationMsg,
    isPolling,
    updateField,
    nextStep,
    prevStep,
    handleSignUp,
    handleResendEmail
  } = UseSignUp();
  
  // Add CSS style for web forms
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Add style to document once
      const style = document.createElement('style');
      style.textContent = webFormStyles;
      document.head.appendChild(style);
      
      // Clean up on unmount
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  
  const handleUserAvatarClick = () => {
    console.log("Profile picture clicked");
  };

  // If confirmation message is showing, display a different UI
  if (showConfirmationMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <View style={emailConfirmStyles.container}>
          <AntDesign name="mail" size={64} color={AppColors.primary} style={emailConfirmStyles.icon} />
          
          <Text style={emailConfirmStyles.title}>Überprüfe deine E-Mail</Text>
          
          <Text style={emailConfirmStyles.message}>
            Wir haben eine Bestätigungs-E-Mail an <Text style={emailConfirmStyles.email}>{userData.email}</Text> gesendet.
            Bitte überprüfe deinen Posteingang und klicke auf den Link, um deine E-Mail-Adresse zu bestätigen.
          </Text>
          
          <View style={emailConfirmStyles.infoBox}>
            <Text style={emailConfirmStyles.infoText}>
              {isPolling ? 
                "Warte auf Bestätigung... Du wirst automatisch weitergeleitet, sobald du den Link in der E-Mail angeklickt hast." :
                "Nach der Bestätigung deiner E-Mail wirst du automatisch weitergeleitet."
              }
            </Text>
            {isPolling && (
              <ActivityIndicator 
                size="small" 
                color={AppColors.primary} 
                style={{ marginTop: 10 }} 
              />
            )}
          </View>
          
          <TouchableOpacity 
            style={emailConfirmStyles.resendButton}
            onPress={handleResendEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={emailConfirmStyles.resendButtonText}>Bestätigungs-E-Mail erneut senden</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={emailConfirmStyles.backButton}
            onPress={() => router.replace('/')}
          >
            <Text style={emailConfirmStyles.backButtonText}>Zurück zum Start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={prevStep}
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

      {/* First Step: Name and Handle */}
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

      {/* Second Step: E-Mail, Password and Auto-Login */}
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
          
          <ToggleSwitch
            label={AuthInfoText.StayLoggedIn}
            value={userData.stayLoggedIn}
            onValueChange={(value) => updateField('stayLoggedIn', value)}
            containerStyle={styles.switchContainer}
            labelStyle={styles.switchText}
          />

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
        </>
      )}
    </SafeAreaView>
  );
}

const emailConfirmStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: AppColors.text.dark,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: AppColors.text.muted,
    marginBottom: 24,
  },
  email: {
    fontWeight: 'bold',
    color: AppColors.text.dark,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
  },
  infoText: {
    color: '#0C4A6E',
    fontSize: 14,
  },
  resendButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  resendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: AppColors.text.muted,
    textDecorationLine: 'underline',
  },
});