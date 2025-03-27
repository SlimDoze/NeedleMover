/**
 * [BEREITSTELLUNG] Wiederverwendbare Benutzereingabekomponente
 * 
 * Diese Komponente bietet ein einheitliches Eingabefeld für Benutzerinformationen
 * mit plattformspezifischen Anpassungen für Web und Mobile.
 * Unterstützt reguläre Texteingaben und Passwortfelder mit entsprechenden
 * Zugänglichkeitsattributen für die jeweilige Plattform.
 */
import React, { useState } from "react";
import { View, TextInput, StyleSheet, Platform, TextInputProps } from "react-native";

// [DEFINIERT] Erweiterte Eigenschaften für angepasste Eingabekomponente
interface CustomInputProps extends TextInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  style?: object;
}

const UserInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  ...restProps
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  // [VERARBEITET] Texteingabeänderungen und gibt sie weiter
  const handleTextChange = (text: string) => {
    setInputValue(text);
    if (onChangeText) onChangeText(text);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={inputValue}
        onChangeText={handleTextChange}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        // [SETZT] Web-spezifische Zugänglichkeitsattribute
        aria-label={placeholder}
        {...(Platform.OS === 'web' ? {
          type: secureTextEntry ? 'password' : 'text',
          autoComplete: secureTextEntry ? 'new-password' : 'off',
        } : {})}
        {...restProps}
      />
    </View>
  );
};

export default UserInput;

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === "web" ? "50%" : "90%", 
    marginVertical: 10,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});