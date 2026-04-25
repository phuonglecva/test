import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, Bot, Dumbbell, MessageCircle, Play, Sparkles, Zap } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { WorkoutCard } from '@/components/home';
import { AppText, EmptyState, GlassCard, LogoMark, NeonButton, ProgressRing, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { useI18n } from '@/lib/i18n';
import { minTouchTarget, useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii, shadows } from '@/lib/theme';
import { formatDateLabel, getGreetingLabel } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useAppData } from '@/hooks/useApiData';
import { config } from '@/config';
import type { AiSuggestion, AppMetric, TodayPlanItem } from '@/types/api';

export default function HomeScreen() {
  const layout = useResponsiveLayout();
  const { language, t } = useI18n();
  const { data } = useAppData();
  const user = data?.user;
  const metrics = data?.metrics ?? [];
  const workouts = data?.recommendedWorkouts ?? [];
  const suggestions = data?.aiSuggestions ?? [];
  const todayPlan = data?.todayPlan ?? [];
  const readiness = user?.readiness ?? 0;
  const profileName = useAppStore((state) => state.profileName) || user?.name || config.defaultGreetingName;
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
          {formatDateLabel(new Date(), language)} • {getGreetingLabel(new Date().getHours(), language)}, {profileName}
        </AppText>
        <AppText variant="headline" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={3}>
          {t('home.greetingQuestion')}
        </AppText>
      </View>

      <GlassCard style={{ marginTop: layout.gutter }}>
        <LinearGradient colors={gradients.panel as unknown as [string, string, string]} style={{ padding: layout.cardPadding }}>
          <View style={{ flexDirection: heroDirection, gap: layout.gutter, alignItems: 'center' }}>
            <View style={{ flex: 1, minWidth: 0, width: heroDirection === 'column' ? '100%' : undefined }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter }}>
                <Pill label={t('home.hero.live')} color={colors.neon} />
                <Pill label={t('home.hero.backendStatus')} color={colors.orange} />
              </View>

              <AppText variant="title" style={{ marginTop: layout.compactGutter }}>
                {t('home.hero.title')}
              </AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                {t('home.hero.body')}
              </AppText>

              <View style={{ marginTop: layout.gutter, alignSelf: layout.isCompact ? 'stretch' : 'flex-start' }}>
                <NeonButton
                  label={t('home.hero.button')}
                  icon={<Play color={colors.background} fill={colors.background} size={16} />}
                  onPress={() => router.push('/train')}
                />
              </View>
            </View>

            <ProgressRing
              size={layout.isCompact ? 92 : layout.isTablet ? 122 : 106}
              strokeWidth={10}
              progress={readiness / 100}
              label={t('home.readiness')}
              value={`${readiness}%`}
              accent={colors.neon}
            />
          </View>
        </LinearGradient>
      </GlassCard>

      <View style={{ flexDirection: 'row', gap: layout.compactGutter, marginTop: layout.compactGutter }}>
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </View>

      <SectionHeader
        title={t('home.recommended')}
        subtitle={t('home.recommendedSubtitle')}
        actionLabel={t('common.seeAll')}
        onActionPress={() => router.push('/library')}
        style={{ marginTop: layout.sectionGap }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: layout.gutter, paddingBottom: 2 }}>
        {workouts.length ? workouts.map((workout) => (
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
        )) : (
          <EmptyState icon={<Dumbbell color={colors.neon} size={22} />} title="Chưa có workout" body="Backend chưa trả workout gợi ý." />
        )}
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
              {t('home.dailyFocus')}
            </AppText>
            <AppText variant="title" style={{ marginTop: layout.compactGutter / 2 }}>
              {t('home.dailyFocusTitle')}
            </AppText>
            <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
              {t('home.dailyFocusMeta')}
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
              {t('home.energy')}
            </AppText>
          </View>
        </GlassCard>
      </View>

      <SectionHeader
        title={t('home.aiSuggestions')}
        subtitle={t('home.aiSuggestionsSubtitle')}
        style={{ marginTop: layout.sectionGap }}
      />

      <View style={{ gap: layout.gutter }}>
        {suggestions.length ? suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        )) : (
          <EmptyState icon={<Sparkles color={colors.neon} size={22} />} title="Chưa có insight" body="AI suggestions sẽ hiện khi backend có dữ liệu." />
        )}
      </View>

      <SectionHeader
        title={t('home.todayPlan')}
        subtitle={t('home.todayPlanSubtitle')}
        style={{ marginTop: layout.sectionGap }}
      />
      <GlassCard>
        <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
          {todayPlan.length ? todayPlan.map((item) => (
            <PlanRow key={item.id} item={item} />
          )) : (
            <EmptyState icon={<Dumbbell color={colors.neon} size={22} />} title="Kế hoạch trống" body="Tạo workout mới từ tab Train để bắt đầu." />
          )}
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

function MetricCard({ metric }: { metric: AppMetric }) {
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

function SuggestionCard({ suggestion }: { suggestion: AiSuggestion }) {
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

function PlanRow({ item }: { item: TodayPlanItem }) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();

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
          {item.sets} • {item.load} • {t('common.rest')} {item.rest}
        </AppText>
      </View>
      <AppText variant="caption" style={{ color: item.status === 'AI added' ? colors.orange : colors.neon }} numberOfLines={1}>
        {item.status}
      </AppText>
    </View>
  );
}
