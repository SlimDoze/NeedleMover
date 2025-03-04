import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onPress, 
  style, 
  iconSize = 24, 
  iconColor = "black" 
}) => {
  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={onPress}
    >
      <AntDesign name="arrowleft" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 8,
  },
});

export default BackButton;