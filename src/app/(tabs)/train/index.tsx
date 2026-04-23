import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CheckCircle2, Clock3, Dumbbell, Play, RotateCcw, Timer } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText, GlassCard, LogoMark, NeonButton, ProgressRing, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { mockRecommendedWorkouts, mockTodayPlan } from '@/data/mock-app';
import { QUICK_PROMPTS } from '@/lib/constants';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii } from '@/lib/theme';

export default function TrainScreen() {
  const layout = useResponsiveLayout();
  const workout = mockRecommendedWorkouts[0];
  const heroDirection = layout.isCompact || (layout.isLandscape && !layout.isTablet) ? 'column' : 'row';

  return (
    <ResponsiveScreen>
      <LogoMark label="Workout Logger" />

      <GlassCard style={{ marginTop: layout.sectionGap }}>
        <LinearGradient colors={gradients.panel as unknown as [string, string, string]} style={{ padding: layout.cardPadding }}>
          <View style={{ flexDirection: heroDirection, alignItems: 'center', gap: layout.gutter }}>
            <View style={{ flex: 1, width: heroDirection === 'column' ? '100%' : undefined, minWidth: 0 }}>
              <AppText variant="eyebrow" style={{ color: colors.neon }}>
                Mock session ready
              </AppText>
              <AppText variant="headline" style={{ marginTop: layout.compactGutter }}>
                {workout.title}
              </AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                {workout.subtitle}
              </AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter, marginTop: layout.gutter }}>
                <InfoPill icon={<Clock3 color={colors.neon} size={14} />} label={`${workout.minutes} min`} />
                <InfoPill icon={<Dumbbell color={colors.orange} size={14} />} label={`${workout.exercises} bài`} />
                <InfoPill icon={<Timer color={colors.neon} size={14} />} label="Rest timer on" />
              </View>
            </View>
            <ProgressRing
              size={layout.isCompact ? 94 : layout.isTablet ? 122 : 108}
              strokeWidth={10}
              progress={workout.progress}
              label="Plan"
              value={`${Math.round(workout.progress * 100)}%`}
              accent={colors.neon}
            />
          </View>

          <View style={{ marginTop: layout.gutter }}>
            <NeonButton
              size="lg"
              label="Start logger"
              icon={<Play color={colors.background} fill={colors.background} size={17} />}
              onPress={() => router.push(`/workout/${workout.id}`)}
            />
          </View>
        </LinearGradient>
      </GlassCard>

      <SectionHeader title="Bài trong buổi hôm nay" subtitle="Mock data thay cho workout API." style={{ marginTop: layout.sectionGap }} />
      <View style={{ gap: layout.gutter }}>
        {mockTodayPlan.map((item, index) => (
          <ExerciseSetCard key={item.id} item={item} index={index + 1} />
        ))}
      </View>

      <SectionHeader
        title="Quick AI prompts"
        subtitle="Chưa gọi AI thật, dùng prompt mẫu để test flow."
        style={{ marginTop: layout.sectionGap }}
      />
      <View style={{ gap: layout.compactGutter }}>
        {QUICK_PROMPTS.map((prompt) => (
          <GlassCard key={prompt}>
            <View style={{ padding: layout.cardPadding, flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
              <View
                style={{
                  width: layout.smallIconSize,
                  aspectRatio: 1,
                  borderRadius: radii.sm,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.orangeSoft
                }}
              >
                <RotateCcw color={colors.orange} size={16} />
              </View>
              <AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={2}>
                {prompt}
              </AppText>
            </View>
          </GlassCard>
        ))}
      </View>
    </ResponsiveScreen>
  );
}

function InfoPill({ icon, label }: { icon: ReactNode; label: string }) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        minHeight: layout.minTouchTarget,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        paddingHorizontal: layout.compactGutter,
        paddingVertical: Math.max(6, layout.compactGutter * 0.55),
        flexDirection: 'row',
        alignItems: 'center',
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

function ExerciseSetCard({ item, index }: { item: (typeof mockTodayPlan)[number]; index: number }) {
  const layout = useResponsiveLayout();

  return (
    <GlassCard>
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
            {index}
          </AppText>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {item.name}
          </AppText>
          <AppText variant="caption" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={1}>
            {item.sets} • {item.load} • rest {item.rest}
          </AppText>
        </View>
        <CheckCircle2 color={item.status === 'AI added' ? colors.orange : colors.neon} size={22} />
      </View>
    </GlassCard>
  );
}
