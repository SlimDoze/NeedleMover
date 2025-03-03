import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/components/General/UserInput";
import { AppColors } from "@/constants/AppColors";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";
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
  const [step, setPageTwo] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Einfache E-Mail-Validierung
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Ungültige E-Mail', 'Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    // Senden der Zurücksetzungs-E-Mail simulieren
    setIsLoading(true);
    
    // Verzögerung simulieren
    setTimeout(() => {
      Alert.alert(
        'Zurücksetzungs-E-Mail gesendet', 
        'Prüfe deine E-Mail für Anweisungen zum Zurücksetzen deines Passworts',
        [{ text: 'OK', onPress: () => setPageTwo(2) }]
      );
      setIsLoading(false);
    }, 1000);
  };

  const checkVerificationCode = () => {
    // Einfache Verifizierung - nur Länge prüfen
    if (verificationCode.length === 6) {
      setPageTwo(3);
    } else {
      Alert.alert('Ungültiger Code', 'Bitte gib den 6-stelligen Code ein, der an deine E-Mail gesendet wurde');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwörter stimmen nicht überein', 'Die Passwörter müssen übereinstimmen');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Schwaches Passwort', 'Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    // Passwort-Update simulieren
    setIsLoading(true);
    
    // Verzögerung simulieren
    setTimeout(() => {
      Alert.alert('Erfolg', 'Dein Passwort wurde zurückgesetzt', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
      setIsLoading(false);
    }, 1000);
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
        Gib die E-Mail-Adresse ein, die mit deinem Konto verknüpft ist
      </Text>
      <UserInput 
        placeholder="Email Adresse"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={AppColors.primary} />
        ) : (
          <Button 
            title="Verifizierungscode senden" 
            onPress={handleEmailSubmit} 
          />
        )}
      </View>
    </View>
  );

  const renderVerificationPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>
        Gib den 6-stelligen Verifizierungscode ein, der an {email} gesendet wurde
      </Text>
      <TextInput
        style={styles.codeInput}
        placeholder="6-stelligen Code eingeben"
        keyboardType="numeric"
        maxLength={6}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <View style={styles.Button}>
        <Button 
          title="Code verifizieren" 
          onPress={checkVerificationCode} 
        />
      </View>
      <TouchableOpacity onPress={() => handleEmailSubmit()}>
        <Text style={styles.resendText}>Code erneut senden</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordPage = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.description}>
        Erstelle ein neues Passwort für dein Konto
      </Text>
      <UserInput 
        placeholder="Neues Passwort"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <UserInput 
        placeholder="Neues Passwort bestätigen"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.Button}>
        {isLoading ? (
          <ActivityIndicator size="large" color={AppColors.primary} />
        ) : (
          <Button 
            title="Passwort zurücksetzen" 
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});