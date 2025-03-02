import React, { useState } from "react";
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  TextInput,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/components/General/UserInput";
import { AppColors } from "@/constants/AppColors";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";
import { validateEmail } from "@/lib/LIB_signUpForm";

const { width } = Dimensions.get("window");

export default function ResetPasswordWorkflow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Simulated verification code generation (would be backend in real app)
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Simulate sending verification code
    const code = generateVerificationCode();
    console.log(`Verification code sent to ${email}: ${code}`);
    
    // In a real app, you'd call a backend endpoint to send the email
    Alert.alert('Verification Code Sent', 'Check your email for the 6-digit code');
    setStep(2);
  };

  const handleVerifyCode = () => {
    // In a real app, verify against backend-generated code
    if (verificationCode.length === 6) {
      setStep(3);
    } else {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your email');
    }
  };

  const handleResetPassword = () => {
    // Validate new password
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    // Simulate password reset
    console.log('Password reset successful');
    Alert.alert('Success', 'Your password has been reset');
    router.replace('/loginForm');
  };

  const renderEmailStep = () => (
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
        <Button 
          title="Send Verification Code" 
          onPress={handleEmailSubmit} 
        />
      </View>
    </View>
  );

  const renderVerificationStep = () => (
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
          onPress={handleVerifyCode} 
        />
      </View>
      <TouchableOpacity onPress={() => setStep(1)}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordStep = () => (
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
        <Button 
          title="Reset Password" 
          onPress={handleResetPassword} 
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.Title}>{Constant_FormInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={() => console.log("Profile picture clicked")}>
        <Image 
          source={require("../../assets/images/ProfilePictureIcon.png")} 
          style={styles.profilePicture} 
        />
      </TouchableOpacity>

      {step === 1 && renderEmailStep()}
      {step === 2 && renderVerificationStep()}
      {step === 3 && renderNewPasswordStep()}
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
});