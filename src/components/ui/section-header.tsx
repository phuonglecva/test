import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/lib/theme';
import { useResponsiveLayout } from '@/lib/responsive';
import { AppText } from './app-text';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({ title, subtitle, actionLabel, onActionPress, style }: SectionHeaderProps) {
  const layout = useResponsiveLayout();

  return (
    <View
      style={[
        {
          marginBottom: layout.compactGutter,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: layout.compactGutter
        },
        style
      ]}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText variant="title" style={{ color: colors.text }} numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" style={{ color: colors.textMuted, marginTop: layout.compactGutter / 2 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel ? (
        <Pressable hitSlop={10} onPress={onActionPress}>
          <AppText variant="bodyStrong" style={{ color: colors.neon }} numberOfLines={1}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
