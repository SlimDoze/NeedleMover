export const ValidateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const ValidatePassword = (password: string): boolean => {
    return password.length >= 6;
  };
  
  export const ValidateRequired = (value: string): boolean => {
    return value.trim().length > 0;
  };
  export const ValidateMatch = (value: string, confirmValue: string): boolean => {
    return value === confirmValue;
  };