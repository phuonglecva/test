import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, Bot, MessageCircle, Play, Sparkles, Zap } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { WorkoutCard } from '@/components/home';
import { AppText, GlassCard, LogoMark, NeonButton, ProgressRing, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { APP_GREETING } from '@/lib/constants';
import { minTouchTarget, useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii, shadows } from '@/lib/theme';
import { formatDateLabel, getGreetingLabel } from '@/lib/utils';
import { mockAiSuggestions, mockMetrics, mockRecommendedWorkouts, mockTodayPlan, mockUser } from '@/data/mock-app';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const layout = useResponsiveLayout();
  const profileName = useAppStore((state) => state.profileName) || mockUser.name;
  const heroDirection = layout.isCompact || (layout.isLandscape && !layout.isTablet) ? 'column' : 'row';
  const workoutCardWidth = layout.isTablet
    ? Math.min(360, layout.contentWidth * 0.46)
    : Math.min(320, layout.contentWidth * 0.86);
  const fabSize = Math.max(minTouchTarget, layout.isCompact ? 54 : 58);

  return (
    <ResponsiveScreen
      floating={
        <Pressable
          onPress={() => router.push('/train')}
          style={{
            position: 'absolute',
            right: layout.pagePadding,
            bottom: layout.tabBarHeight + layout.tabBarBottom + layout.compactGutter,
            width: fabSize,
            height: fabSize,
            borderRadius: fabSize / 2,
            backgroundColor: colors.neon,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.neon
          }}
        >
          <MessageCircle color={colors.background} size={Math.round(fabSize * 0.42)} />
          <View
            style={{
              position: 'absolute',
              top: -3,
              right: -3,
              width: Math.max(16, fabSize * 0.28),
              aspectRatio: 1,
              borderRadius: 999,
              backgroundColor: colors.orange,
              borderWidth: 2,
              borderColor: colors.background
            }}
          />
        </Pressable>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: layout.gutter }}>
        <LogoMark label="Gym Buddy" />
        <Pressable
          onPress={() => router.push('/profile')}
          hitSlop={8}
          style={{
            width: layout.minTouchTarget,
            height: layout.minTouchTarget,
            borderRadius: radii.sm,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            borderColor: colors.surfaceBorder
          }}
        >
          <Bell color={colors.text} size={18} />
        </Pressable>
      </View>

      <View style={{ marginTop: layout.gutter }}>
        <AppText variant="caption" color="textMuted">
          {formatDateLabel(new Date())} • {getGreetingLabel(new Date().getHours())}, {profileName}
        </AppText>
        <AppText variant="headline" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={3}>
          {APP_GREETING}
        </AppText>
      </View>

      <GlassCard style={{ marginTop: layout.gutter }}>
        <LinearGradient colors={gradients.panel as unknown as [string, string, string]} style={{ padding: layout.cardPadding }}>
          <View style={{ flexDirection: heroDirection, gap: layout.gutter, alignItems: 'center' }}>
            <View style={{ flex: 1, minWidth: 0, width: heroDirection === 'column' ? '100%' : undefined }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter }}>
                <Pill label="LIVE" color={colors.neon} />
                <Pill label="Mock connections" color={colors.orange} />
              </View>

              <AppText variant="title" style={{ marginTop: layout.compactGutter }}>
                Start Workout
              </AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                Kế hoạch hôm nay đã được dựng bằng mock data để app luôn có nội dung khi backend chưa sẵn sàng.
              </AppText>

              <View style={{ marginTop: layout.gutter, alignSelf: layout.isCompact ? 'stretch' : 'flex-start' }}>
                <NeonButton
                  label="Bắt đầu buổi tập"
                  icon={<Play color={colors.background} fill={colors.background} size={16} />}
                  onPress={() => router.push('/train')}
                />
              </View>
            </View>

            <ProgressRing
              size={layout.isCompact ? 92 : layout.isTablet ? 122 : 106}
              strokeWidth={10}
              progress={mockUser.readiness / 100}
              label="Readiness"
              value={`${mockUser.readiness}%`}
              accent={colors.neon}
            />
          </View>
        </LinearGradient>
      </GlassCard>

      <View style={{ flexDirection: 'row', gap: layout.compactGutter, marginTop: layout.compactGutter }}>
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </View>

      <SectionHeader
        title="Recommended Workouts"
        subtitle="Cá nhân hóa từ mock plan cho đến khi AI/backend được nối."
        actionLabel="See all"
        onActionPress={() => router.push('/library')}
        style={{ marginTop: layout.sectionGap }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: layout.gutter, paddingBottom: 2 }}>
        {mockRecommendedWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            id={workout.id}
            title={workout.title}
            subtitle={workout.subtitle}
            minutes={workout.minutes}
            accent={workout.accent}
            calories={workout.calories}
            exercises={workout.exercises}
            imageId={workout.imageId}
            style={{ width: workoutCardWidth }}
          />
        ))}
      </ScrollView>

      <View
        style={{
          marginTop: layout.sectionGap,
          flexDirection: layout.isCompact ? 'column' : 'row',
          gap: layout.gutter
        }}
      >
        <GlassCard style={{ flex: 1 }}>
          <View style={{ padding: layout.cardPadding }}>
            <AppText variant="caption" color="textMuted">
              Daily Focus
            </AppText>
            <AppText variant="title" style={{ marginTop: layout.compactGutter / 2 }}>
              Chest + Triceps
            </AppText>
            <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
              18 sets • 7 exercises • 91% adherence
            </AppText>
          </View>
        </GlassCard>

        <GlassCard style={{ flex: layout.isCompact ? undefined : 0.42 }}>
          <View
            style={{
              padding: layout.cardPadding,
              minHeight: layout.minTouchTarget * 2.4,
              alignItems: layout.isCompact ? 'flex-start' : 'center',
              justifyContent: 'center'
            }}
          >
            <View style={{ borderRadius: 999, backgroundColor: colors.neonSoft, padding: layout.compactGutter }}>
              <Zap color={colors.neon} size={18} />
            </View>
            <AppText variant="metric" style={{ marginTop: layout.compactGutter }}>
              92
            </AppText>
            <AppText variant="caption" color="textMuted">
              Energy
            </AppText>
          </View>
        </GlassCard>
      </View>

      <SectionHeader
        title="AI đang gợi ý"
        subtitle="Mock insight để màn không trống khi chưa nối provider."
        style={{ marginTop: layout.sectionGap }}
      />

      <View style={{ gap: layout.gutter }}>
        {mockAiSuggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </View>

      <SectionHeader title="Plan hôm nay" subtitle="Các bài sẵn sàng trong logger." style={{ marginTop: layout.sectionGap }} />
      <GlassCard>
        <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
          {mockTodayPlan.map((item) => (
            <PlanRow key={item.id} item={item} />
          ))}
        </View>
      </GlassCard>
    </ResponsiveScreen>
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        borderRadius: 999,
        borderWidth: 1,
        borderColor: `${color}55`,
        backgroundColor: `${color}18`,
        paddingHorizontal: layout.compactGutter,
        paddingVertical: Math.max(5, layout.compactGutter * 0.55)
      }}
    >
      <AppText variant="eyebrow" style={{ color }}>
        {label}
      </AppText>
    </View>
  );
}

function MetricCard({ metric }: { metric: (typeof mockMetrics)[number] }) {
  const layout = useResponsiveLayout();

  return (
    <GlassCard style={{ flex: 1, minWidth: 0 }}>
      <View style={{ padding: layout.compactGutter, minHeight: layout.minTouchTarget * 2.35 }}>
        <AppText variant="caption" color="textMuted" numberOfLines={2}>
          {metric.label}
        </AppText>
        <AppText variant="metric" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={1} adjustsFontSizeToFit>
          {metric.value}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {metric.unit}
          </AppText>
          <AppText variant="caption" style={{ color: colors.neon }} numberOfLines={1}>
            {metric.delta}
          </AppText>
        </View>
      </View>
    </GlassCard>
  );
}

function SuggestionCard({ suggestion }: { suggestion: (typeof mockAiSuggestions)[number] }) {
  const layout = useResponsiveLayout();

  return (
    <GlassCard>
      <View style={{ padding: layout.cardPadding }}>
        <View style={{ flexDirection: 'row', gap: layout.compactGutter, alignItems: 'flex-start' }}>
          <View style={{ borderRadius: 999, backgroundColor: colors.neonSoft, padding: layout.compactGutter }}>
            <Sparkles color={colors.neon} size={16} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: layout.compactGutter }}>
              <AppText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={2}>
                {suggestion.title}
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Bot color={colors.orange} size={14} />
                <AppText variant="caption" style={{ color: colors.orange }}>
                  {suggestion.confidence}
                </AppText>
              </View>
            </View>
            <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
              {suggestion.body}
            </AppText>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

function PlanRow({ item }: { item: (typeof mockTodayPlan)[number] }) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: layout.compactGutter,
        borderRadius: radii.md,
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: layout.compactGutter
      }}
    >
      <View style={{ width: Math.max(4, layout.compactGutter * 0.55), alignSelf: 'stretch', borderRadius: 99, backgroundColor: colors.neon }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {item.name}
        </AppText>
        <AppText variant="caption" color="textMuted" style={{ marginTop: layout.compactGutter / 3 }} numberOfLines={1}>
          {item.sets} • {item.load} • rest {item.rest}
        </AppText>
      </View>
      <AppText variant="caption" style={{ color: item.status === 'AI added' ? colors.orange : colors.neon }} numberOfLines={1}>
        {item.status}
      </AppText>
    </View>
  );
}
