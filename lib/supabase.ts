/**
 * [BEREITSTELLUNG] Supabase-Client und Session-Management
 * 
 * Diese Datei konfiguriert den Supabase-Client für die Anwendung und
 * implementiert einen angepassten SessionStorage-Handler für die Authentifizierung.
 * Unterstützt persistente und nicht-persistente Sitzungen basierend auf Benutzereinstellungen.
 * Implementiert Caching-Mechanismen und plattformübergreifende Speicherstrategien.
 */
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// [IMPLEMENTIERT] Angepassten SessionStorage mit Persistenzsteuerung
class SessionStorage {
  private isPersistent: boolean = false;
  private isInitialized: boolean = false;
  // [VERWENDET] Statische Instanz zur Vermeidung paralleler Initialisierungen
  private static initPromise: Promise<void> | null = null;
  private cache: Map<string, string> = new Map();
  // [VERHINDERT] Wiederholte Protokollierung gleicher Pfade
  private static loggedPaths = new Set<string>();

  constructor() {
    // [STARTET] Einmalige Initialisierung beim Erstellen
    this.initializeOnce();
  }

  // [IMPLEMENTIERT] Singleton-Muster für die Initialisierung
  private initializeOnce() {
    if (!SessionStorage.initPromise) {
      SessionStorage.initPromise = this.initialize();
    }
  }

  // [INITIALISIERT] Storage-Handler asynchron
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
  
  // [LÄDT] Persistenzstatus aus dem AsyncStorage
  async loadPersistState() {
    try {
      const shouldPersist = await AsyncStorage.getItem('persistSession');
      
      // Wenn kein Wert gespeichert ist, standardmäßig auf true setzen
      if (shouldPersist === null) {
        this.isPersistent = true;
        // Persistenten Modus speichern
        await AsyncStorage.setItem('persistSession', 'true');
      } else {
        this.isPersistent = shouldPersist === 'true';
      }
      
      console.log("Loaded persist state:", this.isPersistent);
    } catch (error) {
      console.error("Error loading persistence state:", error);
      // [SETZT] Default auf true für bessere Benutzererfahrung
      this.isPersistent = true;
    }
  }

  // [WARTET] Auf Abschluss der Initialisierung
  private async waitForInitialization(): Promise<void> {
    if (!this.isInitialized && SessionStorage.initPromise) {
      await SessionStorage.initPromise;
    }
  }

  // [KONFIGURIERT] Persistenzmodus für Sitzungen
  async setPersistSession(persist: boolean) {
    try {
      await this.waitForInitialization();
      console.log("Setting persist session to:", persist);
      this.isPersistent = persist;
      
      // [SPEICHERT] Einstellung im AsyncStorage
      await AsyncStorage.setItem('persistSession', persist ? 'true' : 'false');
      
      // [MIGRIERT] Cache-Token in persistenten Speicher bei Aktivierung
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
  // [IDENTIFIZIERT] Authentifizierungs-Token anhand des Schlüsselnamens
  isAuthToken(key: string): boolean {
    return key.includes('supabase.auth.token') || 
           key.includes('sb-') || 
           key.includes('access_token') ||
           key.includes('refresh_token');
  }

  // [PROTOKOLLIERT] Nachrichten einmalig zur Vermeidung von Spam
  private logOnce(path: string, message: string) {
    if (!SessionStorage.loggedPaths.has(path)) {
      console.log(message);
      SessionStorage.loggedPaths.add(path);
      
      // [BEREINIGT] Pfadcache nach einer bestimmten Zeit
      setTimeout(() => {
        SessionStorage.loggedPaths.delete(path);
      }, 5000);
    }
  }

  // [LIEST] Wert aus AsyncStorage oder Cache
  async getItem(key: string): Promise<string | null> {
    try {
      // [WARTET] Auf Abschluss der Initialisierung
      await this.waitForInitialization();

      // [PRÜFT] Persistenzmodus für Auth-Tokens
      if (!this.isPersistent && this.isAuthToken(key)) {
        // [VERWENDET] Nur In-Memory-Cache im nicht-persistenten Modus
        this.logOnce(key, `Not persisting session, using in-memory cache for: ${key}`);
        return this.cache.get(key) || null;
      }

      // [PRÜFT] Cache für schnellen Zugriff
      if (this.cache.has(key)) {
        return this.cache.get(key) || null;
      }

      // [LIEST] Aus AsyncStorage bei Cache-Miss
      const value = await AsyncStorage.getItem(key);
      
      // [AKTUALISIERT] Cache mit dem gelesenen Wert
      if (value !== null) {
        this.cache.set(key, value);
      }
      
      return value;
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  }

  // [SPEICHERT] Wert im Cache und ggf. AsyncStorage
  async setItem(key: string, value: string): Promise<void> {
    try {
      // [WARTET] Auf Abschluss der Initialisierung
      await this.waitForInitialization();

      // [PRÜFT] Persistenzmodus für Auth-Tokens
      if (!this.isPersistent && this.isAuthToken(key)) {
        // [SPEICHERT] Nur im Cache im nicht-persistenten Modus
        this.logOnce(key, `Not persisting session, storing in-memory only for: ${key}`);
        this.cache.set(key, value);
        return;
      }

      // [SPEICHERT] In Cache und AsyncStorage im persistenten Modus
      this.cache.set(key, value);
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  }

  // [ENTFERNT] Gespeicherten Wert aus Cache und AsyncStorage
  async removeItem(key: string): Promise<void> {
    try {
      // [BEREINIGT] Aus beiden Speicherorten
      this.cache.delete(key);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  }

  // [LÖSCHT] Alle Authentifizierungs-Tokens
  async clearAuthTokens(): Promise<void> {
    try {
      // [ERMITTELT] Alle Schlüssel aus dem AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      
      // [FILTERT] Authentifizierungs-Token
      const authKeys = allKeys.filter(key => this.isAuthToken(key));
      
      // [ENTFERNT] Aus dem Cache
      for (const key of authKeys) {
        this.cache.delete(key);
      }
      
      // [ENTFERNT] Aus dem AsyncStorage in einem Batchvorgang
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
        console.log("Cleared auth tokens:", authKeys.length);
      }
    } catch (error) {
      console.error("Error clearing auth tokens:", error);
    }
  }
}

// [ERSTELLT] Instanz des SessionStorage-Handlers
const sessionStorage = new SessionStorage();

// [LÄDT] Konfigurationswerte aus Expo-Umgebungsvariablen
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// [VALIDIERT] Verfügbarkeit der erforderlichen Konfigurationswerte
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration. Please check your app.config.js and .env file.");
}

// [INITIALISIERT] Supabase-Client mit Konfiguration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: false, // Deaktiviere Debug-Logs in der Konsole
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  // [IMPLEMENTIERT] Wiederholungsstrategie für Verbindungsprobleme
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// [EXPORTIERT] SessionStorage für direkte Verwendung in der Anwendung
export { sessionStorage };