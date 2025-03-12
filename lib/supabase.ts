import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Benutzerdefinierter SessionStorage-Handler, der den "Stay logged in"-Status berücksichtigt
// Benutzerdefinierter SessionStorage-Handler mit robusterer Implementierung
class SessionStorage {
  private isPersistent: boolean = false;
  private isInitialized: boolean = false;
  private cache: Map<string, string> = new Map();

  constructor() {
    // Wir laden den Status asynchron, aber beginnen standardmäßig mit false
    this.isPersistent = false;
    this.isInitialized = false;
    this.initialize();
  }
// [OOP] Initiiert Klassen Instanz
  private async initialize() {
    try {
      await this.loadPersistState();
      this.isInitialized = true;
      console.log("SessionStorage initialized, persistSession =", this.isPersistent);
    } catch (error) {
      console.error("Failed to initialize SessionStorage:", error);
      this.isPersistent = false;
      this.isInitialized = true;
    }
  }
  
  // [Native] Ruft Persistenz Zustand aus AsyncStorage ab
  async loadPersistState() {
    try {
      const shouldPersist = await AsyncStorage.getItem('persistSession');
      this.isPersistent = shouldPersist === 'true';
      console.log("Loaded persist state:", this.isPersistent);
    } catch (error) {
      console.error("Error loading persistence state:", error);
      this.isPersistent = false;
    }
  }

  // [Native] Setzt den Persistenzzustand => speichert ihn im AsyncStorage
  async setPersistSession(persist: boolean) {
    try {
      console.log("Setting persist session to:", persist);
      this.isPersistent = persist;
      await AsyncStorage.setItem('persistSession', persist ? 'true' : 'false');
    } catch (error) {
      console.error("Error setting persistence state:", error);
    }
  }

  // [Native] Überprüft, ob ein Schlüssel ein Authentifizierungs-Token ist
  isAuthToken(key: string): boolean {
    return key.includes('supabase.auth.token') || 
           key.includes('sb-') || 
           key.includes('access_token') ||
           key.includes('refresh_token');
  }

  // [Native] Ruft einen Wert aus dem AsyncStorage oder dem Cache ab
  // [Native] Wenn der Wert ein Auth-Token ist und isPersistent auf false gesetzt ist, wird der Wert nur im Cache gespeichert.
  async getItem(key: string): Promise<string | null> {
    try {
      // Warte auf Initialisierung, wenn noch nicht abgeschlossen
      if (!this.isInitialized) {
        console.log("Waiting for initialization before getItem:", key);
        await this.waitForInitialization();
      }

      // Bei Auth-Tokens prüfen, ob persistiert werden soll
      if (!this.isPersistent && this.isAuthToken(key)) {
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

// [Native] Speichert einen Wert im AsyncStorage und im Cache
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Warte auf Initialisierung, wenn noch nicht abgeschlossen
      if (!this.isInitialized) {
        console.log("Waiting for initialization before setItem:", key);
        await this.waitForInitialization();
      }

      // Bei Auth-Tokens prüfen, ob persistiert werden soll
      if (!this.isPersistent && this.isAuthToken(key)) {
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

  // [Native] Entfernt einen Wert aus dem AsyncStorage und dem Cache
  async removeItem(key: string): Promise<void> {
    try {
      // Aus Cache und AsyncStorage entfernen
      this.cache.delete(key);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  }

  // [Native] // Wartet, bis die Initialisierung abgeschlossen ist
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

  // [Native] Hilfsmethode zum Löschen aller Auth-Token-Einträge
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

// Instanziiert die Session Storage Klasse
const sessionStorage = new SessionStorage();

// Umgebungsvariablen holen via Expo Constants
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// [Validate] Benötigte Werte müssen existieren, befor Client erstellt werden kann
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration. Please check your app.config.js and .env file.");
}

// [Export] Erstellt Supabase Client
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

// Exportiert den Session Storage für direkte Nutzung
export { sessionStorage };