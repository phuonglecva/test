import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, PauseCircle } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, GlassCard, NeonButton, ResponsiveScreen } from '@/components/ui';
import { useI18n } from '@/lib/i18n';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, radii } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';

export default function WorkoutProcessScreen() {
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const patchStats = useAppStore((state) => state.patchStats);
  const currentWorkoutPlan = useAppStore((state) => state.currentWorkoutPlan);
  const currentWorkoutSession = useAppStore((state) => state.currentWorkoutSession);
  const setCurrentWorkout = useAppStore((state) => state.setCurrentWorkout);
  const clearCurrentWorkout = useAppStore((state) => state.clearCurrentWorkout);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!currentWorkoutSession) {
      setElapsedSeconds(0);
      return;
    }

    const intervalId = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - currentWorkoutSession.startedAt) / 1000)));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentWorkoutSession]);

  const currentExercise = useMemo(() => {
    if (!currentWorkoutPlan || !currentWorkoutSession) {
      return null;
    }

    return currentWorkoutPlan.exercises[currentWorkoutSession.currentExerciseIndex] ?? null;
  }, [currentWorkoutPlan, currentWorkoutSession]);

  if (!currentWorkoutPlan || !currentWorkoutSession || !currentExercise) {
    return (
      <ResponsiveScreen bottomInset="none">
        <BackButton />
        <GlassCard style={{ marginTop: layout.sectionGap }}>
          <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
            <AppText variant="title">{t('process.noActiveTitle')}</AppText>
            <AppText variant="body" color="textMuted">
              {t('process.noActiveSubtitle')}
            </AppText>
            <NeonButton label={t('process.backToTrain')} onPress={() => router.replace('/train')} />
          </View>
        </GlassCard>
      </ResponsiveScreen>
    );
  }

  const workoutPlan = currentWorkoutPlan;
  const workoutSession = currentWorkoutSession;
  const exercise = currentExercise;

  const completedCount = workoutSession.completedExerciseIndexes.length;
  const processProgress = workoutPlan.exercises.length
    ? completedCount / workoutPlan.exercises.length
    : 0;
  const progressWidth = `${Math.max(6, Math.round(processProgress * 100))}%` as `${number}%`;

  function updateSession(nextIndex: number, completedIndexes = workoutSession.completedExerciseIndexes) {
    setCurrentWorkout(workoutPlan, {
      ...workoutSession,
      currentExerciseIndex: nextIndex,
      completedExerciseIndexes: completedIndexes
    });
  }

  function goToPreviousExercise() {
    updateSession(Math.max(0, workoutSession.currentExerciseIndex - 1));
  }

  function goToNextExercise() {
    updateSession(Math.min(workoutPlan.exercises.length - 1, workoutSession.currentExerciseIndex + 1));
  }

  function completeCurrentExercise() {
    const completedIndexes = workoutSession.completedExerciseIndexes.includes(workoutSession.currentExerciseIndex)
      ? workoutSession.completedExerciseIndexes
      : [...workoutSession.completedExerciseIndexes, workoutSession.currentExerciseIndex];

    updateSession(
      Math.min(workoutPlan.exercises.length - 1, workoutSession.currentExerciseIndex + 1),
      completedIndexes
    );
  }

  function finishWorkout() {
    patchStats({
      calories: useAppStore.getState().stats.calories + Math.max(120, workoutPlan.exercises.length * 35),
      streakDays: useAppStore.getState().stats.streakDays + 1
    });
    clearCurrentWorkout();
    router.replace('/train');
  }

  return (
    <ResponsiveScreen bottomInset="none">
      <BackButton />

      <View style={{ marginTop: layout.sectionGap, gap: layout.gutter }}>
        <View style={{ alignItems: 'center' }}>
          <AppText variant="eyebrow" style={{ color: colors.textMuted }}>
            {t('process.focusMode')}
          </AppText>
          <AppText
            variant="headline"
            style={{
              marginTop: layout.compactGutter,
              fontSize: layout.isTablet ? 68 : 56,
              lineHeight: layout.isTablet ? 74 : 60
            }}
          >
            {formatElapsedTime(elapsedSeconds)}
          </AppText>
          <AppText variant="caption" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
            {t('process.exerciseOf', {
              current: workoutSession.currentExerciseIndex + 1,
              total: workoutPlan.exercises.length
            })}
          </AppText>
        </View>

        <View
          style={{
            height: 8,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.06)',
            overflow: 'hidden'
          }}
        >
          <View
            style={{
              width: progressWidth,
              height: '100%',
              borderRadius: 999,
              backgroundColor: colors.neon
            }}
          />
        </View>

        <View
          style={{
            borderRadius: radii.xl,
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderWidth: 1,
            borderColor: colors.surfaceBorder,
            padding: layout.cardPadding
          }}
        >
          <AppText variant="eyebrow" style={{ color: colors.orange }}>
            {t('process.currentExercise')}
          </AppText>
          <AppText variant="headline" style={{ marginTop: layout.compactGutter }}>
            {exercise.name}
          </AppText>
          <AppText variant="bodyStrong" style={{ marginTop: layout.compactGutter }}>
            {exercise.sets} sets • {exercise.reps} reps
          </AppText>
          <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
            Rest {exercise.rest}
          </AppText>
          <AppText variant="body" color="textMuted" style={{ marginTop: layout.gutter }}>
            {exercise.cue}
          </AppText>
        </View>

        <View style={{ flexDirection: 'row', gap: layout.compactGutter }}>
          <MinimalStat label={t('process.done')} value={`${completedCount}/${workoutPlan.exercises.length}`} />
          <MinimalStat label={t('common.rest')} value={exercise.rest} />
          <MinimalStat label={t('process.ready')} value={`${Math.round(processProgress * 100)}%`} />
        </View>

        <View style={{ marginTop: layout.compactGutter, gap: layout.compactGutter }}>
          <View style={{ flexDirection: layout.isCompact ? 'column' : 'row', gap: layout.compactGutter }}>
            <SecondaryAction label={t('process.previous')} icon={<ChevronLeft color={colors.text} size={16} />} onPress={goToPreviousExercise} />
            <SecondaryAction label={t('process.next')} icon={<ChevronRight color={colors.text} size={16} />} onPress={goToNextExercise} />
          </View>

          <NeonButton
            label={t('process.complete')}
            icon={<CheckCircle2 color={colors.background} fill={colors.background} size={16} />}
            onPress={completeCurrentExercise}
          />

          <SecondaryAction label={t('process.finish')} icon={<PauseCircle color={colors.orange} size={16} />} onPress={finishWorkout} accent="orange" />
        </View>
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

function MinimalStat({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: radii.md,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        paddingVertical: layout.compactGutter + 2,
        paddingHorizontal: layout.compactGutter
      }}
    >
      <AppText variant="caption" color="textMuted" style={{ textAlign: 'center' }}>
        {label}
      </AppText>
      <AppText variant="bodyStrong" style={{ textAlign: 'center', marginTop: 4 }}>
        {value}
      </AppText>
    </View>
  );
}

function SecondaryAction({
  label,
  icon,
  onPress,
  accent = 'neutral'
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  accent?: 'neutral' | 'orange';
}) {
  const layout = useResponsiveLayout();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: layout.minTouchTarget,
        borderRadius: radii.xl,
        borderWidth: 1,
        borderColor: accent === 'orange' ? colors.orangeSoft : colors.surfaceBorder,
        backgroundColor: accent === 'orange' ? colors.orangeSoft : 'rgba(255,255,255,0.05)',
        paddingHorizontal: layout.cardPadding,
        paddingVertical: layout.compactGutter + 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: layout.compactGutter
      }}
    >
      {icon}
      <AppText variant="bodyStrong" style={{ color: accent === 'orange' ? colors.orange : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
