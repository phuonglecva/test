import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '@/lib/theme';
import { AppText } from './app-text';

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress: number;
  label: string;
  value: string;
  accent?: string;
};

export function ProgressRing({
  size = 122,
  strokeWidth = 12,
  progress,
  label,
  value,
  accent = colors.neon
}: ProgressRingProps) {
  const safeProgress = Math.max(0, Math.min(progress, 1));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = useMemo(() => circumference * (1 - safeProgress), [circumference, safeProgress]);

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          stroke="rgba(255,255,255,0.08)"
          fill="transparent"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <Circle
          stroke={accent}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="absolute items-center">
        <AppText style={{ color: colors.text, fontFamily: typography.title, fontSize: size > 100 ? 28 : 22 }}>
          {value}
        </AppText>
        <AppText variant="caption" style={{ color: colors.textMuted, fontFamily: typography.body }}>
          {label}
        </AppText>
      </View>
    </View>
  );
}
