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

      return {
        success: true,
        message: 'Please check your email to confirm your account.',
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
   * Logs out the current user
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        return {
          success: false,
          message: error.message || 'Failed to sign out',
        };
      }
      
      return {
        success: true,
        message: 'Signed out successfully',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during logout',
      };
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
  
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error("Password reset request error:", error);
        return {
          success: false,
          message: error.message || "Failed to send reset email",
        };
      }

      return {
        success: true,
        message: "Password reset instructions have been sent to your email",
      };
    } catch (error) {
      console.error("Unexpected error requesting password reset:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  }

  static async resetPassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Password reset error:", error);
        return {
          success: false,
          message: error.message || "Failed to reset password",
        };
      }

      return {
        success: true,
        message: "Password has been reset successfully",
      };
    } catch (error) {
      console.error("Unexpected error resetting password:", error);
      return {
        success: false,
        message: "An unexpected error occurred",
      };
    }
  }
   /**
   * Retrieves the current user
   */
  static async getCurrentUser(): Promise<any> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Get user error:", error);
        return null;
      }
      return data.user;
    } catch (error) {
      console.error("Unexpected error fetching user:", error);
      return null;
    }
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
 /**
 * Sucht ein Profil anhand der E-Mail-Adresse
 */
static async getProfileByEmail(email: string): Promise<any> {
  try {
    // E-Mail-Adresse validieren
    if (!email || typeof email !== 'string') {
      console.error("Invalid email format");
      return null;
    }

    // Alternative Abfrage: Suche mit ilike für case-insensitive Suche
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", email)
      .maybeSingle(); // maybeSingle statt single

    if (error) {
      console.error("Get profile by email error:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching profile by email:", error);
    return null;
  }
}
}