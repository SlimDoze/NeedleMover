import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from "react-native";
import UserInput from "@/components/UserInput";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";


const { width } = Dimensions.get("window");

const LoginText = "LoginText";
const LogMsg = "Profile picture clicked";
const SubmitButtonText = "Submit";

export default function AU_SU_EmailPassword() {
  const [emailValue, setEmail] = useState("");  
  const [handleValue, setHandle] = useState(""); 

  const handleProfilePictureClick = () => {
    console.log(LogMsg);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handleProfilePictureClick}>
        <Image source={require("../../../assets/images/profilepictureicon.png")} style={styles.profilePicture} />
      </TouchableOpacity>

      <Text style={styles.title}>{LoginText}</Text>

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

      <Button title={SubmitButtonText} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "flex-end",  
    alignItems: "center",  
    backgroundColor: "#f5f5f5", 
    paddingHorizontal: width * 0.1, 
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,  
    fontWeight: "bold",  
    marginBottom: 20,  
  },
  profilePicture: {
    width: 100,  
    height: 100,  
    borderRadius: 50,  
    marginBottom: 10,  
  },
  inputWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
    justifyContent: "center",
  },
});