import { Platform } from 'react-native';
import type { MMKV } from 'react-native-mmkv';

const memoryStorage = new Map<string, string>();

let mmkv: MMKV | null = null;

if (Platform.OS !== 'web') {
  const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  mmkv = new MMKV({
    id: 'gym-buddy'
  });
}

export const storage = {
  getItem(key: string) {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key) ?? memoryStorage.get(key) ?? null;
    }

    if (mmkv) {
      return mmkv.getString(key) ?? null;
    }

    return memoryStorage.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
      memoryStorage.set(key, value);
      return;
    }

    if (mmkv) {
      mmkv.set(key, value);
      return;
    }

    memoryStorage.set(key, value);
  },
  removeItem(key: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
      memoryStorage.delete(key);
      return;
    }

    if (mmkv) {
      mmkv.delete(key);
      return;
    }

    memoryStorage.delete(key);
  }
};
