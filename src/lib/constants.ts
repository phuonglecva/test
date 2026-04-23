export const APP_NAME = 'Gym Buddy';
export const APP_TAGLINE = 'Người bạn tập gym thông minh nhất';
export const APP_GREETING = 'Hôm nay mình tập gì?';

export const ONBOARDING_SLIDES = [
  {
    id: 'hero',
    title: 'Chào mừng đến Gym Buddy',
    subtitle: 'Một người bạn tập luôn theo sát mục tiêu, lịch tập và tiến độ của bạn.',
    accent: 'AI trainer neon'
  },
  {
    id: 'coach',
    title: 'AI Coach luôn sẵn sàng',
    subtitle: 'Lập kế hoạch, gợi ý set/reps và tối ưu buổi tập theo mục tiêu.',
    accent: 'Real-time guidance'
  },
  {
    id: 'progress',
    title: 'Tracking tiến bộ cực rõ',
    subtitle: 'Volume, PRs, body weight và streak đều được hiển thị dễ hiểu.',
    accent: 'Performance insights'
  },
  {
    id: 'buddy',
    title: 'Form Checker & Find Buddy',
    subtitle: 'Sửa form bằng AI và kết nối với người tập gần bạn khi backend sẵn sàng.',
    accent: 'Train smarter together'
  }
] as const;

export const QUICK_PROMPTS = [
  'Tạo kế hoạch ngực 60 phút',
  'Sửa form squat',
  'Buổi kéo lưng cho người mới',
  'Tôi nên tăng bao nhiêu kg?'
] as const;

export const HOME_METRICS = [
  { label: 'Daily Volume', value: '8.4k', delta: '+12%' },
  { label: 'Calories', value: '642', delta: '+80' },
  { label: 'Streak', value: '18d', delta: 'Hot' }
] as const;

export const RECOMMENDED_WORKOUT_IDS = ['push-power', 'pull-hypertrophy', 'legs-complete', 'full-body-fast'] as const;
