import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/lib/storage';
import type { AppStats } from '@/types/app';
import type { WorkoutPlan } from '@/features/ai-chat';
import type { AppLanguage } from '@/lib/i18n';

type ActiveWorkoutSession = {
  currentExerciseIndex: number;
  completedExerciseIndexes: number[];
  startedAt: number;
};

type AppState = {
  hasSeenOnboarding: boolean;
  activeTab: 'home' | 'library' | 'train' | 'progress' | 'profile';
  profileName: string;
  language: AppLanguage;
  stats: AppStats;
  currentWorkoutPlan: WorkoutPlan | null;
  currentWorkoutSession: ActiveWorkoutSession | null;
  setHasSeenOnboarding: (value: boolean) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setProfileName: (name: string) => void;
  setLanguage: (language: AppLanguage) => void;
  patchStats: (stats: Partial<AppStats>) => void;
  setCurrentWorkout: (plan: WorkoutPlan, session: ActiveWorkoutSession) => void;
  patchCurrentWorkoutSession: (session: Partial<ActiveWorkoutSession>) => void;
  clearCurrentWorkout: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      activeTab: 'home',
      profileName: 'Shado',
      language: 'vi',
      stats: {
        dailyVolume: 8420,
        calories: 642,
        streakDays: 18
      },
      currentWorkoutPlan: null,
      currentWorkoutSession: null,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setProfileName: (name) => set({ profileName: name }),
      setLanguage: (language) => set({ language }),
      patchStats: (stats) =>
        set((state) => ({
          stats: {
            ...state.stats,
            ...stats
          }
        })),
      setCurrentWorkout: (plan, session) =>
        set({
          currentWorkoutPlan: plan,
          currentWorkoutSession: session
        }),
      patchCurrentWorkoutSession: (session) =>
        set((state) => ({
          currentWorkoutSession: state.currentWorkoutSession
            ? {
                ...state.currentWorkoutSession,
                ...session
              }
            : state.currentWorkoutSession
        })),
      clearCurrentWorkout: () =>
        set({
          currentWorkoutPlan: null,
          currentWorkoutSession: null
        })
    }),
    {
      name: 'gym-buddy-app',
      storage: createJSONStorage(() => storage)
    }
  )
);
