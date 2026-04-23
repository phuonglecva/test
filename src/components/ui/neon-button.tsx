import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { colors, gradients, radii, shadows, typography } from '@/lib/theme';
import { useResponsiveLayout } from '@/lib/responsive';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { AppText } from './app-text';

type NeonButtonProps = PressableProps & {
  label: string;
  icon?: ReactNode;
  className?: string;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function NeonButton({
  label,
  icon,
  className,
  onPress,
  size = 'md',
  style,
  textStyle,
  ...props
}: NeonButtonProps) {
  const layout = useResponsiveLayout();
  const scale = useSharedValue(1);
  const verticalPadding = size === 'lg' ? layout.compactGutter + 6 : layout.compactGutter + 2;
  const horizontalPadding = size === 'lg' ? layout.cardPadding + 2 : layout.cardPadding;

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
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
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
              minHeight: layout.minTouchTarget,
              paddingVertical: verticalPadding,
              paddingHorizontal: horizontalPadding,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.24)',
              ...shadows.neon
            },
            style
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: layout.compactGutter }}>
            {icon}
            <AppText
              variant="bodyStrong"
              style={[
                {
                  color: colors.background,
                  fontFamily: typography.subtitle,
                  letterSpacing: 0.2
                },
                textStyle
              ]}
              numberOfLines={1}
            >
              {label}
            </AppText>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
