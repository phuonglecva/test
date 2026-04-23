import { BlurView } from 'expo-blur';
import type { PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, shadows } from '@/lib/theme';
import { cn } from '@/lib/utils';

type GlassCardProps = PropsWithChildren<{
  className?: string;
  intensity?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function GlassCard({ children, className, intensity = 20, style }: GlassCardProps) {
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
        },
        style
      ]}
      className={cn(className)}
    >
      <BlurView intensity={intensity} tint="dark" style={{ overflow: 'hidden' }}>
        {children}
      </BlurView>
    </View>
  );
}
