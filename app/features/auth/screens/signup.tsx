/**
 * [BEREITSTELLUNG] Registrierungsbildschirm
 * 
 * Diese Datei implementiert den Registrierungsbildschirm (SignUp) für neue Benutzer.
 * Sie bietet einen mehrstufigen Registrierungsprozess mit:
 * - Erster Schritt: Eingabe von Name und Benutzername (Handle)
 * - Zweiter Schritt: Eingabe von E-Mail und Passwort mit "Eingeloggt bleiben"-Option
 * - Bestätigungsansicht nach erfolgreicher Registrierung mit E-Mail-Verifizierungsstatus
 * Enthält plattformspezifische Anpassungen für Web und Mobile.
 */
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import UserInput from "@/app/features/auth/_components/UserInput";
import { AuthInfoText } from "../_constants/AuthInfoText";
import { View, Text, Button, TouchableOpacity, Image, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { AppColors } from "@/common/constants/AppColors";
import { styles } from "../_constants/signUpStylesheet";
import { UseSignUp } from "../_hooks/useSignup";
import { formStyles, webFormStyles } from "../_constants/formStyle";
import ToggleSwitch from "@/common/components/toggleSwitch";

export default function SignUpScreen() {
  // [VERWENDET] Router für die Navigation zwischen Bildschirmen
  const router = useRouter();
  const {
    formStep,
    userData,
    isLoading,
    isConfirmMailSent,
    isPolling,
    updateField,
    nextStep,
    prevStep,
    handleSignUp,
    handleResendEmail
  } = UseSignUp();
  
  // [ADDS] Web-spezifische Stile für Formulare
  useEffect(() => {
    if (Platform.OS === 'web') {
      // [ERSTELLT] Benutzerdefiniertes Stylesheet für Web-Formulare
      const style = document.createElement('style');
      style.textContent = webFormStyles;
      document.head.appendChild(style);
      
      // [ENTFERNT] Stylesheet beim Unmount der Komponente
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  
  // [VERARBEITET] Klick auf das Benutzeravatar-Bild
  const handleUserAvatarClick = () => {
    console.log("Profile picture clicked");
  };

  // [ZEIGT] Bestätigungsansicht nach erfolgreicher Registrierung
  if (isConfirmMailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <View style={emailConfirmStyles.container}>
          <AntDesign name="mail" size={64} color={AppColors.primary} style={emailConfirmStyles.icon} />
          
          <Text style={emailConfirmStyles.title}>Überprüfe deine E-Mail</Text>
          
          <Text style={emailConfirmStyles.message}>
            Wir haben eine Bestätigungs-E-Mail an <Text style={emailConfirmStyles.email}>{userData.email}</Text> gesendet.
            Bitte überprüfe deinen Posteingang und klicke auf den Link, um deine E-Mail-Adresse zu bestätigen.
          </Text>
          
          <View style={emailConfirmStyles.infoBox}>
            <Text style={emailConfirmStyles.infoText}>
              {isPolling ? 
                // [ZEIGT] Polling-Statusmeldung
                "Warte auf Bestätigung... Du wirst automatisch weitergeleitet, sobald du den Link in der E-Mail angeklickt hast." :
                // [ZEIGT] Standardmeldung ohne aktives Polling
                "Nach der Bestätigung deiner E-Mail wirst du automatisch weitergeleitet."
              }
            </Text>

              
            {isPolling && (
              // [ZEIGT] Ladeindikator während des Pollings
              <ActivityIndicator 
                size="small" 
                color={AppColors.primary} 
                style={{ marginTop: 10 }} 
              />
            )}
          </View>
          
          <TouchableOpacity 
            style={emailConfirmStyles.resendButton}
            onPress={handleResendEmail}
            disabled={isLoading} // [DEAKTIVIERT] Button während des Ladens
          >
            {isLoading ? (
              // [ZEIGT] Ladeindikator während des erneuten Sendens
              <ActivityIndicator size="small" color="white" />
            ) : (
              // [ZEIGT] Button-Text im Ruhezustand
              <Text style={emailConfirmStyles.resendButtonText}>Bestätigungs-E-Mail erneut senden</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={emailConfirmStyles.backButton}
            onPress={() => router.replace('/')}
          >
            <Text style={emailConfirmStyles.backButtonText}>Zurück zum Start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={prevStep}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.Title}>{AuthInfoText.NeedleMover}</Text>

      <TouchableOpacity onPress={handleUserAvatarClick}>
        <Image 
          source={require("@/assets/images/userAvatar.png")} 
          style={styles.userAvatar} 
        />
      </TouchableOpacity>

      {/* [RENDERT] Ersten Schritt: Name und Benutzername (Handle) */}
      {formStep === 1 && (
        <>
          {Platform.OS === 'web' ? (
            // [ZEIGT] Web-spezifisches Formular
            <form className="web-form-container">
              <UserInput 
                placeholder={AuthInfoText.InputName} 
                value={userData.name}   
                onChangeText={(text) => updateField('name', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputHandle}
                value={userData.handle}  
                onChangeText={(text) => updateField('handle', text)}
              />
            </form>
          ) : (
            // [ZEIGT] Mobile-spezifisches Formular
            <View style={formStyles.formContainer}>
              <UserInput 
                placeholder={AuthInfoText.InputName} 
                value={userData.name}   
                onChangeText={(text) => updateField('name', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputHandle}
                value={userData.handle}  
                onChangeText={(text) => updateField('handle', text)}
              />
            </View>
          )}

          <View style={styles.Button}>
            <Button 
              title={AuthInfoText.Continue} 
              onPress={nextStep} 
            />
          </View>
        </>
      )}

      {/* [RENDERT] Zweiten Schritt: E-Mail, Passwort und "Eingeloggt bleiben"-Option */}
      {formStep === 2 && (
        <>
          {Platform.OS === 'web' ? (
            // [ZEIGT] Web-spezifisches Formular
            <form className="web-form-container">
              <UserInput 
                placeholder={AuthInfoText.InputEmail} 
                value={userData.email}  
                onChangeText={(text) => updateField('email', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputPassword}
                value={userData.password}  
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
              />
            </form>
          ) : (
            // [ZEIGT] Mobile-spezifisches Formular
            <View style={formStyles.formContainer}>
              <UserInput 
                placeholder={AuthInfoText.InputEmail} 
                value={userData.email}  
                onChangeText={(text) => updateField('email', text)}
              />

              <UserInput
                placeholder={AuthInfoText.InputPassword}
                value={userData.password}  
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
              />
            </View>
          )}
          
          <ToggleSwitch
            label={AuthInfoText.StayLoggedIn}
            value={userData.stayLoggedIn}
            onValueChange={(value) => updateField('stayLoggedIn', value)}
            containerStyle={styles.switchContainer}
            labelStyle={styles.switchText}
          />

          <View style={styles.Button}>
            {isLoading ? (
              // [ZEIGT] Ladeindikator während der Registrierung
              <ActivityIndicator size="large" color={AppColors.primary} />
            ) : (
              // [ZEIGT] Registrierungsbutton im Ruhezustand
              <Button 
                title={AuthInfoText.Register} 
                onPress={handleSignUp} 
              />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

// [DEFINIERT] Stile für die E-Mail-Bestätigungsansicht
const emailConfirmStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: AppColors.text.dark,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    color: AppColors.text.muted,
  },
  email: {
    fontWeight: 'bold',
    color: AppColors.text.dark,
  },
  infoBox: {
    backgroundColor: AppColors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    color: AppColors.text.muted,
  },
  resendButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
    minWidth: 250,
    alignItems: 'center',
  },
  resendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: AppColors.text.muted,
    fontSize: 14,
  }
});