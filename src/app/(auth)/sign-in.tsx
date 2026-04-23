import { router } from 'expo-router';
import { ArrowRight, Mail } from 'lucide-react-native';
import { View } from 'react-native';
import { AppText, GlassCard, LogoMark, NeonButton, ResponsiveScreen } from '@/components/ui';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors } from '@/lib/theme';

export default function SignInScreen() {
  const layout = useResponsiveLayout();

  return (
    <ResponsiveScreen bottomInset="none" keyboardAware contentContainerStyle={{ justifyContent: layout.isLandscape ? 'flex-start' : 'center', flexGrow: 1 }}>
      <LogoMark label="Gym Buddy" />

      <GlassCard style={{ marginTop: layout.sectionGap }}>
        <View style={{ padding: layout.cardPadding }}>
          <View style={{ borderRadius: 999, backgroundColor: colors.neonSoft, padding: layout.compactGutter, alignSelf: 'flex-start' }}>
            <Mail color={colors.neon} size={20} />
          </View>
          <AppText variant="headline" style={{ marginTop: layout.gutter }}>
            Sign in
          </AppText>
          <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter }}>
            Auth thật chưa được nối, nên màn này dùng mock entry để vào app và kiểm thử giao diện.
          </AppText>
          <View style={{ marginTop: layout.sectionGap }}>
            <NeonButton
              size="lg"
              label="Vào app bằng mock profile"
              icon={<ArrowRight color={colors.background} size={18} />}
              onPress={() => router.replace('/home')}
            />
          </View>
        </View>
      </GlassCard>
    </ResponsiveScreen>
  );
}
