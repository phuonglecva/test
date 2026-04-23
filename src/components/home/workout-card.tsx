import { Text, View } from 'react-native';
import { ArrowRight, Flame } from 'lucide-react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { colors, typography } from '@/lib/theme';
import { LinearGradient } from 'expo-linear-gradient';

type WorkoutCardProps = {
  title: string;
  subtitle: string;
  minutes: number;
  accent: 'neon' | 'orange';
};

export function WorkoutCard({ title, subtitle, minutes, accent }: WorkoutCardProps) {
  const accentColors =
    accent === 'neon'
      ? (['rgba(0,255,133,0.22)', 'rgba(0,255,133,0.06)'] as const)
      : (['rgba(255,149,0,0.22)', 'rgba(255,149,0,0.06)'] as const);

  return (
    <GlassCard className="mr-4 w-[252px]">
      <LinearGradient
        colors={accentColors as unknown as [string, string]}
        style={{ padding: 16, minHeight: 160 }}
      >
        <View className="flex-row items-start justify-between">
          <View className="rounded-2xl bg-white/5 px-3 py-2">
            <Flame color={accent === 'neon' ? colors.neon : colors.orange} size={18} />
          </View>
          <View className="rounded-full border border-white/10 bg-black/25 px-3 py-1">
            <Text style={{ color: colors.text, fontFamily: typography.subtitle, fontSize: 12 }}>
              {minutes} min
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.title,
            fontSize: 20,
            marginTop: 18
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: typography.body,
            fontSize: 13,
            marginTop: 8,
            lineHeight: 19
          }}
        >
          {subtitle}
        </Text>
        <View className="mt-5 flex-row items-center gap-2">
          <Text style={{ color: accent === 'neon' ? colors.neon : colors.orange, fontFamily: typography.subtitle }}>
            Start
          </Text>
          <ArrowRight color={accent === 'neon' ? colors.neon : colors.orange} size={14} />
        </View>
      </LinearGradient>
    </GlassCard>
  );
}
