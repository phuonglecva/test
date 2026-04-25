import type { Exercise, ExerciseMedia } from '@/types/exercise';

export type Accent = 'neon' | 'orange';

export type AppUser = {
  id?: number;
  email?: string;
  name: string;
  title: string;
  gym: string;
  plan: string;
  avatar: string;
  readiness: number;
  streakDays: number;
  weeklyGoal: number;
  weeklyDone: number;
  hasSeenOnboarding?: boolean;
  heightCm?: number | null;
  weightKg?: number | null;
  gender?: Gender;
  bmi?: number | null;
  bmiCategory?: string;
  planRecommendation?: string;
};

export type Gender = 'male' | 'female' | 'other';

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  title: string;
  gym: string;
  plan: string;
  avatar: string;
  readiness: number;
  weeklyGoal: number;
  heightCm?: number | null;
  weightKg?: number | null;
  gender: Gender;
  hasSeenOnboarding: boolean;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type OnboardingPayload = {
  name: string;
  title: string;
  gym: string;
  plan: string;
  weeklyGoal: number;
  heightCm?: number | null;
  weightKg?: number | null;
  gender: Gender;
};

export type WorkoutExercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  cue: string;
};

export type WorkoutTip = {
  title: string;
  body: string;
  category: 'training' | 'execution' | 'recovery';
};

export type WorkoutPlan = {
  title: string;
  summary: string;
  focus: string;
  durationMinutes: number;
  difficulty: string;
  warmup: string[];
  exercises: WorkoutExercise[];
  tips: WorkoutTip[];
  recovery: string[];
  note: string;
  source?: 'openrouter' | 'rule_based' | 'exercise_task';
};

export type WorkoutLog = {
  id: number;
  title: string;
  focus?: string | null;
  durationSeconds: number;
  calories: number;
  completedExercises: number;
  totalExercises: number;
  exercises: Record<string, unknown>[];
  startedAt?: string | null;
  finishedAt: string;
};

export type WorkoutLogPayload = Omit<WorkoutLog, 'id' | 'finishedAt'>;

export type AppMetric = {
  id: string;
  label: string;
  value: string;
  unit: string;
  delta: string;
};

export type RecommendedWorkout = {
  id: string;
  title: string;
  subtitle: string;
  focus: string;
  minutes: number;
  exercises: number;
  calories: number;
  progress: number;
  accent: Accent;
  imageId: string;
};

export type TodayPlanItem = {
  id: string;
  name: string;
  sets: string;
  load: string;
  rest: string;
  status: string;
};

export type AiSuggestion = {
  id: string;
  title: string;
  body: string;
  confidence: string;
};

export type ProgressWeek = {
  label: string;
  volume: number;
};

export type PersonalRecord = {
  id: string;
  lift: string;
  value: string;
  delta: string;
};

export type ConnectionStatus = {
  id: string;
  name: string;
  status: string;
  detail: string;
};

export type AppData = {
  user: AppUser;
  metrics: AppMetric[];
  recommendedWorkouts: RecommendedWorkout[];
  todayPlan: TodayPlanItem[];
  aiSuggestions: AiSuggestion[];
  progressWeeks: ProgressWeek[];
  personalRecords: PersonalRecord[];
  connections: ConnectionStatus[];
  badges: string[];
  workoutLogs?: WorkoutLog[];
};

export type ExercisesResponse = {
  items: Exercise[];
  total: number;
  bodyParts: string[];
};

export type ExerciseWithMedia = Exercise & {
  media?: ExerciseMedia;
};

export type WorkoutDetail = {
  workout: RecommendedWorkout;
  todayPlan: TodayPlanItem[];
};
