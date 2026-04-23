import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Dumbbell, Info, ListChecks } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { AppText, GlassCard, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { getExerciseWithMedia } from '@/data/exercises';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, radii } from '@/lib/theme';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const layout = useResponsiveLayout();
  const exercise = getExerciseWithMedia(id);
  const muscleGroups = getUniqueMuscleGroups([
    exercise?.target,
    exercise?.muscle_group,
    ...(exercise?.secondary_muscles ?? [])
  ]).slice(0, 6);
  const mediaRatio = layout.isLandscape && !layout.isTablet ? 2.2 : layout.isTablet ? 1.8 : 1.28;

  return (
    <ResponsiveScreen bottomInset="none">
      <BackButton />

      <GlassCard style={{ marginTop: layout.gutter }}>
        <View style={{ padding: layout.cardPadding }}>
          <View
            style={{
              width: '100%',
              aspectRatio: mediaRatio,
              borderRadius: radii.lg,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.06)'
            }}
          >
            {exercise?.media?.image ? (
              <Image source={exercise.media.image} contentFit="cover" style={{ width: '100%', height: '100%' }} />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell color={colors.neon} size={42} />
                <AppText variant="bodyStrong" style={{ marginTop: layout.compactGutter }}>
                  Mock exercise image
                </AppText>
              </View>
            )}
          </View>

          <AppText variant="eyebrow" style={{ color: colors.neon, marginTop: layout.gutter }}>
            {exercise?.body_part ?? 'exercise'}
          </AppText>
          <AppText variant="headline" style={{ marginTop: layout.compactGutter, textTransform: 'capitalize' }}>
            {exercise?.name ?? 'Exercise not found'}
          </AppText>
          <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
            {exercise
              ? `${exercise.equipment} • target ${exercise.target ?? exercise.category}`
              : 'Không tìm thấy bài trong dataset, đang hiển thị fallback.'}
          </AppText>
        </View>
      </GlassCard>

      <SectionHeader title="Technique" subtitle="Instruction local từ dataset." style={{ marginTop: layout.sectionGap }} />
      <GlassCard>
        <View style={{ padding: layout.cardPadding, gap: layout.gutter }}>
          {(exercise?.instruction_steps?.en ?? []).slice(0, 5).map((step, index) => (
            <View key={`${step}-${index}`} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: layout.compactGutter }}>
              <View
                style={{
                  width: layout.smallIconSize * 0.72,
                  aspectRatio: 1,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.neonSoft
                }}
              >
                <AppText variant="caption" style={{ color: colors.neon }}>
                  {index + 1}
                </AppText>
              </View>
              <AppText variant="body" color="textMuted" style={{ flex: 1 }}>
                {step}
              </AppText>
            </View>
          ))}

          {!exercise?.instruction_steps?.en?.length ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
              <Info color={colors.orange} size={18} />
              <AppText variant="body" color="textMuted" style={{ flex: 1 }}>
                Chưa có hướng dẫn chi tiết cho bài này, app dùng fallback mock để màn không trống.
              </AppText>
            </View>
          ) : null}
        </View>
      </GlassCard>

      <SectionHeader title="Muscle groups" style={{ marginTop: layout.sectionGap }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter }}>
        {muscleGroups.map((muscle) => (
          <View
            key={muscle.toLowerCase()}
            style={{
              minHeight: layout.minTouchTarget,
              borderRadius: 999,
              backgroundColor: colors.neonSoft,
              paddingHorizontal: layout.cardPadding,
              paddingVertical: layout.compactGutter,
              flexDirection: 'row',
              alignItems: 'center',
              gap: layout.compactGutter / 2
            }}
          >
            <ListChecks color={colors.neon} size={14} />
            <AppText variant="caption" style={{ color: colors.neon, textTransform: 'capitalize' }} numberOfLines={1}>
              {muscle}
            </AppText>
          </View>
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

function getUniqueMuscleGroups(groups: (string | undefined)[]) {
  const seen = new Set<string>();

  return groups.reduce<string[]>((uniqueGroups, group) => {
    const normalizedGroup = group?.trim();

    if (!normalizedGroup) {
      return uniqueGroups;
    }

    const key = normalizedGroup.toLowerCase();

    if (seen.has(key)) {
      return uniqueGroups;
    }

    seen.add(key);
    uniqueGroups.push(normalizedGroup);
    return uniqueGroups;
  }, []);
}
