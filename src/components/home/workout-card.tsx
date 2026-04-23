import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Clock3, Flame, ListChecks } from 'lucide-react-native';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { AppText } from '@/components/ui/app-text';
import { colors } from '@/lib/theme';
import { getExerciseImageSource } from '@/lib/exercise-media';
import { useResponsiveLayout } from '@/lib/responsive';

type WorkoutCardProps = {
  id?: string;
  title: string;
  subtitle: string;
  minutes: number;
  accent: 'neon' | 'orange';
  calories?: number;
  exercises?: number;
  imageId?: string;
  style?: StyleProp<ViewStyle>;
};

export function WorkoutCard({
  id,
  title,
  subtitle,
  minutes,
  accent,
  calories,
  exercises,
  imageId,
  style
}: WorkoutCardProps) {
  const layout = useResponsiveLayout();
  const accentColor = accent === 'neon' ? colors.neon : colors.orange;
  const accentColors =
    accent === 'neon'
      ? (['rgba(0,255,133,0.24)', 'rgba(0,255,133,0.06)'] as const)
      : (['rgba(255,149,0,0.24)', 'rgba(255,149,0,0.06)'] as const);
  const imageSource = imageId ? getExerciseImageSource(imageId) : undefined;

  return (
    <Pressable onPress={() => id && router.push(`/workout/${id}`)} style={style}>
      <GlassCard style={{ width: '100%' }}>
        <LinearGradient colors={accentColors as unknown as [string, string]} style={{ padding: layout.cardPadding }}>
          <View style={{ flexDirection: 'row', gap: layout.gutter, alignItems: 'flex-start' }}>
            <View
              style={{
                width: layout.isTablet ? '26%' : '32%',
                maxWidth: 112,
                minWidth: 76,
                aspectRatio: 1,
                borderRadius: 24,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.06)'
              }}
            >
              {imageSource ? (
                <Image source={imageSource} contentFit="cover" style={{ width: '100%', height: '100%' }} />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Flame color={accentColor} size={28} />
                </View>
              )}
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <View
                  style={{
                    borderRadius: 999,
                    backgroundColor: 'rgba(0,0,0,0.24)',
                    paddingHorizontal: layout.compactGutter,
                    paddingVertical: Math.max(5, Math.round(layout.compactGutter * 0.55)),
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Math.max(5, layout.compactGutter * 0.5)
                  }}
                >
                  <Clock3 color={accentColor} size={13} />
                  <AppText variant="caption" style={{ color: colors.text }}>
                    {minutes} min
                  </AppText>
                </View>
                {exercises ? (
                  <View
                    style={{
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      paddingHorizontal: layout.compactGutter,
                      paddingVertical: Math.max(5, Math.round(layout.compactGutter * 0.55)),
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Math.max(5, layout.compactGutter * 0.5)
                    }}
                  >
                    <ListChecks color={colors.textMuted} size={13} />
                    <AppText variant="caption" color="textMuted">
                      {exercises} bài
                    </AppText>
                  </View>
                ) : null}
              </View>

              <AppText variant="title" numberOfLines={2} style={{ marginTop: layout.compactGutter }}>
                {title}
              </AppText>
            </View>
          </View>

          <AppText variant="body" color="textMuted" numberOfLines={3} style={{ marginTop: layout.compactGutter }}>
            {subtitle}
          </AppText>

          <View
            style={{
              marginTop: layout.gutter,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: layout.compactGutter
            }}
          >
            <View>
              <AppText variant="caption" color="textMuted">
                Burn estimate
              </AppText>
              <AppText variant="bodyStrong" style={{ color: accentColor, marginTop: layout.compactGutter / 4 }}>
                {calories ? `${calories} kcal` : 'Mock plan'}
              </AppText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppText variant="bodyStrong" style={{ color: accentColor }}>
                Start
              </AppText>
              <ArrowRight color={accentColor} size={15} />
            </View>
          </View>
        </LinearGradient>
      </GlassCard>
    </Pressable>
  );
}
