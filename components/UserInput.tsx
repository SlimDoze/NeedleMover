import React, { useState } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";

interface CustomInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  style?: object; // Erlaubt styling von außen
}

const UserInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleTextChange = (text: string) => {
    setInputValue(text);
    if (onChangeText) onChangeText(text);
  };

  return (
    <View style={[styles.container, style]}> {/* Externe Styles erlauben */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={inputValue}
        onChangeText={handleTextChange}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
};

export default UserInput;

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === "web" ? "50%" : "90%", // Web = 50%, Mobile = 90%
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