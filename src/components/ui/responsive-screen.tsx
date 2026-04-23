import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import { gradients, colors } from '@/lib/theme';
import { useResponsiveLayout } from '@/lib/responsive';

type ResponsiveScreenProps = PropsWithChildren<{
  bottomInset?: 'tabs' | 'none';
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  floating?: ReactNode;
  keyboardAware?: boolean;
  scroll?: boolean;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
}>;

export function ResponsiveScreen({
  bottomInset = 'tabs',
  children,
  contentContainerStyle,
  contentStyle,
  floating,
  keyboardAware = false,
  scroll = true,
  scrollProps
}: ResponsiveScreenProps) {
  const layout = useResponsiveLayout();
  const bottomPadding =
    bottomInset === 'tabs'
      ? layout.bottomTabInset
      : layout.safeBottom + layout.pagePadding;

  const baseContentStyle: ViewStyle = {
    width: '100%',
    maxWidth: layout.maxContentWidth ? layout.maxContentWidth + layout.pagePadding * 2 : undefined,
    alignSelf: 'center',
    paddingHorizontal: layout.pagePadding,
    paddingTop: layout.safeTop + layout.pagePadding,
    paddingBottom: bottomPadding
  };

  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
      {...scrollProps}
      contentContainerStyle={[baseContentStyle, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[baseContentStyle, { flex: 1 }, contentContainerStyle]}>{children}</View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, contentStyle]}>
      <LinearGradient colors={gradients.hero as unknown as [string, string, string]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          enabled={keyboardAware}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={layout.safeTop}
          style={{ flex: 1 }}
        >
          {content}
        </KeyboardAvoidingView>
        {floating}
      </LinearGradient>
    </View>
  );
}
