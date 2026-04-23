export type HomeWorkoutCard = {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  color: 'neon' | 'orange';
  progress: number;
};

export type AppStats = {
  dailyVolume: number;
  calories: number;
  streakDays: number;
};
