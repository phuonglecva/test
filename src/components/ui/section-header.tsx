import { Text, View } from 'react-native';
import { colors, typography } from '@/lib/theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
};

export function SectionHeader({ title, subtitle, actionLabel }: SectionHeaderProps) {
  return (
    <View className="mb-4 flex-row items-end justify-between">
      <View className="flex-1 pr-4">
        <Text style={{ color: colors.text, fontFamily: typography.subtitle, fontSize: 18 }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 13, marginTop: 4 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel ? (
        <Text style={{ color: colors.neon, fontFamily: typography.subtitle, fontSize: 13 }}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}
