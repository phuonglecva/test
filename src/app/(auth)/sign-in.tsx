import { router } from 'expo-router';
import { ArrowRight, Mail, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { AppText, GlassCard, LogoMark, NeonButton, ResponsiveScreen } from '@/components/ui';
import { useI18n } from '@/lib/i18n';
import { scaleFontSize, useResponsiveLayout } from '@/lib/responsive';
import { colors, radii } from '@/lib/theme';
import { useLogin, useRegister } from '@/hooks/useApiData';
import { useAppStore } from '@/store/useAppStore';

export default function SignInScreen() {
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const setAuthSession = useAppStore((state) => state.setAuthSession);
  const login = useLogin();
  const register = useRegister();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = login.isPending || register.isPending;
  const error = login.error ?? register.error;

  async function submit() {
    const payload = mode === 'login'
      ? await login.mutateAsync({ email: email.trim(), password })
      : await register.mutateAsync({ email: email.trim(), password, name: name.trim() });

    setAuthSession(payload.token, payload.user);
    router.replace(payload.user.hasSeenOnboarding ? '/home' : '/onboarding');
  }

  return (
    <ResponsiveScreen bottomInset="none" keyboardAware contentContainerStyle={{ justifyContent: layout.isLandscape ? 'flex-start' : 'center', flexGrow: 1 }}>
      <LogoMark label="Gym Buddy" />

      <GlassCard style={{ marginTop: layout.sectionGap }}>
        <View style={{ padding: layout.cardPadding }}>
          <View style={{ borderRadius: 999, backgroundColor: colors.neonSoft, padding: layout.compactGutter, alignSelf: 'flex-start' }}>
            <Mail color={colors.neon} size={20} />
          </View>
          <AppText variant="headline" style={{ marginTop: layout.gutter }}>
            {mode === 'login' ? t('auth.signIn') : 'Tạo tài khoản'}
          </AppText>
          <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter }}>
            Đăng nhập hoặc đăng ký để dữ liệu tập luyện được lưu vào SQLite backend.
          </AppText>

          <View style={{ marginTop: layout.gutter, gap: layout.compactGutter }}>
            {mode === 'register' ? (
              <AuthInput value={name} onChangeText={setName} placeholder="Tên hiển thị" />
            ) : null}
            <AuthInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
            <AuthInput value={password} onChangeText={setPassword} placeholder="Mật khẩu" secureTextEntry />
          </View>

          {error ? (
            <AppText variant="caption" style={{ color: colors.orange, marginTop: layout.compactGutter }}>
              Không thể xử lý yêu cầu. Kiểm tra email/mật khẩu hoặc backend.
            </AppText>
          ) : null}

          <View style={{ marginTop: layout.sectionGap }}>
            <NeonButton
              size="lg"
              label={isLoading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              icon={mode === 'login' ? <ArrowRight color={colors.background} size={18} /> : <UserPlus color={colors.background} size={18} />}
              disabled={isLoading || !email.trim() || !password || (mode === 'register' && !name.trim())}
              onPress={() => {
                void submit();
              }}
            />
          </View>

          <Pressable
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ minHeight: layout.minTouchTarget, alignItems: 'center', justifyContent: 'center', marginTop: layout.compactGutter }}
          >
            <AppText variant="bodyStrong" style={{ color: colors.neon }}>
              {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
            </AppText>
          </Pressable>
        </View>
      </GlassCard>
    </ResponsiveScreen>
  );
}

function AuthInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  const layout = useResponsiveLayout();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSubtle}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
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
