/**
 * [BEREITSTELLUNG] Authentifizierungsdienste
 * 
 * Diese Datei enthält alle Authentifizierungsfunktionen für die Anwendung.
 * Verwendet Supabase als Backend-Dienst für Authentifizierung und Benutzerprofilmanagement.
 * Implementiert Login, Registrierung, Logout und Profilverwaltung.
 */
import { supabase } from './supabase';

// [DEFINIERT] Anmeldeinformationen eines Nutzers
export interface UserCredentials {
  email: string;
  password: string;
}

// [DEFINIERT] Registrierungsinformationen eines Nutzers mit Profildetails
export interface UserSignupProfileDetails extends UserCredentials {
  name: string;
  handle: string;
}
// [DEFINIERT] Standardisierte Antwortstruktur für alle Auth-Funktionen
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export class AuthService {
  
  // [FÜHRT AUS] Benutzeranmeldung mit E-Mail und Passwort
  static async login({ email, password }: UserCredentials): Promise<AuthResponse> {
    try {
      // [SENDET] Anmeldedaten an Supabase
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

      // [PRÜFT] Ob E-Mail-Adresse bestätigt wurde
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.confirmed_at) {
        return {
          success: false,
          message: 'Please verify your email before logging in',
        };
      }
      // [GIBT ZURÜCK] Erfolgreiche Anmeldung
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

// [REGISTRIERT] Neuen Benutzer mit Profilinformationen
static async signUp({ email, password, name, handle }: UserSignupProfileDetails): Promise<AuthResponse> {
  try {
    // [PROTOKOLLIERT] Registrierungsdaten für Debugging
    console.log('Signing up user with metadata:', { email, name, handle });
    
    // [STRUKTURIERT] Nutzerdaten für Metadaten-Speicherung
    const userMetadata = {
      pending_profile: {
        name,
        handle
      }
    };
    
    console.log('Full user metadata:', userMetadata);
    
    // [ERSTELLT] Auth-Nutzer mit Metadaten
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });

    // [PROTOKOLLIERT] Antwort für Debugging
    console.log('Auth response:', { 
      user: authData?.user?.id,
      email: authData?.user?.email,
      metadata: authData?.user?.user_metadata,
      error: authError 
    });

    // [VALIDIERT] Antwort
    if (authError) {
      console.error('Signup auth error:', authError);
      return {
        success: false,
        message: authError.message || 'Failed to create account',
      };
    }

    // [GIBT ZURÜCK] Erfolgsmeldung
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
  
  // [BEENDET] Benutzersitzung
  static async logout(): Promise<AuthResponse> {
    try {
      // [SENDET] Abmeldeanforderung an Supabase
      const { error } = await supabase.auth.signOut();
      
      // [VALIDIERT] API-Antwort
      if (error) {
        console.error('Logout error:', error);
        return {
          success: false,
          message: error.message || 'Failed to sign out',
        };
      }
      
      // [GIBT ZURÜCK] Erfolgsmeldung
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

// [SENDET] Bestätigungs-E-Mail erneut
  static async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    try {
      // [SENDET] Anforderung zum erneuten Versenden der Bestätigungs-E-Mail
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
  
      // [VALIDIERT] API-Antwort
      if (error) {
        console.error("Resend confirmation error:", error);
        return {
          success: false,
          message: error.message || "Failed to resend confirmation email",
        };
      }
  
      // [GIBT ZURÜCK] Erfolgsmeldung
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
  
  // [INITIIERT] Passwort-Zurücksetzung
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      // [SENDET] Anforderung zur Passwort-Zurücksetzung
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      // [VALIDIERT] API-Antwort
      if (error) {
        console.error("Password reset request error:", error);
        return {
          success: false,
          message: error.message || "Failed to send reset email",
        };
      }

      // [GIBT ZURÜCK] Erfolgsmeldung
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

  // [SETZT] Passwort zurück
  static async resetPassword(newPassword: string): Promise<AuthResponse> {
    try {
      // [AKTUALISIERT] Nutzer-Passwort
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      // [VALIDIERT] API-Antwort
      if (error) {
        console.error("Password reset error:", error);
        return {
          success: false,
          message: error.message || "Failed to reset password",
        };
      }

      // [GIBT ZURÜCK] Erfolgsmeldung
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
  
  // [VERIFIZIERT] Token und setzt Passwort zurück
  static async verifyPasswordReset(token: string, email: string, newPassword: string): Promise<AuthResponse> {
    try {
      console.log('Verifiziere Passwort-Reset mit Token');
      
      // [SCHRITT 1] Verifiziere OTP Token um den Benutzer anzumelden
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery'
      });

      // [VALIDIERE] OTP Verifizierung
      if (verifyError) {
        console.error("Token-Verifizierungsfehler:", verifyError);
        return {
          success: false,
          message: verifyError.message || "Ungültiger oder abgelaufener Token"
        };
      }
      
      // [PROTOKOLLIERT] Erfolgreich verifiziert und Sitzung erhalten
      console.log("OTP erfolgreich verifiziert, Benutzer angemeldet", verifyData.user?.id);

      // [SCHRITT 2] Aktualisiere das Passwort nach erfolgreicher Verifizierung
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      // [VALIDIERE] Passwort-Update
      if (updateError) {
        console.error("Passwort-Update-Fehler:", updateError);
        return {
          success: false,
          message: updateError.message || "Fehler beim Aktualisieren des Passworts"
        };
      }
      
      // [PROTOKOLLIERT] Erfolgreiche Passwort-Aktualisierung
      console.log("Passwort erfolgreich aktualisiert für Benutzer:", updateData.user?.id);

      // [WENN] Erfolgreich
      return {
        success: true,
        message: "Passwort wurde erfolgreich zurückgesetzt"
      };
    } catch (error) {
      console.error("Unerwarteter Fehler beim Zurücksetzen des Passworts:", error);
      return {
        success: false,
        message: "Ein unerwarteter Fehler ist aufgetreten"
      };
    }
  }
  
  // [LÄDT] Aktuellen Benutzer aus der Session
  static async getCurrentUser(): Promise<any> {
    try {
      // [HOLT] Benutzerinformationen aus Supabase
      const { data, error } = await supabase.auth.getUser();

      // [VALIDIERT] API-Antwort
      if (error) {
        console.error("Get user error:", error);
        return null;
      }

      // [GIBT ZURÜCK] Benutzerdaten
      return data.user;
    } catch (error) {
      console.error("Unexpected error fetching user:", error);
      return null;
    }
  }

  // [LÄDT] Aktuelle Sitzungsinformationen
  static async getSession(): Promise<any> {
    try {
      // [HOLT] Sitzungsinformationen aus Supabase
      const { data, error } = await supabase.auth.getSession();

      // [VALIDIERT] API-Antwort
      if (error) {
        console.error("Get session error:", error);
        return null;
      }

      // [GIBT ZURÜCK] Sitzungsdaten
      return data.session;
    } catch (error) {
      console.error("Unexpected error fetching session:", error);
      return null;
    }
  }
  // [ERSTELLT] Sitzung mit direkten Tokens
static async setSessionWithTokens(accessToken: string, refreshToken: string): Promise<AuthResponse> {
  try {
    console.log('Versuche Session mit direkten Tokens zu setzen');
    
    // [SETZT] Session mit den gegebenen Tokens
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    if (error) {
      console.error('Fehler beim Setzen der Session mit Tokens:', error);
      return {
        success: false,
        message: error.message || 'Fehler beim Setzen der Session'
      };
    }
    
    if (!data.session) {
      return {
        success: false,
        message: 'Keine Session erstellt'
      };
    }
    
    return {
      success: true,
      message: 'Session erfolgreich mit Tokens erstellt',
      data
    };
  } catch (error) {
    console.error('Unerwarteter Fehler beim Setzen der Session mit Tokens:', error);
    return {
      success: false,
      message: 'Ein unerwarteter Fehler ist aufgetreten'
    };
  }
}

  // [LÄDT] Benutzerprofil anhand der Benutzer-ID
  static async getProfilebyUserID(userId: string): Promise<any> {
    try {
      // [ABFRAGT] Profildaten aus der profiles-Tabelle
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // [VALIDIERT] API-Antwort
      if (error) {
        console.error("Get profile error:", error);
        return null;
      }

      // [GIBT ZURÜCK] Profildaten
      return data;
    } catch (error) {
      console.error("Unexpected error fetching user profile:", error);
      return null;
    }
  }
  
  // [LÄDT] Benutzerprofil anhand der E-Mail-Adresse
static async getProfileByEmail(email: string): Promise<any> {
  try {
    // [VALIDIERT] E-Mail-Format
    if (!email || typeof email !== 'string') {
      console.error("Invalid email format");
      return null;
    }

    console.log(`Searching for profile with email: ${email}`);

    // [ABFRAGT] Profil mit case-insensitiver E-Mail-Suche
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", email)
      .maybeSingle(); // [VERWENDET] maybeSingle für keine Fehler bei fehlenden Ergebnissen

    // [VALIDIERT] API-Antwort
    if (error) {
      console.error("Get profile by email error:", error);
      return null;
    }

    console.log(`Profile search result for ${email}:`, data);
    return data;
  } catch (error) {
    console.error("Unexpected error fetching profile by email:", error);
    return null;
  }
}
}