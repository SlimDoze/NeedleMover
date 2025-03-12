import { useState } from "react";
import { useRouter } from "expo-router";
import { Team_Routes } from "../_constants/routes";
import { CustomAlert } from "@/common/lib/alert";
import { SignupMsg } from "../_constants/AuthErrorText";
import { ValidateEmail, ValidatePassword, ValidateRequired } from "../_lib/AuthValidation";
import { AuthService, UserSignupData } from "@/lib/auth";

// User data interface
interface UserSignupState {
  name: string;
  handle: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export function UseSignUp() {
  const router = useRouter();
  
  const initialState: UserSignupState = {
    name: '',
    handle: '',
    email: '',
    password: '',
    stayLoggedIn: false
  };
  
  const [formStep, setFormStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserSignupState>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmationMsg, setShowConfirmationMsg] = useState<boolean>(false);

  const UpdateField = (field: keyof UserSignupState, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const ValidateFirstStep = () => {
    if (!ValidateRequired(userData.name)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterNameErr);
      return false;
    }
    if (!ValidateRequired(userData.handle)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterHandleErr);
      return false;
    }
    return true;
  };

  const ValidateSecondStep = () => {
    if (!ValidateRequired(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterEmailErr);
      return false;
    }
    if (!ValidateEmail(userData.email)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterValidMailEr);
      return false;
    }
    if (!ValidateRequired(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterPasswordErr);
      return false;
    }
    if (!ValidatePassword(userData.password)) {
      CustomAlert(SignupMsg.ValidationErrHeader, SignupMsg.PasswordCharErr);
      return false;
    }
    return true;
  };

  const NextStep = () => {
    if (formStep === 1 && ValidateFirstStep()) {
      setFormStep(2);
    }
  };

  const PrevStep = () => {
    if (formStep > 1) {
      setFormStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const HandleSignUp = async () => {
    try {
      console.log("Starting Sign-Up with data:", userData);
      
      const isValid = ValidateSecondStep();
      console.log("Validation result:", isValid);
      
      if (isValid) {
        setIsLoading(true);
        
        // Call the AuthService to create the user account
        const response = await AuthService.signUp({
          name: userData.name,
          handle: userData.handle,
          email: userData.email,
          password: userData.password
        });
        
        setIsLoading(false);
        
        if (response.success) {
          // Show confirmation message
          CustomAlert(
            SignupMsg.SuceessHeader, 
            "Registration started. Please check your email to confirm your account.", 
            [{ text: "OK" }]
          );
          setShowConfirmationMsg(true);
        } else {
          // Handle registration error
          CustomAlert(SignupMsg.ErrorHeader, response.message || SignupMsg.ErrorBody);
        }
      }
    } catch (error) {
      console.error("Error during Sign-Up:", error);
      CustomAlert(SignupMsg.ErrorHeader, SignupMsg.ErrorBody);
      setIsLoading(false);
    }
  };

  const HandleResendEmail = async () => {
    try {
      if (!userData.email) {
        CustomAlert(SignupMsg.ErrorHeader, "Please enter your email first.");
        return;
      }
  
      setIsLoading(true);
      
      const response = await AuthService.resendConfirmationEmail(userData.email);
      
      setIsLoading(false);
      
      CustomAlert(SignupMsg.SuceessHeader, response.message || "A new confirmation email has been sent.");
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      setIsLoading(false);
      CustomAlert(SignupMsg.ErrorHeader, "Failed to resend confirmation email.");
    }
  };
  
  return {
    formStep,
    userData,
    isLoading,
    showConfirmationMsg,
    updateField: UpdateField,
    nextStep: NextStep,
    prevStep: PrevStep,
    handleSignUp: HandleSignUp,
    handleResendEmail: HandleResendEmail,
  };
}