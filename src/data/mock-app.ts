export type Accent = 'neon' | 'orange';

export type MockWorkout = {
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

export const mockUser = {
  name: 'Shado',
  title: 'Intermediate lifter',
  gym: 'District 1 Strength Lab',
  plan: 'Hypertrophy focus',
  avatar: 'S',
  readiness: 92,
  streakDays: 18,
  weeklyGoal: 5,
  weeklyDone: 3
} as const;

export const mockMetrics = [
  {
    id: 'volume',
    label: 'Volume hôm nay',
    value: '8.4k',
    unit: 'kg',
    delta: '+12%'
  },
  {
    id: 'calories',
    label: 'Calories',
    value: '642',
    unit: 'kcal',
    delta: '+80'
  },
  {
    id: 'streak',
    label: 'Streak',
    value: '18',
    unit: 'days',
    delta: 'Hot'
  }
] as const;

export const mockRecommendedWorkouts: MockWorkout[] = [
  {
    id: 'push-power',
    title: 'Push Power',
    subtitle: 'Ngực, vai, tay sau với nhịp độ chắc và volume cao.',
    focus: 'Upper push',
    minutes: 52,
    exercises: 7,
    calories: 420,
    progress: 0.74,
    accent: 'neon',
    imageId: '0025'
  },
  {
    id: 'pull-hypertrophy',
    title: 'Pull Hypertrophy',
    subtitle: 'Tập trung xô, rear delts và độ dày lưng giữa.',
    focus: 'Back width',
    minutes: 58,
    exercises: 8,
    calories: 455,
    progress: 0.62,
    accent: 'orange',
    imageId: '0017'
  },
  {
    id: 'legs-complete',
    title: 'Leg Day Complete',
    subtitle: 'Squat pattern, hinge, unilateral work và finisher đùi.',
    focus: 'Lower body',
    minutes: 66,
    exercises: 8,
    calories: 520,
    progress: 0.48,
    accent: 'neon',
    imageId: '0020'
  },
  {
    id: 'full-body-fast',
    title: 'Full Body Fast',
    subtitle: 'Một buổi gọn cho ngày bận, đủ push, pull và core.',
    focus: 'Full body',
    minutes: 38,
    exercises: 6,
    calories: 335,
    progress: 0.35,
    accent: 'orange',
    imageId: '0003'
  }
];

export const mockTodayPlan = [
  {
    id: 'bench',
    name: 'Incline dumbbell press',
    sets: '4 x 8-10',
    load: '26 kg',
    rest: '90s',
    status: 'Ready'
  },
  {
    id: 'row',
    name: 'Chest-supported row',
    sets: '4 x 10',
    load: '42 kg',
    rest: '75s',
    status: 'AI added'
  },
  {
    id: 'raise',
    name: 'Cable lateral raise',
    sets: '3 x 14',
    load: '8 kg',
    rest: '45s',
    status: 'Light'
  }
] as const;

export const mockAiSuggestions = [
  {
    id: 'back-volume',
    title: 'Bạn đang thiếu volume ở lưng giữa',
    body: 'Gợi ý thêm 2 set chest-supported row và 1 finisher face pull để cân bằng upper back.',
    confidence: '92%'
  },
  {
    id: 'recovery',
    title: 'Recovery đủ tốt để tăng tải nhẹ',
    body: 'Nếu set cuối vẫn còn 2 reps dự phòng, tăng 2-2.5 kg ở bài compound chính.',
    confidence: '87%'
  }
] as const;

export const mockProgressWeeks = [
  { label: 'T2', volume: 6.2 },
  { label: 'T3', volume: 7.4 },
  { label: 'T4', volume: 5.8 },
  { label: 'T5', volume: 8.4 },
  { label: 'T6', volume: 7.1 },
  { label: 'T7', volume: 9.2 },
  { label: 'CN', volume: 4.6 }
] as const;

export const mockPersonalRecords = [
  { id: 'bench-pr', lift: 'Bench press', value: '82.5 kg', delta: '+2.5 kg' },
  { id: 'squat-pr', lift: 'Back squat', value: '112.5 kg', delta: '+5 kg' },
  { id: 'deadlift-pr', lift: 'Deadlift', value: '145 kg', delta: '+7.5 kg' }
] as const;

export const mockConnections = [
  {
    id: 'supabase',
    name: 'Cloud profile',
    status: 'Mock data',
    detail: 'Supabase chưa có key nên đang dùng profile local.'
  },
  {
    id: 'wearable',
    name: 'Wearable sync',
    status: 'Mock HRV',
    detail: 'Chưa kết nối đồng hồ, readiness được mô phỏng.'
  },
  {
    id: 'ai',
    name: 'AI coach',
    status: 'Mock insights',
    detail: 'Chưa gọi provider thật, app dùng gợi ý dựng sẵn.'
  }
] as const;

export const mockBadges = ['18-day streak', 'Push specialist', 'Form checker beta'] as const;
