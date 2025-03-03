import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/components/General/UserInput";
import { Constant_FormInfoText } from "@/constants/Forms/LoginRegisterInfoText";
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Switch, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { AppColors } from "@/constants/AppColors";

// Bildschirmgröße ermitteln
const { width } = Dimensions.get("window");

// Benutzerdatenschnittstelle
interface UserSignupData {
  name: string;
  handle: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export default function SignUpScreen() {
  const router = useRouter();
  
  const initialState: UserSignupData = {
    name: '',
    handle: '',
    email: '',
    password: '',
    stayLoggedIn: false
  };
  
  const [formStep, setFormStep] = useState(1);
  const [userData, setUserData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof UserSignupData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Einfache Validierungsfunktionen
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateFirstStep = () => {
    if (!userData.name.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib deinen Namen ein');
      return false;
    }
    if (!userData.handle.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib dein Handle ein');
      return false;
    }
    return true;
  };

  const validateSecondStep = () => {
    if (!userData.email.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib deine E-Mail ein');
      return false;
    }
    if (!validateEmail(userData.email)) {
      Alert.alert('Validierungsfehler', 'Bitte gib eine gültige E-Mail ein');
      return false;
    }
    if (!userData.password.trim()) {
      Alert.alert('Validierungsfehler', 'Bitte gib ein Passwort ein');
      return false;
    }
    if (!validatePassword(userData.password)) {
      Alert.alert('Validierungsfehler', 'Das Passwort muss mindestens 6 Zeichen lang sein');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (formStep === 1 && validateFirstStep()) {
      setFormStep(2);
    }
  };

  const prevStep = () => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    }
  };

  const handleSignUp = () => {
    if (validateSecondStep()) {
      // Registrierungsprozess simulieren
      setIsLoading(true);
      
      // Netzwerkverzögerung simulieren
      setTimeout(() => {
        console.log('Registrierungsdaten:', userData);
        
        // Nach erfolgreicher Registrierung zur Team-Auswahl navigieren
        Alert.alert('Erfolg', 'Registrierung abgeschlossen!', [
          {
            text: 'OK',
            onPress: () => router.replace('../(teams)/selection')
          }
        ]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleProfilePictureClick = () => {
    console.log("Profilbild angeklickt");
  };

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

      {/* Erster Schritt: Name und Handle */}
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

      {/* Zweiter Schritt: E-Mail, Passwort und Auto-Login */}
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
            {isLoading ? (
              <ActivityIndicator size="large" color={AppColors.primary} />
            ) : (
              <Button 
                title={Constant_FormInfoText.Register} 
                onPress={handleSignUp} 
              />
            )}
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});