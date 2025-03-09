import { SignupMsg } from "../_constants/AuthErrorText";
import { customAlert } from "@/common/lib/alert";

export interface UserSignupData {
  name: string;
  handle: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createSignupFormManager = () => {
  const initialState: UserSignupData = {
    name: '',
    handle: '',
    email: '',
    password: '',
    stayLoggedIn: false
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateFirstStep = (data: Pick<UserSignupData, 'name' | 'handle'>) => {
    if (!data.name.trim()) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterNameErr);
      return false;
    }
    if (!data.handle.trim()) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterHandleErr);
      return false;
    }
    return true;
  };

  const validateSecondStep = (data: Pick<UserSignupData, 'email' | 'password'>) => {
    if (!data.email.trim()) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterEmailErr);
      return false;
    }
    if (!validateEmail(data.email)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterValidMailEr);
      return false;
    }
    if (!data.password.trim()) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.EnterPasswordErr);
      return false;
    }
    if (!validatePassword(data.password)) {
      customAlert(SignupMsg.ValidationErrHeader, SignupMsg.PasswordCharErr);
      return false;
    }
    return true;
  };

  return {
    initialState,
    validateFirstStep,
    validateSecondStep,
  };
};
export default function Component() { return null; }