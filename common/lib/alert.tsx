// utils/alert.ts
import { Platform, Alert } from 'react-native';

export const CustomAlert = (
  title: string, 
  message: string, 
  buttons?: Array<{ text: string, onPress?: () => void }>,
) => {
  if (Platform.OS === 'web') {
    // Einfache Lösung für Web
    window.alert(`${title}\n${message}`);
    
    // Wenn ein OK-Button mit onPress definiert ist, diesen ausführen
    if (buttons && buttons.length && buttons[0].onPress) {
      buttons[0].onPress();
    }
  } else {
    // Native Alert für mobile Plattformen
    Alert.alert(
      title,
      message,
      buttons?.map(button => ({
        text: button.text,
        onPress: button.onPress
      })) || [{ text: 'OK' }]
    );
  }
};