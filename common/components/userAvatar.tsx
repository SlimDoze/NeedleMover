import React from "react";
import { TouchableOpacity, Image, StyleSheet, ImageSourcePropType, StyleProp, ImageStyle, ViewStyle } from "react-native";

interface userAvatarProps {
  source?: ImageSourcePropType;
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const userAvatar: React.FC<userAvatarProps> = ({ 
  source = require("../../assets/images/userAvatar.png"), 
  size = 100, 
  onPress,
  style,
  containerStyle
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress || (() => {})}
      style={containerStyle}
    >
      <Image
        source={source}
        style={[
          styles.userAvatar,
          { width: size, height: size, borderRadius: size / 2 },
          style
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    userAvatar: {
    resizeMode: "cover",
  },
});

export default userAvatar;