import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { ArrowRight, Dumbbell, Sparkles, TrendingUp, Users } from 'lucide-react-native';
import { ONBOARDING_SLIDES } from '@/lib/constants';
import { colors, gradients, radii, shadows, typography } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';
import { NeonButton } from '@/components/ui/neon-button';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const listRef = useRef<FlatList<(typeof ONBOARDING_SLIDES)[number]>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const setHasSeenOnboarding = useAppStore((state) => state.setHasSeenOnboarding);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={gradients.hero as unknown as [string, string, string]} style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 80,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: 'rgba(0,255,133,0.12)'
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 120,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: 999,
            backgroundColor: 'rgba(255,149,0,0.10)'
          }}
        />

        <View className="flex-1 px-5 pt-16">
          <View className="mb-6 flex-row items-center justify-between">
            <Text style={{ color: colors.text, fontFamily: typography.title, fontSize: 24 }}>
              Gym Buddy
            </Text>
            <View className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Text style={{ color: colors.neon, fontFamily: typography.subtitle, fontSize: 12 }}>
                AI Companion
              </Text>
            </View>
          </View>

          <FlatList
            ref={listRef}
            data={ONBOARDING_SLIDES}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setActiveIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={{ width: width - 40 }} className="mr-5">
                <View
                  style={[
                    {
                      minHeight: 520,
                      borderRadius: radii.xl,
                      borderWidth: 1,
                      borderColor: colors.surfaceBorder,
                      backgroundColor: colors.surface,
                      padding: 20,
                      overflow: 'hidden',
                      ...shadows.glass
                    }
                  ]}
                >
                  <View className="flex-1 justify-between">
                    <View className="items-center pt-4">
                      <View className="mb-5 rounded-[34px] border border-white/10 bg-white/5 p-5">
                        <View className="h-28 w-28 items-center justify-center rounded-[28px] bg-black/30">
                          <Sparkles color={colors.neon} size={42} />
                        </View>
                      </View>
                      <View className="rounded-full border border-neon/30 bg-neon/10 px-4 py-2">
                        <Text style={{ color: colors.neon, fontFamily: typography.subtitle, fontSize: 12 }}>
                          {item.accent}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: colors.text,
                          fontFamily: typography.title,
                          fontSize: 34,
                          lineHeight: 42
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontFamily: typography.body,
                          fontSize: 16,
                          lineHeight: 24,
                          marginTop: 12
                        }}
                      >
                        {item.subtitle}
                      </Text>

                      <View className="mt-8 flex-row flex-wrap gap-3">
                        <FeatureChip icon={<Dumbbell color={colors.neon} size={14} />} label="Workout AI" />
                        <FeatureChip icon={<TrendingUp color={colors.orange} size={14} />} label="Progress" />
                        <FeatureChip icon={<Users color={colors.neon} size={14} />} label="Find Buddy" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />

          <View className="mt-6 flex-row items-center justify-center gap-2">
            {ONBOARDING_SLIDES.map((slide, index) => (
              <View
                key={slide.id}
                style={{
                  width: activeIndex === index ? 26 : 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: activeIndex === index ? colors.neon : 'rgba(255,255,255,0.18)'
                }}
              />
            ))}
          </View>

          <View className="mt-8 pb-8">
            <NeonButton
              label="Bắt đầu miễn phí"
              icon={<ArrowRight color={colors.background} size={18} />}
              onPress={() => {
                setHasSeenOnboarding(true);
                router.replace('/home');
              }}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function FeatureChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
      {icon}
      <Text style={{ color: colors.text, fontFamily: typography.subtitle, fontSize: 12 }}>{label}</Text>
    </View>
  );
}
