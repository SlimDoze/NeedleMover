import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useRouter } from "expo-router";
import UserInput from "@/components/General/UserInput";
import { AppColors } from "@/constants/AppColors";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from "@/lib/LIB_AuthContext";
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Switch,
  ActivityIndicator,
  Alert
} from "react-native";

// Bildschirmgröße ermitteln
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [emailValue, setEmail] = useState("");
  const [passwordValue, setPassword] = useState("");
  const [isRememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfilePictureClick = () => {
    console.log("Profile picture clicked");
  };

  const handleLogin = async () => {
    // Text Input Validation Logic
    if (!emailValue.trim() || !passwordValue.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setIsLoading(true);
      
      // Call Supabase auth
      const { error } = await signIn(emailValue, passwordValue);
      
      if (error) throw error;
      
      // Navigate to teams screen after successful login
      router.replace('../(teams)/selection');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToResetPassword = () => {
    router.push('/reset');
  };

  const handleGoBack = () => {
    router.back();
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
      
      <Text style={styles.Title}>{Constant_FormInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={handleProfilePictureClick}>
        <Image 
          source={require("../../assets/images/ProfilePictureIcon.png")} 
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
        {isLoading ? (
          <ActivityIndicator size="large" color={AppColors.primary} />
        ) : (
          <Button 
            title="Log In" 
            onPress={handleLogin} 

          />
        )}
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
  // Neuer Style für den Zurück-Button
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});