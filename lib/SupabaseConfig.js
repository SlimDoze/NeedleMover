// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://mercvtpbcknmkpwrpdav.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcmN2dHBiY2tubWtwd3JwZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODE4OTEsImV4cCI6MjA1NjU1Nzg5MX0.yUPkCswqX57jcir-rwI5rk1-dOrRCEGCfcaVJbqQvcs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
