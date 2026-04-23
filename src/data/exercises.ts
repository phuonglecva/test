import exercisesJson from '../../dataset/data/exercises.json';
import type { Exercise } from '@/types/exercise';
import { getExerciseMedia } from '@/lib/exercise-media';

export const exercises = exercisesJson as Exercise[];

export function getExerciseById(id: string) {
  return exercises.find((exercise) => exercise.id === id);
}

export function searchExercises(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return exercises;
  }

  return exercises.filter((exercise) => {
    return (
      exercise.id.toLowerCase().includes(normalized) ||
      exercise.name.toLowerCase().includes(normalized) ||
      exercise.category.toLowerCase().includes(normalized) ||
      exercise.body_part.toLowerCase().includes(normalized) ||
      exercise.equipment.toLowerCase().includes(normalized) ||
      exercise.target?.toLowerCase().includes(normalized) ||
      exercise.secondary_muscles?.some((muscle) => muscle.toLowerCase().includes(normalized)) ||
      false
    );
  });
}

export function getExerciseWithMedia(id: string) {
  const exercise = getExerciseById(id);

  if (!exercise) {
    return undefined;
  }

  const media = getExerciseMedia(id);

  return {
    ...exercise,
    media
  };
}
