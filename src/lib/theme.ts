export const colors = {
  background: '#080A09',
  surface: 'rgba(19, 23, 21, 0.92)',
  surfaceStrong: 'rgba(24, 29, 26, 0.98)',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  neon: '#00FF85',
  neonSoft: 'rgba(0, 255, 133, 0.14)',
  neonGlow: 'rgba(0, 255, 133, 0.35)',
  orange: '#FF9500',
  orangeSoft: 'rgba(255, 149, 0, 0.14)',
  text: '#F5F5F5',
  textMuted: '#A1A1A1',
  textSubtle: '#6B6B6B',
  danger: '#FF4D4D',
  success: '#00FF85'
} as const;

export const gradients = {
  hero: ['#070908', '#111A15', '#070908'],
  neon: ['#00FF85', '#7BFFC1'],
  orange: ['rgba(255,149,0,0.24)', 'rgba(255,149,0,0.04)'],
  card: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.03)'],
  panel: ['rgba(0,255,133,0.13)', 'rgba(255,149,0,0.08)', 'rgba(255,255,255,0.03)']
} as const;

export const radii = {
  xs: 12,
  sm: 16,
  md: 22,
  lg: 28,
  xl: 36
} as const;

export const spacing = {
  page: 20,
  section: 18,
  card: 16
} as const;

export const shadows = {
  neon: {
    shadowColor: colors.neon,
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18
  },
  glass: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 20
  },
  orange: {
    shadowColor: colors.orange,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16
  }
} as const;

export const typography = {
  title: 'Inter_700Bold',
  subtitle: 'Inter_600SemiBold',
  body: 'Inter_400Regular',
  mono: 'Inter_500Medium'
} as const;
