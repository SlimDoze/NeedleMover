import React from "react";
import { View, Button, ActivityIndicator, StyleSheet, StyleProp, ViewStyle, ButtonProps } from "react-native";

interface LoadingButtonProps {
  title: string;
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: string;
  loadingColor?: string;
  loadingSize?: "small" | "large" | number;
  buttonProps?: Omit<ButtonProps, 'title' | 'onPress' | 'disabled'>;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  title,
  onPress,
  isLoading,
  disabled = false,
  style,
  color,
  loadingColor = "#8A4FFF",
  loadingSize = "large",
  buttonProps
}) => {
  return (
    <View style={[styles.container, style]}>
      {isLoading ? (
        <ActivityIndicator size={loadingSize} color={loadingColor} />
      ) : (
        <Button
          title={title}
          onPress={onPress}
          disabled={disabled}
          color={color}
          {...buttonProps}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 36,
    justifyContent: "center",
  },
});

export default LoadingButton;