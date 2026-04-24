import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock3, Dumbbell, Flame, Play } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, GlassCard, NeonButton, ProgressRing, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { mockRecommendedWorkouts, mockTodayPlan } from '@/data/mock-app';
import { useI18n } from '@/lib/i18n';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii } from '@/lib/theme';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const workout = mockRecommendedWorkouts.find((item) => item.id === id) ?? mockRecommendedWorkouts[0];
  const heroDirection = layout.isCompact || (layout.isLandscape && !layout.isTablet) ? 'column' : 'row';

  return (
    <ResponsiveScreen bottomInset="none">
      <BackButton />

      <GlassCard style={{ marginTop: layout.gutter }}>
        <LinearGradient colors={gradients.panel as unknown as [string, string, string]} style={{ padding: layout.cardPadding }}>
          <View style={{ flexDirection: heroDirection, alignItems: 'center', gap: layout.gutter }}>
            <View style={{ flex: 1, minWidth: 0, width: heroDirection === 'column' ? '100%' : undefined }}>
              <AppText variant="eyebrow" style={{ color: colors.neon }}>
                {t('workoutCard.mockPlan')}
              </AppText>
              <AppText variant="headline" style={{ marginTop: layout.compactGutter }}>
                {workout.title}
              </AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                {workout.subtitle}
              </AppText>
            </View>
            <ProgressRing
              size={layout.isTablet ? 116 : 94}
              strokeWidth={9}
              progress={workout.progress}
              label={t('common.ready')}
              value={`${Math.round(workout.progress * 100)}%`}
              accent={workout.accent === 'neon' ? colors.neon : colors.orange}
            />
          </View>

          <View style={{ flexDirection: layout.isCompact ? 'column' : 'row', gap: layout.compactGutter, marginTop: layout.gutter }}>
            <WorkoutStat icon={<Clock3 color={colors.neon} size={16} />} label={`${workout.minutes} ${t('common.minutes')}`} />
            <WorkoutStat icon={<Dumbbell color={colors.orange} size={16} />} label={`${workout.exercises} ${t('common.exercises')}`} />
            <WorkoutStat icon={<Flame color={colors.neon} size={16} />} label={`${workout.calories} kcal`} />
          </View>

          <View style={{ marginTop: layout.gutter }}>
            <NeonButton
              label={t('train.generate')}
              icon={<Play color={colors.background} fill={colors.background} size={16} />}
              onPress={() => router.push('/train')}
            />
          </View>
        </LinearGradient>
      </GlassCard>

      <SectionHeader title={t('train.exercisesTitle')} subtitle={t('home.todayPlanSubtitle')} style={{ marginTop: layout.sectionGap }} />
      <View style={{ gap: layout.gutter }}>
        {mockTodayPlan.map((item, index) => (
          <GlassCard key={item.id}>
            <View style={{ padding: layout.cardPadding, flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
              <View
                style={{
                  width: layout.smallIconSize,
                  aspectRatio: 1,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.neonSoft
                }}
              >
                <AppText variant="bodyStrong" style={{ color: colors.neon }}>
                  {index + 1}
                </AppText>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="bodyStrong" numberOfLines={1}>
                  {item.name}
                </AppText>
                <AppText variant="caption" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={1}>
                  {item.sets} • {item.load} • {t('common.rest')} {item.rest}
                </AppText>
              </View>
              <CheckCircle2 color={item.status === 'AI added' ? colors.orange : colors.neon} size={21} />
            </View>
          </GlassCard>
        ))}
      </View>
    </ResponsiveScreen>
  );
}

function BackButton() {
  const layout = useResponsiveLayout();

  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={8}
      style={{
        width: layout.minTouchTarget,
        aspectRatio: 1,
        borderRadius: radii.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: colors.surfaceBorder
      }}
    >
      <ArrowLeft color={colors.text} size={19} />
    </Pressable>
  );
}

function WorkoutStat({ icon, label }: { icon: ReactNode; label: string }) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: layout.minTouchTarget,
        borderRadius: radii.md,
        backgroundColor: 'rgba(255,255,255,0.06)',
        padding: layout.compactGutter,
        alignItems: 'center',
        justifyContent: 'center',
        gap: layout.compactGutter / 2
      }}
    >
      {icon}
      <AppText variant="caption" numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}
