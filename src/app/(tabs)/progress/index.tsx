import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Award, Flame, TrendingUp } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { AppText, GlassCard, LogoMark, ProgressRing, ResponsiveScreen, SectionHeader } from '@/components/ui';
import { useI18n } from '@/lib/i18n';
import { mockMetrics, mockPersonalRecords, mockProgressWeeks, mockUser } from '@/data/mock-app';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, gradients, radii } from '@/lib/theme';

export default function ProgressScreen() {
  const layout = useResponsiveLayout();
  const { t } = useI18n();
  const maxVolume = Math.max(...mockProgressWeeks.map((week) => week.volume));
  const heroDirection = layout.isCompact || (layout.isLandscape && !layout.isTablet) ? 'column' : 'row';
  const chartHeight = Math.min(layout.height * 0.28, layout.isTablet ? 240 : 180);

  return (
    <ResponsiveScreen>
      <LogoMark label={t('common.progress')} />

      <GlassCard style={{ marginTop: layout.sectionGap }}>
        <LinearGradient colors={gradients.panel as unknown as [string, string, string]} style={{ padding: layout.cardPadding }}>
          <View style={{ flexDirection: heroDirection, alignItems: 'center', gap: layout.gutter }}>
            <View style={{ flex: 1, minWidth: 0, width: heroDirection === 'column' ? '100%' : undefined }}>
              <AppText variant="eyebrow" style={{ color: colors.neon }}>
                {t('progress.weeklyOverview')}
              </AppText>
              <AppText variant="headline" style={{ marginTop: layout.compactGutter }}>
                {t('progress.weeklyDone', { done: mockUser.weeklyDone, goal: mockUser.weeklyGoal })}
              </AppText>
              <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                {t('progress.weeklySubtitle')}
              </AppText>
            </View>
            <ProgressRing
              size={layout.isTablet ? 116 : 98}
              strokeWidth={10}
              progress={mockUser.weeklyDone / mockUser.weeklyGoal}
              label={t('common.goal')}
              value={`${Math.round((mockUser.weeklyDone / mockUser.weeklyGoal) * 100)}%`}
              accent={colors.neon}
            />
          </View>
        </LinearGradient>
      </GlassCard>

      <View style={{ flexDirection: 'row', gap: layout.compactGutter, marginTop: layout.compactGutter }}>
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </View>

      <SectionHeader title={t('progress.volumeThisWeek')} subtitle={t('progress.volumeSubtitle')} style={{ marginTop: layout.sectionGap }} />
      <GlassCard>
        <View style={{ padding: layout.cardPadding }}>
          <View style={{ minHeight: chartHeight, flexDirection: 'row', alignItems: 'flex-end', gap: layout.compactGutter }}>
            {mockProgressWeeks.map((week) => {
              const barHeight = Math.max(layout.minTouchTarget * 0.58, (week.volume / maxVolume) * chartHeight * 0.86);

              return (
                <View key={week.label} style={{ flex: 1, alignItems: 'center', gap: layout.compactGutter }}>
                  <View
                    style={{
                      width: '100%',
                      height: barHeight,
                      borderRadius: 999,
                      backgroundColor: week.volume === maxVolume ? colors.neon : 'rgba(0,255,133,0.22)',
                      borderWidth: 1,
                      borderColor: 'rgba(0,255,133,0.24)'
                    }}
                  />
                  <AppText variant="caption" color="textMuted" numberOfLines={1}>
                    {week.label}
                  </AppText>
                </View>
              );
            })}
          </View>
        </View>
      </GlassCard>

      <SectionHeader title={t('progress.personalRecords')} subtitle={t('progress.personalRecordsSubtitle')} style={{ marginTop: layout.sectionGap }} />
      <View style={{ gap: layout.gutter }}>
        {mockPersonalRecords.map((record) => (
          <GlassCard key={record.id}>
            <View style={{ padding: layout.cardPadding, flexDirection: 'row', alignItems: 'center', gap: layout.compactGutter }}>
              <View
                style={{
                  width: layout.smallIconSize,
                  aspectRatio: 1,
                  borderRadius: radii.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.orangeSoft
                }}
              >
                <Award color={colors.orange} size={20} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="bodyStrong" numberOfLines={1}>
                  {record.lift}
                </AppText>
                <AppText variant="caption" color="textMuted" style={{ marginTop: layout.compactGutter / 2 }}>
                  Estimated 1RM
                </AppText>
              </View>
              <View style={{ alignItems: 'flex-end', maxWidth: '36%' }}>
                <AppText variant="bodyStrong" numberOfLines={1} adjustsFontSizeToFit>
                  {record.value}
                </AppText>
                <AppText variant="caption" style={{ color: colors.neon, marginTop: layout.compactGutter / 2 }} numberOfLines={1}>
                  {record.delta}
                </AppText>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>

      <SectionHeader title={t('progress.signals')} subtitle={t('progress.signalsSubtitle')} style={{ marginTop: layout.sectionGap }} />
      <View style={{ flexDirection: layout.isCompact ? 'column' : 'row', gap: layout.gutter }}>
        <SignalCard icon={<Activity color={colors.neon} size={18} />} label="HRV" value="68 ms" />
        <SignalCard icon={<Flame color={colors.orange} size={18} />} label="Load" value="High" />
        <SignalCard icon={<TrendingUp color={colors.neon} size={18} />} label="Trend" value="+9%" />
      </View>
    </ResponsiveScreen>
  );
}

function MetricCard({ metric }: { metric: (typeof mockMetrics)[number] }) {
  const layout = useResponsiveLayout();

  return (
    <GlassCard style={{ flex: 1, minWidth: 0 }}>
      <View style={{ padding: layout.compactGutter, minHeight: layout.minTouchTarget * 2.3 }}>
        <AppText variant="caption" color="textMuted" numberOfLines={2}>
          {metric.label}
        </AppText>
        <AppText variant="metric" style={{ marginTop: layout.compactGutter / 2 }} numberOfLines={1} adjustsFontSizeToFit>
          {metric.value}
        </AppText>
        <AppText variant="caption" style={{ color: colors.neon }} numberOfLines={1}>
          {metric.delta}
        </AppText>
      </View>
    </GlassCard>
  );
}

function SignalCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  const layout = useResponsiveLayout();

  return (
    <GlassCard style={{ flex: 1, minWidth: 0 }}>
      <View style={{ padding: layout.cardPadding, minHeight: layout.minTouchTarget * 2.2 }}>
        <View style={{ borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', padding: layout.compactGutter, alignSelf: 'flex-start' }}>
          {icon}
        </View>
        <AppText variant="bodyStrong" style={{ marginTop: layout.compactGutter }} numberOfLines={1}>
          {value}
        </AppText>
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </GlassCard>
  );
}
