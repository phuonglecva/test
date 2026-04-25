import { LinearGradient } from 'expo-linear-gradient';
import { Bot, CheckCircle2, Cloud, Dumbbell, Globe2, Settings, Shield, Watch } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { AppText, EmptyState, GlassCard, LogoMark, ProgressRing, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { useI18n } from '@/lib/i18n';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii } from '@/lib/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAppData } from '@/hooks/useApiData';
import { router } from 'expo-router';

const connectionIcons = {
  supabase: Cloud,
  wearable: Watch,
  ai: Bot
} as const;

export default function ProfileScreen() {
  const layout = useResponsiveLayout();
  const { language, t } = useI18n();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const clearAuthSession = useAppStore((state) => state.clearAuthSession);
  const { data } = useAppData();
  const user = data?.user;
  const badges = data?.badges ?? [];
  const connections = data?.connections ?? [];
  const profileDirection = layout.isCompact ? 'column' : 'row';
  const readinessDirection = layout.isCompact || (layout.isLandscape && !layout.isTablet) ? 'column' : 'row';
  const avatarSize = layout.isTablet ? 88 : layout.isCompact ? 64 : 72;
  const readiness = user?.readiness ?? 0;

  return (
    <ResponsiveScreen>
      <LogoMark label={t('common.profile')} />

      <GlassCard style={{ marginTop: layout.sectionGap }}>
        <LinearGradient colors={gradients.panel as unknown as [string, string, string]} style={{ padding: layout.cardPadding }}>
          <View style={{ flexDirection: profileDirection, alignItems: profileDirection === 'row' ? 'center' : 'flex-start', gap: layout.gutter }}>
            <View
              style={{
                width: avatarSize,
                aspectRatio: 1,
                borderRadius: Math.round(avatarSize * 0.38),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.neon,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.22)'
              }}
            >
              <AppText variant="headline" style={{ color: colors.background }}>
                {user?.avatar ?? 'S'}
              </AppText>
            </View>
            <View style={{ flex: 1, minWidth: 0, width: profileDirection === 'column' ? '100%' : undefined }}>
              <AppText variant="headline" numberOfLines={1}>
                {user?.name ?? ''}
              </AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={3}>
                {user ? `${user.title} • ${user.gym}` : ''}
              </AppText>
            </View>
            <Settings color={colors.textMuted} size={22} />
          </View>

          <View style={{ marginTop: layout.gutter, flexDirection: readinessDirection, alignItems: 'center', gap: layout.gutter }}>
            <ProgressRing
              size={layout.isTablet ? 108 : 88}
              strokeWidth={9}
              progress={readiness / 100}
              label={t('common.ready')}
              value={`${readiness}`}
              accent={colors.neon}
            />
            <View style={{ flex: 1, width: readinessDirection === 'column' ? '100%' : undefined }}>
              <AppText variant="bodyStrong">{t('profile.currentPlan')}</AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                {t('profile.currentPlanSubtitle', { plan: user?.plan ?? '' })}
              </AppText>
            </View>
          </View>
        </LinearGradient>
      </GlassCard>

      <SectionHeader title={t('profile.settingsTitle')} subtitle={t('profile.settingsSubtitle')} style={{ marginTop: layout.sectionGap }} />
      <GlassCard>
        <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
            <Globe2 color={colors.neon} size={18} />
            <AppText variant="bodyStrong">{t('common.language')}</AppText>
          </View>

          <View style={{ flexDirection: layout.isCompact ? 'column' : 'row', gap: layout.compactGutter }}>
            <LanguageOption
              label={t('common.vietnamese')}
              active={language === 'vi'}
              onPress={() => setLanguage('vi')}
            />
            <LanguageOption
              label={t('common.english')}
              active={language === 'en'}
              onPress={() => setLanguage('en')}
            />
          </View>
        </View>
      </GlassCard>

      <SectionHeader title="Chỉ số cơ thể" subtitle="BMI và plan được tính từ chiều cao, cân nặng, giới tính trong hồ sơ." style={{ marginTop: layout.sectionGap }} />
      <GlassCard>
        <View style={{ padding: layout.cardPadding, gap: layout.compactGutter }}>
          <View style={{ flexDirection: layout.isCompact ? 'column' : 'row', gap: layout.compactGutter }}>
            <BodyStat label="BMI" value={user?.bmi ? String(user.bmi) : 'Chưa có'} />
            <BodyStat label="Nhóm" value={user?.bmiCategory ?? 'Chưa đủ dữ liệu'} />
            <BodyStat label="Giới tính" value={user?.gender ?? 'other'} />
          </View>
          <AppText variant="body" color="textMuted">
            {user?.planRecommendation ?? user?.plan ?? ''}
          </AppText>
        </View>
      </GlassCard>

      <SectionHeader title={t('profile.badges')} subtitle={t('profile.badgesSubtitle')} style={{ marginTop: layout.sectionGap }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter }}>
        {badges.length ? badges.map((badge) => (
          <View
            key={badge}
            style={{
              minHeight: layout.minTouchTarget,
              borderRadius: 999,
              backgroundColor: colors.neonSoft,
              borderWidth: 1,
              borderColor: 'rgba(0,255,133,0.24)',
              paddingHorizontal: layout.cardPadding,
              paddingVertical: layout.compactGutter,
              flexDirection: 'row',
              alignItems: 'center',
              gap: layout.compactGutter / 2
            }}
          >
            <Shield color={colors.neon} size={14} />
            <AppText variant="caption" style={{ color: colors.neon }} numberOfLines={1}>
              {badge}
            </AppText>
          </View>
        )) : (
          <EmptyState icon={<Shield color={colors.neon} size={22} />} title="Chưa có huy hiệu" body="Huy hiệu sẽ xuất hiện sau khi bạn hoàn thành workout." />
        )}
      </View>

      <SectionHeader title={t('profile.connections')} subtitle={t('profile.connectionsSubtitle')} style={{ marginTop: layout.sectionGap }} />
      <View style={{ gap: layout.gutter }}>
        {connections.length ? connections.map((connection) => {
          const Icon = connectionIcons[connection.id as keyof typeof connectionIcons] ?? Dumbbell;

          return (
            <GlassCard key={connection.id}>
              <View style={{ padding: layout.cardPadding, flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
                <View
                  style={{
                    width: layout.smallIconSize,
                    aspectRatio: 1,
                    borderRadius: radii.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: connection.id === 'wearable' ? colors.orangeSoft : colors.neonSoft
                  }}
                >
                  <Icon color={connection.id === 'wearable' ? colors.orange : colors.neon} size={20} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <AppText variant="bodyStrong" numberOfLines={1}>
                    {connection.name}
                  </AppText>
                  <AppText variant="caption" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={3}>
                    {connection.detail}
                  </AppText>
                </View>
                <View style={{ alignItems: 'flex-end', gap: layout.compactGutter / 2, maxWidth: '34%' }}>
                  <CheckCircle2 color={colors.neon} size={18} />
                  <AppText variant="caption" style={{ color: colors.neon }} numberOfLines={2}>
                    {connection.status}
                  </AppText>
                </View>
              </View>
            </GlassCard>
          );
        }) : (
          <EmptyState icon={<Cloud color={colors.neon} size={22} />} title="Chưa có kết nối" body="Backend chưa trả trạng thái tích hợp." />
        )}
      </View>

      <Pressable
        onPress={() => {
          clearAuthSession();
          router.replace('/sign-in');
        }}
        style={{
          minHeight: layout.minTouchTarget,
          borderRadius: radii.xl,
          borderWidth: 1,
          borderColor: colors.orangeSoft,
          backgroundColor: colors.orangeSoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: layout.sectionGap,
          paddingHorizontal: layout.cardPadding
        }}
      >
        <AppText variant="bodyStrong" style={{ color: colors.orange }}>
          Đăng xuất
        </AppText>
      </Pressable>
    </ResponsiveScreen>
  );
}

function BodyStat({ label, value }: { label: string; value: string }) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        flex: 1,
        minHeight: layout.minTouchTarget,
        borderRadius: radii.md,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: layout.compactGutter
      }}
    >
      <AppText variant="caption" color="textMuted" numberOfLines={1}>
        {label}
      </AppText>
      <AppText variant="bodyStrong" style={{ marginTop: 4 }} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

function LanguageOption({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
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
        borderColor: active ? colors.neon : colors.surfaceBorder,
        backgroundColor: active ? colors.neonSoft : 'rgba(255,255,255,0.04)',
        paddingHorizontal: layout.cardPadding,
        paddingVertical: layout.compactGutter + 2,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <AppText variant="bodyStrong" style={{ color: active ? colors.neon : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}
