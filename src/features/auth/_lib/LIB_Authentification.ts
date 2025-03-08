import { AuthErrTxt } from "../_constants/AuthErrorText";
import { customAlert } from "@/common/lib/altert";

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
      customAlert(AuthErrTxt.SignUp_ValidationErrHeader, AuthErrTxt.SignUp_EnterName);
      return false;
    }
    if (!data.handle.trim()) {
      customAlert(AuthErrTxt.SignUp_ValidationErrHeader, AuthErrTxt.SignUp_EnterHandle);
      return false;
    }
    return true;
  };

  const validateSecondStep = (data: Pick<UserSignupData, 'email' | 'password'>) => {
    if (!data.email.trim()) {
      customAlert(AuthErrTxt.SignUp_ValidationErrHeader, AuthErrTxt.SignUp_EnterEmail);
      return false;
    }
    if (!validateEmail(data.email)) {
      customAlert(AuthErrTxt.SignUp_ValidationErrHeader, AuthErrTxt.SignUp_EnterValidMail);
      return false;
    }
    if (!data.password.trim()) {
      customAlert(AuthErrTxt.SignUp_ValidationErrHeader, AuthErrTxt.SignUp_EnterPassword);
      return false;
    }
    if (!validatePassword(data.password)) {
      customAlert(AuthErrTxt.SignUp_ValidationErrHeader, AuthErrTxt.SignUp_PasswordCharacterLenght);
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
export default function DummyComponent() { return null; }