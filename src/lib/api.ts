import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { AppData, AuthResponse, ExerciseWithMedia, ExercisesResponse, OnboardingPayload, WorkoutDetail, WorkoutLog, WorkoutLogPayload, WorkoutPlan } from '@/types/api';
import type { Exercise } from '@/types/exercise';
import { getExerciseMedia } from '@/lib/exercise-media';
import { useAppStore } from '@/store/useAppStore';

function getDefaultApiUrl() {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8001';
  }

  const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoClient?.hostUri;
  const host = typeof hostUri === 'string' ? hostUri.split(':')[0] : undefined;

  if (host) {
    return `http://${host}:8001`;
  }

  return 'http://localhost:8001';
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? getDefaultApiUrl();

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAppStore.getState().authToken;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `API ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path);
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

function withMedia(exercise: Exercise): ExerciseWithMedia {
  return {
    ...exercise,
    media: getExerciseMedia(exercise.id)
  };
}

export const api = {
  baseUrl: API_BASE_URL,
  login: (payload: { email: string; password: string }) => apiPost<AuthResponse>('/auth/login', payload),
  register: (payload: { email: string; password: string; name: string }) => apiPost<AuthResponse>('/auth/register', payload),
  saveOnboarding: (payload: OnboardingPayload) => apiPatch<{ user: AuthResponse['user'] }>('/me/onboarding', payload),
  generateWorkoutPlan: (payload: { goal: string }) => apiPost<{ plan: WorkoutPlan }>('/workouts/generate', payload),
  getAppData: () => apiGet<AppData>('/app-data'),
  getExercises: async (params: { query?: string; bodyPart?: string; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();

    if (params.query) {
      searchParams.set('q', params.query);
    }

    if (params.bodyPart && params.bodyPart !== 'all') {
      searchParams.set('body_part', params.bodyPart);
    }

    searchParams.set('limit', String(params.limit ?? 50));

    const result = await apiGet<ExercisesResponse>(`/exercises?${searchParams.toString()}`);
    return {
      ...result,
      items: result.items.map(withMedia)
    };
  },
  getExercise: async (id: string) => withMedia(await apiGet<Exercise>(`/exercises/${encodeURIComponent(id)}`)),
  createExerciseTask: (id: string) => apiPost<{ plan: WorkoutPlan }>(`/exercises/${encodeURIComponent(id)}/task`, {}),
  getWorkout: (id: string) => apiGet<WorkoutDetail>(`/workouts/${encodeURIComponent(id)}`),
  getWorkoutLogs: () => apiGet<WorkoutLog[]>('/workout-logs'),
  createWorkoutLog: (payload: WorkoutLogPayload) => apiPost<WorkoutLog>('/workout-logs', payload)
};
