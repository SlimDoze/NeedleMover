import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/components/General/UserInput";
import { AppColors } from "@/constants/AppColors";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";
import { validateEmail } from "@/lib/LIB_Authentification";
import { useAuth } from "@/lib/LIB_AuthContext";
import { AntDesign } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";

// Bildschirmgröße ermitteln
const { width } = Dimensions.get("window");

export default function ResetPasswordFlow() {
  const router = useRouter();
  const { resetPassword, updatePassword } = useAuth();
  const [step, setPageTwo] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      
      // Call Supabase password reset
      await resetPassword(email);
      
      Alert.alert(
        'Reset Email Sent', 
        'Check your email for instructions to reset your password',
        [{ text: 'OK', onPress: () => setPageTwo(2) }]
      );
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationCode = () => {
    // In a real Supabase implementation, code verification happens when they click the link in email
    // For now, we'll simulate this by just checking length
    if (verificationCode.length === 6) {
      setPageTwo(3);
    } else {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your email');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      // Update password with Supabase
      await updatePassword(newPassword);
      
      Alert.alert('Success', 'Your password has been reset', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (step > 1) {
      setPageTwo(step - 1);
    } else {
      router.back();
    }
  };

  const renderEmailPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>
        Enter the email address associated with your account
      </Text>
      <UserInput 
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={AppColors.primary} />
        ) : (
          <Button 
            title="Send Verification Code" 
            onPress={handleEmailSubmit} 
          />
        )}
      </View>
    </View>
  );

  const renderVerificationPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>
        Enter the 6-digit verification code sent to {email}
      </Text>
      <TextInput
        style={styles.codeInput}
        placeholder="Enter 6-digit code"
        keyboardType="numeric"
        maxLength={6}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <View style={styles.Button}>
        <Button 
          title="Verify Code" 
          onPress={checkVerificationCode} 
        />
      </View>
      <TouchableOpacity onPress={() => handleEmailSubmit()}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>
        Create a new password for your account
      </Text>
      <UserInput 
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <UserInput 
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={AppColors.primary} />
        ) : (
          <Button 
            title="Reset Password" 
            onPress={handleUpdatePassword} 
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleGoBack}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.Title}>{Constant_FormInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={() => console.log("Profile picture clicked")}>
        <Image 
          source={require("../../assets/images/ProfilePictureIcon.png")} 
          style={styles.profilePicture} 
        />
      </TouchableOpacity>

      {step === 1 && renderEmailPage()}
      {step === 2 && renderVerificationPage()}
      {step === 3 && renderNewPasswordPage()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center",  
    alignItems: "center",  
    backgroundColor: AppColors.background, 
    paddingHorizontal: width * 0.1, 
    paddingBottom: 40,
  },
  Title: {
    fontSize: 50,  
    fontWeight: "bold",  
    marginBottom: 20  
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: AppColors.text.muted,
    paddingHorizontal: 20,
  },
  profilePicture: {
    width: 100,  
    height: 100,  
    borderRadius: 50,  
    marginBottom: 10,  
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  Button: {
    marginTop: 10, 
    width: "100%", 
    maxWidth: 400, 
    paddingHorizontal: 20,
  },
  codeInput: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  resendText: {
    marginTop: 15,
    color: AppColors.primary,
    textDecorationLine: 'underline',
  },
  // Neuer Style für den Zurück-Button
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});