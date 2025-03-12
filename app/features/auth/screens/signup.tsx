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

export default function SignUpScreen() {
  const router = useRouter();
  const {
    formStep,
    userData,
    isLoading,
    showConfirmationMsg,
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
          
          <Text style={emailConfirmStyles.title}>Check Your Email</Text>
          
          <Text style={emailConfirmStyles.message}>
            We've sent a confirmation email to <Text style={emailConfirmStyles.email}>{userData.email}</Text>.
            Please check your inbox and click the link to verify your email address.
          </Text>
          
          <View style={emailConfirmStyles.infoBox}>
            <Text style={emailConfirmStyles.infoText}>
              After confirming your email, you'll be automatically redirected to the app.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={emailConfirmStyles.resendButton}
            onPress={handleResendEmail}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={emailConfirmStyles.resendButtonText}>Resend Confirmation Email</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={emailConfirmStyles.backButton}
            onPress={() => router.replace('/')}
          >
            <Text style={emailConfirmStyles.backButtonText}>Back to Home</Text>
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