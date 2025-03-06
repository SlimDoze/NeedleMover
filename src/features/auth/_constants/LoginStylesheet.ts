import { Dimensions, StyleSheet } from "react-native";
import { AppColors } from "@/common/constants/AppColors";

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
    userAvatar: {
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
    forgotPasswordText: {
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
  })
export default function DummyComponent() { return null; }