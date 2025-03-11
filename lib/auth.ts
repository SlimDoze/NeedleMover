import { supabase } from './supabase';
import { CustomAlert } from '@/common/lib/alert';

// User types
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserSignupData extends UserCredentials {
  name: string;
  handle: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Authentication service with methods for signup, login, logout, password reset
 */
export class AuthService {
  /**
   * Signs up a new user with email and password
   * Waits until the email is confirmed before proceeding
   */
  static async signUp({ 
    email, 
    password, 
    name, 
    handle 
  }: UserSignupData): Promise<AuthResponse> {
    try {
      // Signup with email confirmation enabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pending_profile: {
              name,
              handle
            }
          }
        }
      });

      if (authError) {
        console.error('Signup auth error:', authError);
        return {
          success: false,
          message: authError.message || 'Failed to create account',
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Please check your email to confirm signup',
        };
      }

      console.log("User created, waiting for email confirmation...");

      // Wait for email confirmation (polling every 3 seconds)
      const userId = authData.user.id;
      const isConfirmed = await AuthService.waitForEmailConfirmation(userId);

      if (!isConfirmed) {
        return {
          success: false,
          message: 'Email confirmation required. Please check your inbox.',
        };
      }

      return {
        success: true,
        message: 'Signup successful! Email verified.',
        data: authData
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during signup',
      };
    }
  }

  /**
   * Waits for email confirmation
   */
  static async waitForEmailConfirmation(userId: string, maxAttempts = 10, interval = 3000): Promise<boolean> {
    let attempts = 0;

    return new Promise((resolve) => {
      const checkEmailConfirmed = async () => {
        attempts++;

        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.error('Error fetching user:', error);
          clearInterval(intervalId);
          return resolve(false);
        }

        if (data.user.confirmed_at) {
          console.log("User email confirmed!");
          clearInterval(intervalId);
          return resolve(true);
        }

        if (attempts >= maxAttempts) {
          console.warn("Max attempts reached. Email confirmation still pending.");
          clearInterval(intervalId);
          return resolve(false);
        }
      };

      const intervalId = setInterval(checkEmailConfirmed, interval);
    });
  }

  /**
   * Retrieves the current session
   */
  static async getSession(): Promise<any> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Get session error:", error);
        return null;
      }
      return data.session;
    } catch (error) {
      console.error("Unexpected error fetching session:", error);
      return null;
    }
  }

  /**
   * Retrieves the user's profile from the profiles table
   */
  static async getUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Get profile error:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
      return null;
    }
  }

  static async login({ email, password }: UserCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return {
          success: false,
          message: error.message || 'Invalid email or password',
        };
      }

      // Check if user is confirmed
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.confirmed_at) {
        return {
          success: false,
          message: 'Please verify your email before logging in',
        };
      }

      return { 
        success: true,
        message: 'Logged in successfully',
        data,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during login',
      };
    }
  }

  static async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
  
      if (error) {
        console.error("Resend confirmation error:", error);
        return {
          success: false,
          message: error.message || "Failed to resend confirmation email",
        };
      }
  
      return {
        success: true,
        message: "A new confirmation email has been sent. Please check your inbox.",
      };
    } catch (error) {
      console.error("Unexpected error while resending email:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  }
  
}
