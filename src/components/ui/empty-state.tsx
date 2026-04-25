import type { ReactNode } from 'react';
import { View } from 'react-native';
import { colors, radii } from '@/lib/theme';
import { useResponsiveLayout } from '@/lib/responsive';
import { AppText } from './app-text';

export function EmptyState({
  icon,
  title,
  body
}: {
  icon?: ReactNode;
  title: string;
  body: string;
}) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={{
        minHeight: layout.minTouchTarget * 2.4,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        backgroundColor: 'rgba(255,255,255,0.04)',
        padding: layout.cardPadding,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {icon ? <View style={{ marginBottom: layout.compactGutter }}>{icon}</View> : null}
      <AppText variant="bodyStrong" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText variant="body" color="textMuted" style={{ marginTop: layout.compactGutter / 2, textAlign: 'center' }}>
        {body}
      </AppText>
    </View>
  );
}
