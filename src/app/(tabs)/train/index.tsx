import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Lightbulb, Timer, Dumbbell, ShieldCheck, Play, Activity, RefreshCw } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { AppText, GlassCard, LogoMark, NeonButton, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { generateWorkoutPlan, hasOpenRouterConfig, type WorkoutPlan, type WorkoutTip } from '@/features/ai-chat';
import { useI18n } from '@/lib/i18n';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';

type TrainTab = 'plan' | 'tips';

const DEFAULT_GOAL = 'Build a 50 minute upper body workout for muscle gain with simple coaching tips.';

export default function TrainScreen() {
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);
  const currentWorkoutPlan = useAppStore((state) => state.currentWorkoutPlan);
  const currentWorkoutSession = useAppStore((state) => state.currentWorkoutSession);
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TrainTab>('plan');
  const [lastSource, setLastSource] = useState<'openrouter' | 'fallback'>(hasOpenRouterConfig() ? 'openrouter' : 'fallback');
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  async function handleGeneratePlan() {
    setIsLoading(true);
    try {
      const result = await generateWorkoutPlan(goal.trim() || DEFAULT_GOAL);
      setPlan(result.plan);
      setLastSource(result.source);
      setActiveTab('plan');
      setCurrentWorkout(result.plan, {
        currentExerciseIndex: 0,
        completedExerciseIndexes: [],
        startedAt: Date.now()
      });
      router.push('/workout/process');
    } finally {
      setIsLoading(false);
    }
  }

  function handleResumeProcess() {
    if (currentWorkoutPlan && currentWorkoutSession) {
      router.push('/workout/process');
    }
  }

  const tabDirection = layout.isCompact || (layout.isLandscape && !layout.isTablet) ? 'column' : 'row';

  return (
    <ResponsiveScreen keyboardAware>
      <LogoMark label="AI Training Planner" />

      <GlassCard style={{ marginTop: layout.sectionGap }}>
        <LinearGradient colors={gradients.panel as unknown as [string, string, string]} style={{ padding: layout.cardPadding }}>
          <AppText variant="eyebrow" style={{ color: colors.neon }}>
            {lastSource === 'openrouter' ? t('train.openrouterEnabled') : t('train.fallbackReady')}
          </AppText>
          <AppText variant="headline" style={{ marginTop: layout.compactGutter }}>
            {t('train.title')}
          </AppText>
          <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
            {t('train.subtitle')}
          </AppText>

          <View style={{ marginTop: layout.gutter, gap: layout.compactGutter }}>
            <GoalInput value={goal} onChangeText={setGoal} />

            <NeonButton
              size="lg"
              label={isLoading ? t('train.generating') : t('train.generate')}
              icon={
                isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Play color={colors.background} fill={colors.background} size={18} />
                )
              }
              onPress={handleGeneratePlan}
              disabled={isLoading}
              style={isLoading ? { opacity: 0.72 } : undefined}
            />

            {currentWorkoutPlan && currentWorkoutSession ? (
              <SecondaryAction
                label={t('train.resume')}
                icon={<Activity color={colors.neon} size={16} />}
                onPress={handleResumeProcess}
              />
            ) : null}
          </View>
        </LinearGradient>
      </GlassCard>

      <SectionHeader
        title={t('train.planView')}
        subtitle={plan ? `${plan.focus} • ${plan.durationMinutes} ${t('common.minutes')} • ${plan.difficulty}` : t('train.planViewSubtitle')}
        style={{ marginTop: layout.sectionGap }}
      />

      <View style={{ flexDirection: tabDirection, gap: layout.compactGutter }}>
        <TrainTabButton
          label={t('train.plan')}
          active={activeTab === 'plan'}
          icon={<Dumbbell color={activeTab === 'plan' ? colors.background : colors.neon} size={16} />}
          onPress={() => setActiveTab('plan')}
        />
        <TrainTabButton
          label={t('train.tips')}
          active={activeTab === 'tips'}
          icon={<Lightbulb color={activeTab === 'tips' ? colors.background : colors.orange} size={16} />}
          onPress={() => setActiveTab('tips')}
          accent="orange"
        />
      </View>

      {plan ? activeTab === 'plan' ? <PlanTab plan={plan} /> : <TipsTab plan={plan} /> : <EmptyState isConfigured={hasOpenRouterConfig()} />}
    </ResponsiveScreen>
  );
}

function GoalInput({
  value,
  onChangeText
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();

  return (
    <View
      style={{
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: layout.cardPadding,
        paddingVertical: layout.compactGutter
      }}
    >
      <AppText variant="eyebrow" style={{ color: colors.orange }}>
        {t('train.goal')}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('train.goalPlaceholder')}
        placeholderTextColor={colors.textSubtle}
        multiline
        style={{
          color: colors.text,
          minHeight: 88,
          marginTop: layout.compactGutter,
          textAlignVertical: 'top'
        }}
      />
    </View>
  );
}

function TrainTabButton({
  label,
  active,
  icon,
  onPress,
  accent = 'neon'
}: {
  label: string;
  active: boolean;
  icon: ReactNode;
  onPress: () => void;
  accent?: 'neon' | 'orange';
}) {
  const layout = useResponsiveLayout();
  const activeBackground = accent === 'orange' ? colors.orange : colors.neon;

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: layout.minTouchTarget,
        borderRadius: radii.xl,
        borderWidth: 1,
        borderColor: active ? 'transparent' : colors.surfaceBorder,
        backgroundColor: active ? activeBackground : 'rgba(255,255,255,0.04)',
        paddingHorizontal: layout.cardPadding,
        paddingVertical: layout.compactGutter + 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: layout.compactGutter
      }}
    >
      {icon}
      <AppText variant="bodyStrong" style={{ color: active ? colors.background : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function PlanTab({ plan }: { plan: WorkoutPlan }) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();

  return (
    <View style={{ marginTop: layout.gutter, gap: layout.gutter }}>
      <GlassCard>
        <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
          <AppText variant="eyebrow" style={{ color: colors.neon }}>
            {t('train.sessionBrief')}
          </AppText>
          <AppText variant="title">{plan.title}</AppText>
          <AppText variant="body" color="textMuted">
            {plan.summary}
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter }}>
            <InfoPill icon={<Timer color={colors.neon} size={14} />} label={`${plan.durationMinutes} ${t('common.minutes')}`} />
            <InfoPill icon={<Dumbbell color={colors.orange} size={14} />} label={`${plan.exercises.length} ${t('common.exercises')}`} />
            <InfoPill icon={<ShieldCheck color={colors.neon} size={14} />} label={plan.difficulty} />
          </View>
          {plan.note ? (
            <AppText variant="caption" color="textMuted">
              {plan.note}
            </AppText>
          ) : null}
        </View>
      </GlassCard>

      <SectionHeader title={t('train.warmup')} subtitle={t('train.warmupSubtitle')} />
      <View style={{ gap: layout.compactGutter }}>
        {plan.warmup.map((item) => (
          <SimpleLineCard key={item} text={item} accent="neon" />
        ))}
      </View>

      <SectionHeader title={t('train.exercisesTitle')} subtitle={t('train.exercisesSubtitle')} style={{ marginTop: layout.compactGutter }} />
      <View style={{ gap: layout.gutter }}>
        {plan.exercises.map((exercise, index) => (
          <ExerciseCard key={`${exercise.name}-${index}`} exercise={exercise} index={index + 1} />
        ))}
      </View>
    </View>
  );
}

function TipsTab({ plan }: { plan: WorkoutPlan }) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();

  return (
    <View style={{ marginTop: layout.gutter, gap: layout.gutter }}>
      <SectionHeader title={t('train.tipsTitle')} subtitle={t('train.tipsSubtitle')} />
      <View style={{ gap: layout.compactGutter }}>
        {plan.tips.map((tip, index) => (
          <TipCard key={`${tip.title}-${index}`} tip={tip} />
        ))}
      </View>

      <SectionHeader title={t('train.recoveryTitle')} subtitle={t('train.recoverySubtitle')} style={{ marginTop: layout.compactGutter }} />
      <View style={{ gap: layout.compactGutter }}>
        {plan.recovery.map((item) => (
          <SimpleLineCard key={item} text={item} accent="orange" />
        ))}
      </View>
    </View>
  );
}

function ExerciseCard({
  exercise,
  index
}: {
  exercise: WorkoutPlan['exercises'][number];
  index: number;
}) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();

  return (
    <GlassCard>
      <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
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
            <AppText variant="bodyStrong">{exercise.name}</AppText>
            <AppText variant="caption" color="textMuted" style={{ marginTop: 4 }}>
              {exercise.sets} sets • {exercise.reps} reps • {t('common.rest')} {exercise.rest}
            </AppText>
          </View>
        </View>
        <AppText variant="body" color="textMuted">
          {exercise.cue}
        </AppText>
      </View>
    </GlassCard>
  );
}

function TipCard({ tip }: { tip: WorkoutTip }) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const accentColor = tip.category === 'recovery' ? colors.orange : colors.neon;
  const chipLabel =
    tip.category === 'execution' ? t('train.executionTip') : tip.category === 'recovery' ? t('train.recoveryTip') : t('train.trainingTip');

  return (
    <GlassCard>
      <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: layout.compactGutter }}>
          <AppText variant="bodyStrong">{tip.title}</AppText>
          <View
            style={{
              borderRadius: 999,
              backgroundColor: accentColor === colors.orange ? colors.orangeSoft : colors.neonSoft,
              paddingHorizontal: 10,
              paddingVertical: 6
            }}
          >
            <AppText variant="caption" style={{ color: accentColor }}>
              {chipLabel}
            </AppText>
          </View>
        </View>
        <AppText variant="body" color="textMuted">
          {tip.body}
        </AppText>
      </View>
    </GlassCard>
  );
}

function SimpleLineCard({
  text,
  accent
}: {
  text: string;
  accent: 'neon' | 'orange';
}) {
  const layout = useResponsiveLayout();
  const accentColor = accent === 'orange' ? colors.orange : colors.neon;
  const accentBackground = accent === 'orange' ? colors.orangeSoft : colors.neonSoft;

  return (
    <GlassCard>
      <View style={{ padding: layout.cardPadding, flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: accentColor,
            shadowColor: accentColor,
            shadowOpacity: 0.4,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 }
          }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText variant="body">{text}</AppText>
        </View>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            backgroundColor: accentBackground,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <RefreshCw color={accentColor} size={14} />
        </View>
      </View>
    </GlassCard>
  );
}

function InfoPill({
  icon,
  label
}: {
  icon: ReactNode;
  label: string;
}) {
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

function EmptyState({ isConfigured }: { isConfigured: boolean }) {
  const layout = useResponsiveLayout();
  const { t } = useI18n();

  return (
    <GlassCard style={{ marginTop: layout.gutter }}>
      <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
        <AppText variant="title">{t('train.noPlan')}</AppText>
        <AppText variant="body" color="textMuted">
          {isConfigured ? t('train.noPlanSubtitle') : t('train.noPlanFallback')}
        </AppText>
      </View>
    </GlassCard>
  );
}

function SecondaryAction({
  label,
  icon,
  onPress
}: {
  label: string;
  icon: ReactNode;
  onPress: () => void;
}) {
  const layout = useResponsiveLayout();

  return (
    <Pressable
      onPress={onPress}
      style={{
        minHeight: layout.minTouchTarget,
        borderRadius: radii.xl,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: layout.cardPadding,
        paddingVertical: layout.compactGutter + 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: layout.compactGutter
      }}
    >
      {icon}
      <AppText variant="bodyStrong" style={{ color: colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}
