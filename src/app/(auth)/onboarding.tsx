import { router } from 'expo-router';
import { ArrowRight, Dumbbell, Sparkles, TrendingUp, Users } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useMemo, useRef, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { AppText, LogoMark, NeonButton, ResponsiveScreen } from '@/components/ui';
import { useI18n } from '@/lib/i18n';
import { clamp, scaleFontSize, useResponsiveLayout } from '@/lib/responsive';
import { colors, radii, shadows } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';
import { useSaveOnboarding } from '@/hooks/useApiData';

export default function OnboardingScreen() {
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const slides = useMemo(
    () => [
      {
        id: 'hero',
        title: t('onboarding.heroTitle'),
        subtitle: t('onboarding.heroSubtitle'),
        accent: t('onboarding.heroAccent')
      },
      {
        id: 'coach',
        title: t('onboarding.coachTitle'),
        subtitle: t('onboarding.coachSubtitle'),
        accent: t('onboarding.coachAccent')
      },
      {
        id: 'progress',
        title: t('onboarding.progressTitle'),
        subtitle: t('onboarding.progressSubtitle'),
        accent: t('onboarding.progressAccent')
      },
      {
        id: 'buddy',
        title: t('onboarding.buddyTitle'),
        subtitle: t('onboarding.buddySubtitle'),
        accent: t('onboarding.buddyAccent')
      }
    ],
    [t]
  );
  const listRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const authUser = useAppStore((state) => state.authUser);
  const setHasSeenOnboarding = useAppStore((state) => state.setHasSeenOnboarding);
  const updateAuthUser = useAppStore((state) => state.updateAuthUser);
  const saveOnboarding = useSaveOnboarding();
  const [name, setName] = useState(authUser?.name ?? '');
  const [title, setTitle] = useState(authUser?.title ?? 'Intermediate lifter');
  const [gym, setGym] = useState(authUser?.gym ?? 'District 1 Strength Lab');
  const [plan, setPlan] = useState(authUser?.plan ?? 'Hypertrophy focus');
  const [weeklyGoal, setWeeklyGoal] = useState(String(authUser?.weeklyGoal ?? 5));
  const [heightCm, setHeightCm] = useState(authUser?.heightCm ? String(authUser.heightCm) : '');
  const [weightKg, setWeightKg] = useState(authUser?.weightKg ? String(authUser.weightKg) : '');
  const [gender, setGender] = useState(authUser?.gender ?? 'other');
  const slideGap = layout.gutter;
  const slideWidth = layout.contentWidth;
  const availableCardHeight =
    layout.height - layout.safeTop - layout.safeBottom - layout.pagePadding * 2 - layout.minTouchTarget * 3.8;
  const cardMinHeight = clamp(
    availableCardHeight,
    layout.isLandscape && !layout.isTablet ? 260 : 380,
    layout.isTablet ? 620 : 540
  );
  const heroIconSize = layout.isCompact ? 86 : layout.isTablet ? 124 : 104;

  return (
    <ResponsiveScreen bottomInset="none" contentContainerStyle={{ flexGrow: 1, paddingBottom: layout.safeBottom + layout.pagePadding }}>
      <View>
        <View
          style={{
            marginBottom: layout.gutter,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: layout.gutter
          }}
        >
          <LogoMark label="Gym Buddy" />
          <View
            style={{
              minHeight: layout.minTouchTarget,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              backgroundColor: 'rgba(255,255,255,0.06)',
              paddingHorizontal: layout.compactGutter,
              paddingVertical: Math.max(6, layout.compactGutter * 0.65),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AppText variant="caption" style={{ color: colors.neon, fontFamily: 'Inter_600SemiBold' }} numberOfLines={1}>
              {t('auth.aiCompanion')}
            </AppText>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={slideWidth + slideGap}
          decelerationRate="fast"
          keyboardShouldPersistTaps="handled"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / (slideWidth + slideGap));
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={{ width: slideWidth, marginRight: slideGap }}>
              <View
                style={{
                  minHeight: cardMinHeight,
                  borderRadius: radii.xl,
                  borderWidth: 1,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.surface,
                  padding: layout.cardPadding,
                  overflow: 'hidden',
                  ...shadows.glass
                }}
              >
                <View style={{ flex: 1, justifyContent: 'space-between', gap: layout.sectionGap }}>
                  <View style={{ alignItems: 'center', paddingTop: layout.compactGutter }}>
                    <View
                      style={{
                        marginBottom: layout.gutter,
                        borderRadius: radii.lg,
                        borderWidth: 1,
                        borderColor: colors.surfaceBorder,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: layout.cardPadding
                      }}
                    >
                      <View
                        style={{
                          width: heroIconSize,
                          aspectRatio: 1,
                          borderRadius: radii.lg,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0,0,0,0.30)'
                        }}
                      >
                        <Sparkles color={colors.neon} size={Math.round(heroIconSize * 0.38)} />
                      </View>
                    </View>
                    <FeatureChip icon={<Dumbbell color={colors.neon} size={14} />} label={item.accent} />
                  </View>

                  <View>
                    <AppText variant="headline" numberOfLines={4}>
                      {item.title}
                    </AppText>
                    <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter }}>
                      {item.subtitle}
                    </AppText>

                    <View style={{ marginTop: layout.gutter, flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter }}>
                      <FeatureChip icon={<Dumbbell color={colors.neon} size={14} />} label={t('onboarding.workoutAi')} />
                      <FeatureChip icon={<TrendingUp color={colors.orange} size={14} />} label={t('onboarding.progressChip')} />
                      <FeatureChip icon={<Users color={colors.neon} size={14} />} label={t('onboarding.findBuddy')} />
                    </View>

                    {item.id === 'buddy' ? (
                      <View style={{ marginTop: layout.gutter, gap: layout.compactGutter }}>
                        <OnboardingInput value={name} onChangeText={setName} placeholder="Tên hiển thị" />
                        <OnboardingInput value={title} onChangeText={setTitle} placeholder="Trình độ / mô tả ngắn" />
                        <OnboardingInput value={gym} onChangeText={setGym} placeholder="Phòng tập" />
                        <OnboardingInput value={plan} onChangeText={setPlan} placeholder="Mục tiêu hiện tại" />
                        <OnboardingInput value={weeklyGoal} onChangeText={setWeeklyGoal} placeholder="Số buổi / tuần" keyboardType="number-pad" />
                        <OnboardingInput value={heightCm} onChangeText={setHeightCm} placeholder="Chiều cao (cm)" keyboardType="number-pad" />
                        <OnboardingInput value={weightKg} onChangeText={setWeightKg} placeholder="Cân nặng (kg)" keyboardType="number-pad" />
                        <OnboardingInput
                          value={gender}
                          onChangeText={(value) => setGender(value === 'male' || value === 'female' ? value : 'other')}
                          placeholder="Giới tính: male / female / other"
                        />
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          )}
        />

        <View style={{ marginTop: layout.gutter, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: layout.compactGutter }}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={{
                width: activeIndex === index ? layout.minTouchTarget * 0.6 : 8,
                height: Math.max(6, layout.compactGutter * 0.7),
                borderRadius: 999,
                backgroundColor: activeIndex === index ? colors.neon : 'rgba(255,255,255,0.18)'
              }}
            />
          ))}
        </View>

        <View style={{ marginTop: layout.gutter }}>
          <NeonButton
            size="lg"
            label={activeIndex < slides.length - 1 ? 'Tiếp tục' : saveOnboarding.isPending ? 'Đang lưu...' : t('auth.startFree')}
            icon={<ArrowRight color={colors.background} size={18} />}
            onPress={() => {
              if (activeIndex < slides.length - 1) {
                listRef.current?.scrollToIndex({ index: activeIndex + 1 });
                setActiveIndex(activeIndex + 1);
                return;
              }

              void saveOnboarding
                .mutateAsync({
                  name: name.trim() || authUser?.name || 'User',
                  title: title.trim() || 'Intermediate lifter',
                  gym: gym.trim() || 'Home gym',
                  plan: plan.trim() || 'General fitness',
                  weeklyGoal: Number(weeklyGoal) || 3,
                  heightCm: heightCm ? Number(heightCm) : null,
                  weightKg: weightKg ? Number(weightKg) : null,
                  gender: gender === 'male' || gender === 'female' ? gender : 'other'
                })
                .then(({ user }) => {
                  updateAuthUser(user);
                  setHasSeenOnboarding(true);
                  router.replace('/home');
                });
            }}
          />
        </View>
      </View>
    </ResponsiveScreen>
  );
}

function FeatureChip({ icon, label }: { icon: ReactNode; label: string }) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        minHeight: layout.minTouchTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: layout.compactGutter / 2,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: layout.compactGutter,
        paddingVertical: Math.max(6, layout.compactGutter * 0.65)
      }}
    >
      {icon}
      <AppText variant="caption" numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

function OnboardingInput({
  value,
  onChangeText,
  placeholder,
  keyboardType
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad';
}) {
  const layout = useResponsiveLayout();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSubtle}
      keyboardType={keyboardType}
      style={{
        minHeight: layout.minTouchTarget,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: colors.text,
        paddingHorizontal: layout.cardPadding,
        fontFamily: 'Inter_400Regular',
        fontSize: scaleFontSize(14, layout.width)
      }}
    />
  );
}
