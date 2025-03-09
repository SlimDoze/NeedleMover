import { ValidateEmail,ValidatePassword,ValidateRequired,ValidateMatch } from './AuthValidation';
import { CustomAlert } from '@/common/lib/alert';

/**
 * Validates signup form data and displays appropriate alerts
 * @param data - The form data to validate
 * @param errorMessages - Alert messages for validation errors
 * @returns True if all validation passes, false otherwise
 */
export const ValidateSignupForm = (
  data: {
    name?: string;
    handle?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  },
  errorMessages: {
    header: string;
    emptyName?: string;
    emptyHandle?: string;
    emptyEmail?: string;
    invalidEmail?: string;
    emptyPassword?: string;
    shortPassword?: string;
    passwordMismatch?: string;
  }
): boolean => {
  // Name validation
  if (data.name !== undefined && !ValidateRequired(data.name)) {
    CustomAlert(errorMessages.header, errorMessages.emptyName || 'Please enter your name');
    return false;
  }

  // Handle validation
  if (data.handle !== undefined && !ValidateRequired(data.handle)) {
    CustomAlert(errorMessages.header, errorMessages.emptyHandle || 'Please enter your handle');
    return false;
  }

  // Email validation
  if (data.email !== undefined) {
    if (!ValidateRequired(data.email)) {
      CustomAlert(errorMessages.header, errorMessages.emptyEmail || 'Please enter your email');
      return false;
    }

    if (!ValidateEmail(data.email)) {
      CustomAlert(errorMessages.header, errorMessages.invalidEmail || 'Please enter a valid email');
      return false;
    }
  }

  // Password validation
  if (data.password !== undefined) {
    if (!ValidateRequired(data.password)) {
      CustomAlert(errorMessages.header, errorMessages.emptyPassword || 'Please enter a password');
      return false;
    }

    if (!ValidatePassword(data.password)) {
      CustomAlert(errorMessages.header, errorMessages.shortPassword || 'Password must be at least 6 characters');
      return false;
    }
  }

  // Password confirmation
  if (data.password !== undefined && data.confirmPassword !== undefined) {
    if (!ValidateMatch(data.password, data.confirmPassword)) {
      CustomAlert(errorMessages.header, errorMessages.passwordMismatch || 'Passwords do not match');
      return false;
    }
  }

  return true;
};