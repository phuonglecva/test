import { LinearGradient } from 'expo-linear-gradient';
import { Bot, CheckCircle2, Cloud, Dumbbell, Settings, Shield, Watch } from 'lucide-react-native';
import { View } from 'react-native';
import { AppText, GlassCard, LogoMark, ProgressRing, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { mockBadges, mockConnections, mockUser } from '@/data/mock-app';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii } from '@/lib/theme';

const connectionIcons = {
  supabase: Cloud,
  wearable: Watch,
  ai: Bot
} as const;

export default function ProfileScreen() {
  const layout = useResponsiveLayout();
  const profileDirection = layout.isCompact ? 'column' : 'row';
  const readinessDirection = layout.isCompact || (layout.isLandscape && !layout.isTablet) ? 'column' : 'row';
  const avatarSize = layout.isTablet ? 88 : layout.isCompact ? 64 : 72;

  return (
    <ResponsiveScreen>
      <LogoMark label="Profile" />

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
                {mockUser.avatar}
              </AppText>
            </View>
            <View style={{ flex: 1, minWidth: 0, width: profileDirection === 'column' ? '100%' : undefined }}>
              <AppText variant="headline" numberOfLines={1}>
                {mockUser.name}
              </AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={3}>
                {mockUser.title} • {mockUser.gym}
              </AppText>
            </View>
            <Settings color={colors.textMuted} size={22} />
          </View>

          <View style={{ marginTop: layout.gutter, flexDirection: readinessDirection, alignItems: 'center', gap: layout.gutter }}>
            <ProgressRing
              size={layout.isTablet ? 108 : 88}
              strokeWidth={9}
              progress={mockUser.readiness / 100}
              label="Ready"
              value={`${mockUser.readiness}`}
              accent={colors.neon}
            />
            <View style={{ flex: 1, width: readinessDirection === 'column' ? '100%' : undefined }}>
              <AppText variant="bodyStrong">Plan hiện tại</AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                {mockUser.plan}. Profile này đang lưu local/mock cho đến khi Cloud profile được cấu hình.
              </AppText>
            </View>
          </View>
        </LinearGradient>
      </GlassCard>

      <SectionHeader title="Badges" subtitle="Mock achievements để UI không trống." style={{ marginTop: layout.sectionGap }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.compactGutter }}>
        {mockBadges.map((badge) => (
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
        ))}
      </View>

      <SectionHeader title="Connections" subtitle="Các kết nối chưa có key sẽ hiện mock state." style={{ marginTop: layout.sectionGap }} />
      <View style={{ gap: layout.gutter }}>
        {mockConnections.map((connection) => {
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
        })}
      </View>
    </ResponsiveScreen>
  );
}
