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
   * Creates a pending user without immediate profile creation
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
            // Store additional user info to be used after confirmation
            pending_profile: {
              name,
              handle
            }
          },
          emailRedirectTo: 'needlemover://verify'
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

      return {
        success: true,
        message: 'Signup successful. Please check your email to confirm.',
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
   * Logs in a user with email and password
   */
  static async login({ 
    email, 
    password 
  }: UserCredentials): Promise<AuthResponse> {
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

  /**
   * Logs out the current user
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        return {
          success: false,
          message: error.message || 'Failed to log out',
        };
      }

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during logout',
      };
    }
  }

  /**
   * Sends a password reset email to the user
   */
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });

      if (error) {
        console.error('Password reset request error:', error);
        return {
          success: false,
          message: error.message || 'Failed to send password reset email',
        };
      }

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  /**
   * Resets a user's password using a recovery token
   */
  static async resetPassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password reset error:', error);
        return {
          success: false,
          message: error.message || 'Failed to reset password',
        };
      }

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }

  /**
   * Retrieves the current session
   */
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    return data.session;
  }

  /**
   * Retrieves the current user
   */
  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return data.user;
  }

  /**
   * Retrieves the user's profile from the profiles table
   */
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get profile error:', error);
      return null;
    }

    return data;
  }
}