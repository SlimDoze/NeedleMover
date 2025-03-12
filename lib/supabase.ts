import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Benutzerdefinierter SessionStorage-Handler, der den "Stay logged in"-Status berücksichtigt
// Benutzerdefinierter SessionStorage-Handler mit robusterer Implementierung
class SessionStorage {
  private persistSession: boolean = false;
  private isInitialized: boolean = false;
  private cache: Map<string, string> = new Map();

  constructor() {
    // Wir laden den Status asynchron, aber beginnen standardmäßig mit false
    this.persistSession = false;
    this.isInitialized = false;
    this.initializeAsync();
  }

  private async initializeAsync() {
    try {
      await this.loadPersistState();
      this.isInitialized = true;
      console.log("SessionStorage initialized, persistSession =", this.persistSession);
    } catch (error) {
      console.error("Failed to initialize SessionStorage:", error);
      this.persistSession = false;
      this.isInitialized = true;
    }
  }

  async loadPersistState() {
    try {
      const shouldPersist = await AsyncStorage.getItem('persistSession');
      this.persistSession = shouldPersist === 'true';
      console.log("Loaded persist state:", this.persistSession);
    } catch (error) {
      console.error("Error loading persistence state:", error);
      this.persistSession = false;
    }
  }

  async setPersistSession(persist: boolean) {
    try {
      console.log("Setting persist session to:", persist);
      this.persistSession = persist;
      await AsyncStorage.setItem('persistSession', persist ? 'true' : 'false');
    } catch (error) {
      console.error("Error setting persistence state:", error);
    }
  }

  isAuthToken(key: string): boolean {
    return key.includes('supabase.auth.token') || 
           key.includes('sb-') || 
           key.includes('access_token') ||
           key.includes('refresh_token');
  }

  async getItem(key: string): Promise<string | null> {
    try {
      // Warte auf Initialisierung, wenn noch nicht abgeschlossen
      if (!this.isInitialized) {
        console.log("Waiting for initialization before getItem:", key);
        await this.waitForInitialization();
      }

      // Bei Auth-Tokens prüfen, ob persistiert werden soll
      if (!this.persistSession && this.isAuthToken(key)) {
        console.log("Not persisting session, returning null for:", key);
        return null;
      }

      // Aus Cache lesen, falls vorhanden
      if (this.cache.has(key)) {
        return this.cache.get(key) || null;
      }

      // Aus AsyncStorage lesen
      const value = await AsyncStorage.getItem(key);
      
      // In Cache speichern
      if (value !== null) {
        this.cache.set(key, value);
      }
      
      return value;
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      // Warte auf Initialisierung, wenn noch nicht abgeschlossen
      if (!this.isInitialized) {
        console.log("Waiting for initialization before setItem:", key);
        await this.waitForInitialization();
      }

      // Bei Auth-Tokens prüfen, ob persistiert werden soll
      if (!this.persistSession && this.isAuthToken(key)) {
        console.log("Not persisting session, skipping setItem for:", key);
        // Temporär im Cache speichern, aber nicht in AsyncStorage
        this.cache.set(key, value);
        return;
      }

      // In AsyncStorage und Cache speichern
      this.cache.set(key, value);
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      // Aus Cache und AsyncStorage entfernen
      this.cache.delete(key);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  }

  private waitForInitialization(): Promise<void> {
    return new Promise((resolve) => {
      const checkInit = () => {
        if (this.isInitialized) {
          resolve();
        } else {
          setTimeout(checkInit, 50);
        }
      };
      checkInit();
    });
  }

  // Hilfsmethode zum Löschen aller Auth-Token-Einträge
  async clearAuthTokens(): Promise<void> {
    try {
      // Liste aller Schlüssel holen
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Auth-Token-Schlüssel herausfiltern
      const authKeys = allKeys.filter(key => this.isAuthToken(key));
      
      // Aus Cache und AsyncStorage entfernen
      for (const key of authKeys) {
        this.cache.delete(key);
      }
      
      // In einem Batch entfernen
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
        console.log("Cleared auth tokens:", authKeys.length);
      }
    } catch (error) {
      console.error("Error clearing auth tokens:", error);
    }
  }
}

const sessionStorage = new SessionStorage();

// Get environment variables from Expo Constants
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Validate that we have the required values before creating the client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration. Please check your app.config.js and .env file.");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});

// Export the sessionStorage für direkte Nutzung
export { sessionStorage };