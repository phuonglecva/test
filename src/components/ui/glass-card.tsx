import { BlurView } from 'expo-blur';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { colors, radii, shadows } from '@/lib/theme';
import { cn } from '@/lib/utils';

type GlassCardProps = PropsWithChildren<{
  className?: string;
  intensity?: number;
}>;

export function GlassCard({ children, className, intensity = 26 }: GlassCardProps) {
  return (
    <View
      style={[
        {
          borderRadius: radii.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.surfaceBorder,
          overflow: 'hidden',
          ...shadows.glass
        }
      ]}
      className={cn(className)}
    >
      <BlurView intensity={intensity} tint="dark" style={{ flex: 1 }}>
        {children}
      </BlurView>
    </View>
  );
}
