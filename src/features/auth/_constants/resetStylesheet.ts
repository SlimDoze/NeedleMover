import { StyleSheet, Dimensions } from 'react-native';
import { AppColors } from '@/common/constants/AppColors';

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
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
    userAvatar: {
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