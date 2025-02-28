import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from "react-native";
import UserInput from "@/components/UserInput";

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

      {/* Profilbild */}
      <TouchableOpacity onPress={handleProfilePictureClick}>
        <Image source={require("../../../assets/images/profilepictureicon.png")} style={styles.profilePicture} />
      </TouchableOpacity>

      {/* Login Titel */}
      <Text style={styles.title}>Login</Text>

      {/* Eingabefelder für Name */}
      <UserInput 
        placeholder="Enter your Name"
        value={emailValue}  // Setzt den Wert auf den aktuellen Email-Status
        onChangeText={(text) => setEmail(text)}  // Wenn sich der Text ändert, wird setEmail aufgerufen
      />

      {/* Eingabefelder für Handle */}
      <UserInput
        placeholder="Enter your Handle"
        value={handleValue}  // Setzt den Wert auf den aktuellen Handle-Status
        onChangeText={(text) => setHandle(text)}  // Wenn sich der Text ändert, wird setHandle aufgerufen
      />

      {/* Button zum Absenden der Daten */}
      <Button title="Submit" onPress={() => console.log("Email:", emailValue, "Handle:", handleValue)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Füllt den gesamten Bildschirm
    justifyContent: "flex-end",  // Zentriert alle Elemente vertikal
    alignItems: "center",  // Zentriert alle Elemente horizontal
    backgroundColor: "#f5f5f5", // Hintergrundfarbe
    paddingHorizontal: width * 0.1, // Dynamisches Padding basierend auf der Bildschirmgröße
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,  // Schriftgröße
    fontWeight: "bold",  // Fettgedruckt
    marginBottom: 20,  // Abstand nach unten
  },
  profilePicture: {
    width: 100,  // Feste Breite für das Profilbild
    height: 100,  // Feste Höhe für das Profilbild
    borderRadius: 50,  // Rundes Profilbild
    marginBottom: 10,  // Abstand nach unten
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