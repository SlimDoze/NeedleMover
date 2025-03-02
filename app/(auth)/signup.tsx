import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/components/General/UserInput";
import { createSignupFormManager } from "@/lib/LIB_Authentification";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Dimensions, Switch, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons'; // Füge diese Zeile hinzu

// Bildschirmgröße ermitteln
const { width } = Dimensions.get("window");

export default function SignUpScreen() {
  const router = useRouter();
  const { initialState, validateFirstStep, validateSecondStep } = createSignupFormManager();
  
  const [formStep, setFormStep] = useState(1);
  const [userData, setUserData] = useState(initialState);

  const updateField = (field: keyof typeof userData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (formStep === 1 && validateFirstStep(userData)) {
      setFormStep(2);
    }
  };

  const prevStep = () => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    }
  };

  const handleRegister = () => {
    if (validateSecondStep(userData)) {
      // Implement registration logic
      console.log('Registration Data:', userData);
      Alert.alert('Success', 'Registration completed!');
      // Optionally navigate to next screen
      // router.push('/home');
    }
  };

  const handleProfilePictureClick = () => {
    console.log("Profile picture clicked");
  };

  // Funktion für den Zurück-Button
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
      
      {/* Zurück-Button */}
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

      {/* First Step: Name and Handle */}
      {formStep === 1 && (
        <>
          <UserInput 
            placeholder={Constant_FormInfoText.InputName} 
            value={userData.name}  
            onChangeText={(text) => updateField('name', text)}  
          />

          <UserInput
            placeholder={Constant_FormInfoText.InputHandle}
            value={userData.handle}  
            onChangeText={(text) => updateField('handle', text)}  
          />

          <View style={styles.Button}>
            <Button 
              title={Constant_FormInfoText.Continue} 
              onPress={nextStep} 
            />
          </View>
        </>
      )}

      {/* Second Step: Email, Password, and Auto-Login */}
      {formStep === 2 && (
        <>
          <UserInput 
            placeholder={Constant_FormInfoText.InputEmail} 
            value={userData.email}  
            onChangeText={(text) => updateField('email', text)}  
          />

          <UserInput
            placeholder={Constant_FormInfoText.InputPassword}
            value={userData.password}  
            onChangeText={(text) => updateField('password', text)}
            secureTextEntry
          />

          <View style={styles.Button}>
            <Button 
              title={Constant_FormInfoText.Register} 
              onPress={handleRegister} 
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>{Constant_FormInfoText.StayLoggedIn}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center",  
    alignItems: "center",  
    backgroundColor: "#f5f5f5", 
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
  // Neuer Style für den Zurück-Button
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});