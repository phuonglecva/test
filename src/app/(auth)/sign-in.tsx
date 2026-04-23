import { router } from 'expo-router';
import { View, Text } from 'react-native';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { colors, typography } from '@/lib/theme';

export default function SignInScreen() {
  return (
    <View className="flex-1 bg-[#0F0F0F] px-5 pt-20">
      <GlassCard>
        <View className="p-5">
          <Text style={{ color: colors.text, fontFamily: typography.title, fontSize: 28 }}>
            Sign in
          </Text>
          <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 14, marginTop: 10 }}>
            Placeholder auth screen cho bước tiếp theo.
          </Text>
          <View className="mt-6">
            <NeonButton label="Vào app" onPress={() => router.replace('/home')} />
          </View>
        </View>
      </GlassCard>
    </View>
  );
}
