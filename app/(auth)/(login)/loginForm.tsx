import React, { useState } from "react";
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Switch 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import UserInput from "@/components/General/UserInput";
import { AppColors } from "@/constants/AppColors";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";

// Bildschirmgröße ermitteln
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [emailValue, setEmail] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [isRememberMe, setRememberMe] = useState(false);

  const handleProfilePictureClick = () => {
    console.log("Profile picture clicked");
  };

  const handleLogin = () => {
    // Add validation logic here
    if (emailValue.trim() && passwordValue.trim()) {
      // Implement login logic
      console.log('Login attempt with:', {
        email: emailValue,
        rememberMe: isRememberMe
      });
      
      // Navigate to teams screen after successful login
    //   router.replace('/teams'); //TODO
    } else {
      alert('Please enter email and password');
    }
  };

  const navigateToResetPassword = () => {
    router.push('/resetPasswordForm');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.Title}>{Constant_FormInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={handleProfilePictureClick}>
        <Image 
          source={require("../../../assets/images/profilepictureicon.png")} 
          style={styles.profilePicture} 
        />
      </TouchableOpacity>

      <UserInput 
        placeholder={Constant_FormInfoText.InputEmail} 
        value={emailValue}  
        onChangeText={(text) => setEmail(text)}  
      />

      <UserInput
        placeholder={Constant_FormInfoText.InputPassword}
        value={passwordValue}  
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <View style={styles.Button}>
        <Button 
          title="Log In" 
          onPress={handleLogin} 
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Remember Me</Text>
        <Switch
          value={isRememberMe}
          onValueChange={(value) => setRememberMe(value)}
        />
      </View>

      <TouchableOpacity onPress={navigateToResetPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
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
  profilePicture: {
    width: 100,  
    height: 100,  
    borderRadius: 50,  
    marginBottom: 10,  
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchText: {
    marginRight: 10, 
  },
  Button: {
    marginTop: 10, 
    width: "100%", 
    maxWidth: 400, 
    paddingHorizontal: 20,
  },
  forgotPasswordText: {
    marginTop: 15,
    color: AppColors.primary,
    textDecorationLine: 'underline',
  },
});