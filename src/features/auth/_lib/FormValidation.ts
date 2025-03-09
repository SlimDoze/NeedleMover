import { validateEmail,validatePassword,validateRequired,validateMatch } from './AuthValidation';
import { customAlert } from '@/common/lib/alert';

/**
 * Validates signup form data and displays appropriate alerts
 * @param data - The form data to validate
 * @param errorMessages - Alert messages for validation errors
 * @returns True if all validation passes, false otherwise
 */
export const validateSignupForm = (
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
  if (data.name !== undefined && !validateRequired(data.name)) {
    customAlert(errorMessages.header, errorMessages.emptyName || 'Please enter your name');
    return false;
  }

  // Handle validation
  if (data.handle !== undefined && !validateRequired(data.handle)) {
    customAlert(errorMessages.header, errorMessages.emptyHandle || 'Please enter your handle');
    return false;
  }

  // Email validation
  if (data.email !== undefined) {
    if (!validateRequired(data.email)) {
      customAlert(errorMessages.header, errorMessages.emptyEmail || 'Please enter your email');
      return false;
    }

    if (!validateEmail(data.email)) {
      customAlert(errorMessages.header, errorMessages.invalidEmail || 'Please enter a valid email');
      return false;
    }
  }

  // Password validation
  if (data.password !== undefined) {
    if (!validateRequired(data.password)) {
      customAlert(errorMessages.header, errorMessages.emptyPassword || 'Please enter a password');
      return false;
    }

    if (!validatePassword(data.password)) {
      customAlert(errorMessages.header, errorMessages.shortPassword || 'Password must be at least 6 characters');
      return false;
    }
  }

  // Password confirmation
  if (data.password !== undefined && data.confirmPassword !== undefined) {
    if (!validateMatch(data.password, data.confirmPassword)) {
      customAlert(errorMessages.header, errorMessages.passwordMismatch || 'Passwords do not match');
      return false;
    }
  }

  return true;
};