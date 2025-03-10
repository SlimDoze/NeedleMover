import { StyleSheet } from 'react-native';

// Gemeinsame Styles für Formulare auf allen Plattformen
export const formStyles = StyleSheet.create({
  formContainer: {
    width: '100%',
    alignItems: 'center',
  }
});

// HTML-Styles für Web-Formulare als String (wird dynamisch angewendet)
export const webFormStyles = `
  .web-form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;