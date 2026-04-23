import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Bell, Flame, MessageCircle, Play, Sparkles, Zap } from 'lucide-react-native';
import { APP_GREETING, HOME_METRICS } from '@/lib/constants';
import { colors, gradients, radii, shadows, typography } from '@/lib/theme';
import { formatDateLabel, getGreetingLabel } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { SectionHeader } from '@/components/ui/section-header';
import { WorkoutCard } from '@/components/home';

const recommendedWorkouts = [
  {
    id: 'push-power',
    title: 'Push Power',
    subtitle: 'Ngực, vai, tay sau với nhịp độ mạnh mẽ và volume cao.',
    minutes: 52,
    accent: 'neon' as const
  },
  {
    id: 'pull-hypertrophy',
    title: 'Pull Hypertrophy',
    subtitle: 'Tập trung lưng xô, rear delts và cải thiện độ dày cơ lưng.',
    minutes: 58,
    accent: 'orange' as const
  },
  {
    id: 'legs-complete',
    title: 'Leg Day Complete',
    subtitle: 'Squat pattern, hinge, unilateral work và finisher cháy đùi.',
    minutes: 66,
    accent: 'neon' as const
  }
];

export default function HomeScreen() {
  const stats = useAppStore((state) => state.stats);
  const profileName = useAppStore((state) => state.profileName);
  const [greeting, setGreeting] = useState('Sáng tốt lành');

  useEffect(() => {
    setGreeting(getGreetingLabel(new Date().getHours()));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={gradients.hero as unknown as [string, string, string]} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="px-5 pt-14">
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 13 }}>
                  {formatDateLabel(new Date())}
                </Text>
                <Text style={{ color: colors.text, fontFamily: typography.title, fontSize: 24, marginTop: 6 }}>
                  {APP_GREETING}
                </Text>
                <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 13, marginTop: 4 }}>
                  {greeting} - {profileName}
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <Pressable
                  className="h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                  onPress={() => router.push('/profile')}
                >
                  <Bell color={colors.text} size={18} />
                </Pressable>
                <View className="flex-row items-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-3 py-2">
                  <Flame color={colors.orange} size={16} />
                  <Text style={{ color: colors.text, fontFamily: typography.subtitle, fontSize: 13 }}>
                    {stats.streakDays}d
                  </Text>
                </View>
              </View>
            </View>

            <GlassCard className="mb-5 overflow-hidden">
              <View className="px-5 py-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <View className="mb-3 flex-row items-center gap-2">
                      <View className="rounded-full bg-neon/10 px-3 py-1">
                        <Text style={{ color: colors.neon, fontFamily: typography.subtitle, fontSize: 12 }}>
                          LIVE
                        </Text>
                      </View>
                      <View className="rounded-full bg-white/5 px-3 py-1">
                        <Text style={{ color: colors.textMuted, fontFamily: typography.subtitle, fontSize: 12 }}>
                          AI Coach online
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: typography.title,
                        fontSize: 28,
                        lineHeight: 34
                      }}
                    >
                      Start Workout
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontFamily: typography.body,
                        fontSize: 14,
                        marginTop: 10,
                        lineHeight: 21
                      }}
                    >
                      Sẵn sàng vào bài, theo dõi volume, PR và nhịp tim trong một flow mượt như đang có HLV thật.
                    </Text>
                  </View>

                  <View className="items-center">
                    <ProgressRing
                      progress={0.74}
                      label="Goal"
                      value="74%"
                      accent={colors.neon}
                    />
                  </View>
                </View>

                <View className="mt-5 flex-row gap-3">
                  {HOME_METRICS.map((metric) => (
                    <View
                      key={metric.label}
                      style={{
                        flex: 1,
                        borderRadius: radii.lg,
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.06)',
                        padding: 12
                      }}
                    >
                      <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 11 }}>
                        {metric.label}
                      </Text>
                      <Text style={{ color: colors.text, fontFamily: typography.title, fontSize: 22, marginTop: 8 }}>
                        {metric.value}
                      </Text>
                      <Text style={{ color: colors.neon, fontFamily: typography.subtitle, fontSize: 11, marginTop: 6 }}>
                        {metric.delta}
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="mt-5">
                  <NeonButton
                    label="Start Workout"
                    icon={<Play color={colors.background} fill={colors.background} size={18} />}
                    onPress={() => router.push('/train')}
                  />
                </View>
              </View>
            </GlassCard>

            <SectionHeader
              title="Recommended Workouts"
              subtitle="Cá nhân hóa theo lịch sử tập và mục tiêu của bạn"
              actionLabel="See all"
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5">
              {recommendedWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  subtitle={workout.subtitle}
                  minutes={workout.minutes}
                  accent={workout.accent}
                />
              ))}
            </ScrollView>

            <View className="mt-5 flex-row gap-3">
              <GlassCard className="flex-1">
                <View className="p-4">
                  <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 12 }}>
                    Daily Focus
                  </Text>
                  <Text style={{ color: colors.text, fontFamily: typography.title, fontSize: 18, marginTop: 6 }}>
                    Chest + Triceps
                  </Text>
                  <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 13, marginTop: 8, lineHeight: 19 }}>
                    18 sets, 7 exercises, 91% adherence
                  </Text>
                </View>
              </GlassCard>

              <GlassCard className="w-[118px]">
                <View className="items-center justify-center p-4">
                  <View className="mb-2 rounded-full bg-neon/10 p-3">
                    <Zap color={colors.neon} size={18} />
                  </View>
                  <Text style={{ color: colors.text, fontFamily: typography.title, fontSize: 18 }}>
                    92
                  </Text>
                  <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 12 }}>
                    Energy
                  </Text>
                </View>
              </GlassCard>
            </View>

            <View className="mt-6">
              <SectionHeader title="AI đang gợi ý" subtitle="Dựa trên volume, phục hồi và thói quen gần đây" />
              <GlassCard>
                <View className="p-4">
                  <View className="mb-3 flex-row items-center gap-2">
                    <View className="rounded-full bg-neon/10 p-2">
                      <Sparkles color={colors.neon} size={16} />
                    </View>
                    <Text style={{ color: colors.text, fontFamily: typography.subtitle, fontSize: 14 }}>
                      Bạn đang thiếu volume ở lưng giữa
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: typography.body,
                      fontSize: 13,
                      lineHeight: 20
                    }}
                  >
                    Gợi ý thêm 2 set chest-supported row và 1 finisher face pull để cân bằng upper back.
                  </Text>
                </View>
              </GlassCard>
            </View>
          </View>
        </ScrollView>

        <Pressable
          onPress={() => router.push('/train')}
          style={[
            {
              position: 'absolute',
              right: 18,
              bottom: 102,
              width: 62,
              height: 62,
              borderRadius: 31,
              backgroundColor: colors.neon,
              alignItems: 'center',
              justifyContent: 'center',
              ...shadows.neon
            }
          ]}
        >
          <MessageCircle color={colors.background} size={24} />
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.orange,
              borderWidth: 2,
              borderColor: colors.background
            }}
          />
        </Pressable>
      </LinearGradient>
    </View>
  );
}
