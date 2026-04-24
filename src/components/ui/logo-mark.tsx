import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Sparkles } from 'lucide-react-native';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useI18n } from '@/lib/i18n';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, radii, shadows } from '@/lib/theme';
import { AppText } from './app-text';

type LogoMarkProps = {
  label?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function LogoMark({ label, size, style }: LogoMarkProps) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const markSize = size ?? layout.iconSize;
  const sparkOffset = Math.max(5, markSize * 0.13);

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter, minWidth: 0 }, style]}>
      <LinearGradient
        colors={['#00FF85', '#8EFFC4'] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: markSize,
          height: markSize,
          borderRadius: Math.min(radii.md, markSize / 2.4),
          alignItems: 'center',
          justifyContent: 'center',
          ...shadows.neon
        }}
      >
        <Dumbbell color={colors.background} size={Math.round(markSize * 0.48)} strokeWidth={2.8} />
        <View style={{ position: 'absolute', right: sparkOffset, top: sparkOffset }}>
          <Sparkles color={colors.background} size={Math.round(markSize * 0.22)} strokeWidth={3} />
        </View>
      </LinearGradient>

      {label ? (
        <View style={{ flexShrink: 1, minWidth: 0 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {label}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {t('common.aiWorkoutCompanion')}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
