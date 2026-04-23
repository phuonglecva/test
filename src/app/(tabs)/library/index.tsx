import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ChevronRight, Dumbbell, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { AppText, GlassCard, LogoMark, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { exercises, searchExercises } from '@/data/exercises';
import { scaleFontSize, useResponsiveLayout } from '@/lib/responsive';
import { colors, radii } from '@/lib/theme';
import { getExerciseImageSource } from '@/lib/exercise-media';
import type { Exercise } from '@/types/exercise';

const DEFAULT_LIMIT = 18;

export default function LibraryScreen() {
  const layout = useResponsiveLayout();
  const [query, setQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');

  const bodyParts = useMemo(() => {
    const unique = Array.from(new Set(exercises.map((exercise) => exercise.body_part))).slice(0, 8);
    return ['all', ...unique];
  }, []);

  const filteredExercises = useMemo(() => {
    const base = searchExercises(query);
    const filtered =
      selectedBodyPart === 'all'
        ? base
        : base.filter((exercise) => exercise.body_part === selectedBodyPart);

    return filtered.slice(0, DEFAULT_LIMIT);
  }, [query, selectedBodyPart]);

  return (
    <ResponsiveScreen keyboardAware>
      <LogoMark label="Exercise Library" />

      <View style={{ marginTop: layout.gutter }}>
        <AppText variant="headline">Kho bài tập</AppText>
        <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
          Dữ liệu local từ dataset, luôn có ảnh fallback để không bị thiếu logo hoặc card trống.
        </AppText>
      </View>

      <GlassCard style={{ marginTop: layout.gutter }}>
        <View
          style={{
            padding: layout.cardPadding,
            flexDirection: 'row',
            alignItems: 'center',
            gap: layout.compactGutter
          }}
        >
          <Search color={colors.textMuted} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm bài tập, nhóm cơ, dụng cụ..."
            placeholderTextColor={colors.textSubtle}
            autoCapitalize="none"
            returnKeyType="search"
            style={{
              flex: 1,
              minHeight: layout.minTouchTarget,
              color: colors.text,
              fontFamily: 'Inter_400Regular',
              fontSize: scaleFontSize(14, layout.width)
            }}
          />
        </View>
      </GlassCard>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: layout.compactGutter, paddingVertical: layout.compactGutter }}
        style={{ marginTop: layout.compactGutter }}
      >
        {bodyParts.map((bodyPart) => {
          const active = selectedBodyPart === bodyPart;

          return (
            <Pressable
              key={bodyPart}
              onPress={() => setSelectedBodyPart(bodyPart)}
              style={{
                minHeight: layout.minTouchTarget,
                borderRadius: 999,
                paddingHorizontal: layout.cardPadding,
                paddingVertical: layout.compactGutter,
                backgroundColor: active ? colors.neon : 'rgba(255,255,255,0.06)',
                borderWidth: 1,
                borderColor: active ? colors.neon : colors.surfaceBorder,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AppText
                variant="caption"
                style={{
                  color: active ? colors.background : colors.text,
                  fontFamily: 'Inter_600SemiBold',
                  textTransform: 'capitalize'
                }}
              >
                {bodyPart}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionHeader
        title="Kết quả đề xuất"
        subtitle={`${filteredExercises.length} bài đầu tiên từ mock/local data`}
        style={{ marginTop: layout.sectionGap }}
      />

      <View style={{ gap: layout.gutter }}>
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </View>
    </ResponsiveScreen>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const layout = useResponsiveLayout();
  const imageSource = getExerciseImageSource(exercise.id);

  return (
    <Pressable onPress={() => router.push(`/exercise/${exercise.id}`)}>
      <GlassCard>
        <View
          style={{
            padding: layout.cardPadding,
            flexDirection: 'row',
            alignItems: 'center',
            gap: layout.gutter
          }}
        >
          <View
            style={{
              width: layout.isTablet ? '18%' : '24%',
              minWidth: layout.isCompact ? 70 : 78,
              maxWidth: 118,
              aspectRatio: 1,
              borderRadius: radii.md,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.06)'
            }}
          >
            {imageSource ? (
              <Image source={imageSource} contentFit="cover" style={{ width: '100%', height: '100%' }} />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell color={colors.neon} size={26} />
              </View>
            )}
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText variant="bodyStrong" numberOfLines={2} style={{ textTransform: 'capitalize' }}>
              {exercise.name}
            </AppText>
            <AppText variant="caption" color="textMuted" numberOfLines={1} style={{ marginTop: layout.compactGutter / 2 }}>
              {exercise.body_part} • {exercise.equipment}
            </AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter / 2, marginTop: layout.compactGutter }}>
              <Chip label={exercise.target ?? exercise.category} />
              <Chip label={exercise.category} muted />
            </View>
          </View>

          <View
            style={{
              width: layout.smallIconSize,
              aspectRatio: 1,
              borderRadius: radii.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neonSoft
            }}
          >
            <ChevronRight color={colors.neon} size={18} />
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

function Chip({ label, muted }: { label: string; muted?: boolean }) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        borderRadius: 999,
        paddingHorizontal: layout.compactGutter,
        paddingVertical: Math.max(4, layout.compactGutter * 0.45),
        backgroundColor: muted ? 'rgba(255,255,255,0.06)' : colors.neonSoft
      }}
    >
      <AppText
        variant="caption"
        numberOfLines={1}
        style={{
          color: muted ? colors.textMuted : colors.neon,
          textTransform: 'capitalize'
        }}
      >
        {label}
      </AppText>
    </View>
  );
}
