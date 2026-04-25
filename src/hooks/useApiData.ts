import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryClient } from '@/providers/query-client';

export function useAppData() {
  return useQuery({
    queryKey: ['app-data'],
    queryFn: api.getAppData
  });
}

export function useExercises(params: { query?: string; bodyPart?: string; limit?: number } = {}) {
  return useQuery({
    queryKey: ['exercises', params],
    queryFn: () => api.getExercises(params)
  });
}

export function useExercise(id?: string) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => api.getExercise(id as string),
    enabled: Boolean(id)
  });
}

export function useWorkout(id?: string) {
  return useQuery({
    queryKey: ['workout', id],
    queryFn: () => api.getWorkout(id as string),
    enabled: Boolean(id)
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: api.login,
    onSuccess: () => {
      void queryClient.invalidateQueries();
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: api.register,
    onSuccess: () => {
      void queryClient.invalidateQueries();
    }
  });
}

export function useSaveOnboarding() {
  return useMutation({
    mutationFn: api.saveOnboarding,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['app-data'] });
    }
  });
}

export function useCreateWorkoutLog() {
  return useMutation({
    mutationFn: api.createWorkoutLog,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['app-data'] });
    }
  });
}

export function useGenerateWorkoutPlan() {
  return useMutation({
    mutationFn: api.generateWorkoutPlan
  });
}

export function useCreateExerciseTask() {
  return useMutation({
    mutationFn: api.createExerciseTask
  });
}
