import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/lib/mmkv';
import type { AppStats } from '@/types/app';

type AppState = {
  hasSeenOnboarding: boolean;
  activeTab: 'home' | 'library' | 'train' | 'progress' | 'profile';
  profileName: string;
  stats: AppStats;
  setHasSeenOnboarding: (value: boolean) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setProfileName: (name: string) => void;
  patchStats: (stats: Partial<AppStats>) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      activeTab: 'home',
      profileName: 'Shado',
      stats: {
        dailyVolume: 8420,
        calories: 642,
        streakDays: 18
      },
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setProfileName: (name) => set({ profileName: name }),
      patchStats: (stats) =>
        set((state) => ({
          stats: {
            ...state.stats,
            ...stats
          }
        }))
    }),
    {
      name: 'gym-buddy-app',
      storage: createJSONStorage(() => storage)
    }
  )
);
