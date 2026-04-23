import type { PropsWithChildren } from 'react';
import { Text, useWindowDimensions, type TextProps, type TextStyle } from 'react-native';
import { scaleFontSize } from '@/lib/responsive';
import { colors, typography } from '@/lib/theme';

type TextVariant =
  | 'eyebrow'
  | 'caption'
  | 'body'
  | 'bodyStrong'
  | 'title'
  | 'headline'
  | 'metric';

type AppTextProps = PropsWithChildren<
  TextProps & {
    color?: keyof typeof colors | string;
    variant?: TextVariant;
  }
>;

const variants: Record<TextVariant, TextStyle> = {
  eyebrow: {
    fontFamily: typography.subtitle,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  caption: {
    fontFamily: typography.body,
    fontSize: 12,
    lineHeight: 17
  },
  body: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21
  },
  bodyStrong: {
    fontFamily: typography.subtitle,
    fontSize: 14,
    lineHeight: 20
  },
  title: {
    fontFamily: typography.title,
    fontSize: 22,
    lineHeight: 28
  },
  headline: {
    fontFamily: typography.title,
    fontSize: 30,
    lineHeight: 36
  },
  metric: {
    fontFamily: typography.title,
    fontSize: 26,
    lineHeight: 31
  }
};

const scalableTextFields = ['fontSize', 'lineHeight'] as const;

function scaleTextStyle(style: TextStyle, width: number) {
  return scalableTextFields.reduce<TextStyle>(
    (scaledStyle, field) => {
      const value = style[field];

      if (typeof value === 'number') {
        scaledStyle[field] = scaleFontSize(value, width);
      }

      return scaledStyle;
    },
    { ...style }
  );
}

function resolveColor(color: AppTextProps['color']) {
  if (!color) {
    return colors.text;
  }

  return color in colors ? colors[color as keyof typeof colors] : color;
}

export function AppText({
  children,
  color = 'text',
  variant = 'body',
  style,
  ...props
}: AppTextProps) {
  const { width } = useWindowDimensions();
  const variantStyle = scaleTextStyle(variants[variant], width);

  return (
    <Text
      maxFontSizeMultiplier={1.15}
      {...props}
      style={[
        {
          color: resolveColor(color)
        },
        variantStyle,
        style
      ]}
    >
      {children}
    </Text>
  );
}
