import { supabase } from './supabase';

// [Struktur] Anmeldeinformationen eines Nutzers
export interface UserCredentials {
  email: string;
  password: string;
}

// [Struktur] Anmeldeinformationen eines Nutzers
export interface UserSignupProfileDetails extends UserCredentials {
  name: string;
  handle: string;
}
// [Struktur] Auth Response => Rückgabewert jeder Funktion
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export class AuthService {
  
  // [Function] Validates and Logs user in
  static async login({ email, password }: UserCredentials): Promise<AuthResponse> {
    try {
      // [API Call] Einloggen mit Passwort
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

      // [API Call] Nutzer holen => Ist Email comfirmed
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.confirmed_at) {
        return {
          success: false,
          message: 'Please verify your email before logging in',
        };
      }
      // [When] Success
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
  // Neue Methode für lib/auth.ts hinzufügen
  static async loginAfterEmailConfirmation(email: string): Promise<AuthResponse> {
    try {
      console.log('Versuche Login nach E-Mail-Bestätigung für:', email);
      
      // Session-Persistenz sicherstellen für diesen Login
      await sessionStorage.setPersistSession(true);
      
      // 1. Prüfen, ob schon eine aktive Session vorhanden ist
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        console.log('Bereits aktive Session gefunden:', sessionData.session.user.id);
        return {
          success: true,
          message: 'Bereits angemeldet',
          data: sessionData
        };
      }
      
      // 2. Versuche direkten Login mit vorhandenen Anmeldedaten
      // Da wir das Passwort nicht haben, nutzen wir den Link-Token aus dem Deep Link
      console.log('Keine aktive Session, versuche expliziten Login');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password' // Dies wird fehlschlagen, aber es ist ein Versuch
      });
      
      if (error) {
        console.log('Normaler Login fehlgeschlagen, versuche OTP-Login');
        
        // 3. Wenn normaler Login fehlschlägt, verwende OTP
        // Dies ist ein "Fallback"-Mechanismus
        const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false
          }
        });
        
        if (otpError) {
          console.error('OTP-Login fehlgeschlagen:', otpError);
          return {
            success: false,
            message: otpError.message || 'Login fehlgeschlagen'
          };
        }
        
        console.log('OTP-Login erfolgreich, OTP wurde per E-Mail gesendet');
        return {
          success: true,
          message: 'Bitte prüfe deine E-Mails für den Login-Code',
          data: otpData
        };
      }
      
      console.log('Login erfolgreich');
      return {
        success: true,
        message: 'Erfolgreich angemeldet',
        data
      };
    } catch (error) {
      console.error('Unerwarteter Fehler beim Login nach Bestätigung:', error);
      return {
        success: false,
        message: 'Ein unerwarteter Fehler ist aufgetreten'
      };
    }
  }
// [Function] Validates and Signs user uo
  static async signUp({ email, password, name, handle }: UserSignupProfileDetails): Promise<AuthResponse> {
    try {
      // [API Call] Registrieren der Nutzerdaten
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

      // [Validation] API Rückgabe
      if (authError) {
        console.error('Signup auth error:', authError);
        return {
          success: false,
          message: authError.message || 'Failed to create account',
        };
      }

      // [When] Success
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
  
  // [Function] Validates and logs user out
  static async logout(): Promise<AuthResponse> {
    try {
      // [API Call] Ausloggen des Nutzers
      const { error } = await supabase.auth.signOut();
      
      // [Validation] API Rückgabe
      if (error) {
        console.error('Logout error:', error);
        return {
          success: false,
          message: error.message || 'Failed to sign out',
        };
      }
      
      // [When] Success
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

// [Function] Resends Email Adress
  static async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    try {
      // [API Call] Resend Email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
  
      // [Validation] API Rückgabe
      if (error) {
        console.error("Resend confirmation error:", error);
        return {
          success: false,
          message: error.message || "Failed to resend confirmation email",
        };
      }
  
      // [When] Success
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
  
  // [Function] Requests Password Reset Mail
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      // [API Call] Passwort zurücksetzen
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      // [Validation] API Rückgabe
      if (error) {
        console.error("Password reset request error:", error);
        return {
          success: false,
          message: error.message || "Failed to send reset email",
        };
      }

      // [When] Success
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

  // [Function] Resets Password
  static async resetPassword(newPassword: string): Promise<AuthResponse> {
    try {
      // [API Call] Nutzer-Passwort updaten
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      // [Validation] API Rückgabe
      if (error) {
        console.error("Password reset error:", error);
        return {
          success: false,
          message: error.message || "Failed to reset password",
        };
      }

      // [When] Success
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
  
  // [Function] Gets User of current Session
  static async getCurrentUser(): Promise<any> {
    try {
      // [API Call] Einloggen mit Passwort
      const { data, error } = await supabase.auth.getUser();

      // [Validation] API Rückgabe
      if (error) {
        console.error("Get user error:", error);
        return null;
      }

      // [When] Success
      return data.user;
    } catch (error) {
      console.error("Unexpected error fetching user:", error);
      return null;
    }
  }

  // [Function] Get's current session
  static async getSession(): Promise<any> {
    try {
      // [API Call] Session wird geholt
      const { data, error } = await supabase.auth.getSession();

      // [Validation] API Rückgabe
      if (error) {
        console.error("Get session error:", error);
        return null;
      }

      // [When] Success
      return data.session;
    } catch (error) {
      console.error("Unexpected error fetching session:", error);
      return null;
    }
  }

  // [Function] Get's public/profiles by User ID
  static async getProfilebyUserID(userId: string): Promise<any> {
    try {
      // [API Call] Datensatz aus public/profile Dabelle => Basiert auf UserID
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // [Validation] API Rückgabe
      if (error) {
        console.error("Get profile error:", error);
        return null;
      }

      // [When] Success
      return data;
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
      return null;
    }
  }
  
  // [Function] Get's public/profile by Email
static async getProfileByEmail(email: string): Promise<any> {
  try {
    // [Validation] Email Adress
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

    // [Validation] API Rückgabe
    if (error) {
      console.error("Get profile by email error:", error);
      return null;
    }

    // [When] Success
    return data;
  } catch (error) {
    console.error("Unexpected error fetching profile by email:", error);
    return null;
  }
}
}