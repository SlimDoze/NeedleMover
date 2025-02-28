import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Dimensions, Switch } from "react-native";
import UserInput from "@/components/General/UserInput";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";
import { router } from "expo-router";

// Bildschirmgröße ermitteln
const { width } = Dimensions.get("window");

export default function AU_SU_EmailPassword() {
  const [emailValue, setEmail] = useState("");  // Zustand für die E-Mail-Adresse
  const [handleValue, setHandle] = useState(""); // Zustand für den Benutzernamen (Handle)

  const handleProfilePictureClick = () => {
    console.log("Profile picture clicked");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Title}>{Constant_FormInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={handleProfilePictureClick}>
        <Image source={require("../../../assets/images/profilepictureicon.png")} style={styles.profilePicture} />
      </TouchableOpacity>

      <UserInput 
        placeholder={Constant_FormInfoText.InputName} 
        value={emailValue}  
        onChangeText={(text) => setEmail(text)}  
      />

      <UserInput
        placeholder={Constant_FormInfoText.InputHandle}
        value={handleValue}  
        onChangeText={(text) => setHandle(text)}  
      />

      <View style={styles.Button}>
        <Button title={Constant_FormInfoText.Continue} onPress={() => {router.push('/(auth)/(Sign-up)/AU_SU_EmailVerification')}} />
      </View>
    </View>
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
  Button: {
    marginTop: 10, // Reduced space between toggle and button
    width: "100%", // Adjust the width as needed
    maxWidth: 400, // Set a maximum width
    paddingHorizontal: 20,
  },
});