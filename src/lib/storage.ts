import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

const memoryStorage = new Map<string, string>();

const getWebStorage = () => {
  if (Platform.OS !== 'web') {
    return null;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
};

const getNativeItem = async (key: string) => {
  try {
    return (await AsyncStorage.getItem(key)) ?? memoryStorage.get(key) ?? null;
  } catch {
    return memoryStorage.get(key) ?? null;
  }
};

const setNativeItem = async (key: string, value: string) => {
  memoryStorage.set(key, value);

  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Keep the in-memory value so the current session can continue safely.
  }
};

const removeNativeItem = async (key: string) => {
  memoryStorage.delete(key);

  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Nothing else to clean up if native storage is temporarily unavailable.
  }
};

export const storage: StateStorage<void | Promise<void>> = {
  getItem(key: string) {
    const webStorage = getWebStorage();

    if (webStorage) {
      return webStorage.getItem(key) ?? memoryStorage.get(key) ?? null;
    }

    if (Platform.OS !== 'web') {
      return getNativeItem(key);
    }

    return memoryStorage.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    const webStorage = getWebStorage();

    if (webStorage) {
      webStorage.setItem(key, value);
      memoryStorage.set(key, value);
      return;
    }

    if (Platform.OS !== 'web') {
      return setNativeItem(key, value);
    }

    memoryStorage.set(key, value);
  },
  removeItem(key: string) {
    const webStorage = getWebStorage();

    if (webStorage) {
      webStorage.removeItem(key);
      memoryStorage.delete(key);
      return;
    }

    if (Platform.OS !== 'web') {
      return removeNativeItem(key);
    }

    memoryStorage.delete(key);
  }
};
