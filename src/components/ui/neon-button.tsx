import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { colors, gradients, radii, shadows, typography } from '@/lib/theme';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type NeonButtonProps = PressableProps & {
  label: string;
  icon?: ReactNode;
  className?: string;
};

export function NeonButton({ label, icon, className, onPress, ...props }: NeonButtonProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 220 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0.96, 1], [0.92, 1])
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        {...props}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 16, stiffness: 260 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
        onPress={async (event) => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress?.(event);
        }}
        className={cn(className)}
      >
        <LinearGradient
          colors={gradients.neon as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              borderRadius: radii.xl,
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: 'rgba(0, 255, 133, 0.45)',
              ...shadows.neon
            }
          ]}
        >
          <View className="flex-row items-center justify-center gap-3">
            {icon}
            <Text
              style={{
                color: colors.background,
                fontFamily: typography.subtitle,
                fontSize: 16,
                letterSpacing: 0.2
              }}
            >
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
