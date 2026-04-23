import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { storage } from './storage';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? Constants.expoConfig?.extra?.supabaseUrl ?? '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? Constants.expoConfig?.extra?.supabaseAnonKey ?? '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          storage: {
            getItem: (key) => storage.getItem(key),
            setItem: (key, value) => storage.setItem(key, value),
            removeItem: (key) => storage.removeItem(key)
          }
        }
      })
    : null;
