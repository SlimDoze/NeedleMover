import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Benutzerdefinierter SessionStorage-Handler, der den "Stay logged in"-Status berücksichtigt
// Benutzerdefinierter SessionStorage-Handler mit robusterer Implementierung

class SessionStorage {
  private isPersistent: boolean = false;
  private isInitialized: boolean = false;
  // [FIX] Verwende Static Instance, um mehrfache parallele Initialisierungen zu vermeiden
  private static initPromise: Promise<void> | null = null;
  private cache: Map<string, string> = new Map();
  // [FIX] Verwende einen Prozess-Flag, um zu vermeiden, dass Log-Meldungen gespammt werden
  private static loggedPaths = new Set<string>();

  constructor() {
    // Initialisieren der Klasse und speichern des Promise für spätere Verwendung
    this.initializeOnce();
  }

  // [FIX] Singleton-Pattern für die Initialisierung implementieren
  private initializeOnce() {
    if (!SessionStorage.initPromise) {
      SessionStorage.initPromise = this.initialize();
    }
  }

  // Initialisierungsmethode, die ein Promise zurückgibt
  private async initialize() {
    try {
      if (!this.isInitialized) {
        await this.loadPersistState();
        this.isInitialized = true;
        console.log("SessionStorage initialized, persistSession =", this.isPersistent);
      }
    } catch (error) {
      console.error("Failed to initialize SessionStorage:", error);
      this.isPersistent = false;
      this.isInitialized = true;
    }
  }
  
  // [Native] Lädt Persistenz-Status aus dem AsyncStorage
  async loadPersistState() {
    try {
      const shouldPersist = await AsyncStorage.getItem('persistSession');
      this.isPersistent = shouldPersist === 'true';
      console.log("Loaded persist state:", this.isPersistent);
    } catch (error) {
      console.error("Error loading persistence state:", error);
      // WICHTIG: Default auf true setzen für bessere Benutzererfahrung
      this.isPersistent = true;
    }
  }

  // [Native] Warten auf Initialisierung
  private async waitForInitialization(): Promise<void> {
    if (!this.isInitialized && SessionStorage.initPromise) {
      await SessionStorage.initPromise;
    }
  }

  // Setzt den Persistenzzustand und speichert ihn im AsyncStorage
  async setPersistSession(persist: boolean) {
    try {
      await this.waitForInitialization();
      console.log("Setting persist session to:", persist);
      this.isPersistent = persist;
      
      // WICHTIG: Wir speichern die Einstellung
      await AsyncStorage.setItem('persistSession', persist ? 'true' : 'false');
      
      // WICHTIG: Wenn wir auf persistent umschalten, vorhandene im-Memory-Tokens in AsyncStorage sichern
      if (persist) {
        for (const [key, value] of this.cache.entries()) {
          if (this.isAuthToken(key)) {
            console.log("Persisting cached auth token:", key);
            await AsyncStorage.setItem(key, value);
          }
        }
      }
    } catch (error) {
      console.error("Error setting persistence state:", error);
    }
  }
  // Überprüft, ob ein Schlüssel ein Authentifizierungs-Token ist
  isAuthToken(key: string): boolean {
    return key.includes('supabase.auth.token') || 
           key.includes('sb-') || 
           key.includes('access_token') ||
           key.includes('refresh_token');
  }

  // [FIX] Log-Begrenzung hinzufügen um Spam zu vermeiden
  private logOnce(path: string, message: string) {
    if (!SessionStorage.loggedPaths.has(path)) {
      console.log(message);
      SessionStorage.loggedPaths.add(path);
      
      // Setze nach einer gewissen Zeit zurück, um erneute Logs zu ermöglichen
      setTimeout(() => {
        SessionStorage.loggedPaths.delete(path);
      }, 5000);
    }
  }

  // Ruft einen Wert aus dem AsyncStorage oder Cache ab
  async getItem(key: string): Promise<string | null> {
    try {
      // Warte auf die Initialisierung, bevor fortgefahren wird
      await this.waitForInitialization();

      // Bei Auth-Tokens prüfen, ob persistiert werden soll
      if (!this.isPersistent && this.isAuthToken(key)) {
        // [FIX] Log-Spam reduzieren
        this.logOnce(key, `Not persisting session, using in-memory cache for: ${key}`);
        return this.cache.get(key) || null;
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

  // Speichert einen Wert im AsyncStorage und Cache
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Warte auf die Initialisierung, bevor fortgefahren wird
      await this.waitForInitialization();

      // Bei Auth-Tokens prüfen, ob persistiert werden soll
      if (!this.isPersistent && this.isAuthToken(key)) {
        // [FIX] Log-Spam reduzieren
        this.logOnce(key, `Not persisting session, storing in-memory only for: ${key}`);
        // Nur im Cache speichern, nicht in AsyncStorage
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

  // Rest der Methoden bleiben unverändert...
  async removeItem(key: string): Promise<void> {
    try {
      // Aus Cache und AsyncStorage entfernen
      this.cache.delete(key);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  }

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
  },
  // Retry-Strategie für bessere Stabilität bei schlechter Verbindung
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Exportiert den Session Storage für direkte Nutzung
export { sessionStorage };