import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '@/lib/theme';
import { AppText } from './app-text';

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress: number;
  label: string;
  value: string;
  accent?: string;
};

export function ProgressRing({
  size = 122,
  strokeWidth = 12,
  progress,
  label,
  value,
  accent = colors.neon,
}: ProgressRingProps) {
  const safeProgress = Number.isFinite(progress)
    ? Math.max(0, Math.min(progress, 1))
    : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - safeProgress);

  const valueFontSize = size > 100 ? 28 : 22;
  const labelFontSize = size > 100 ? 12 : 11;
  const contentWidth = size - strokeWidth * 4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accent}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          originX={size / 2}
          originY={size / 2}
          rotation={-90}
        />
      </Svg>

      <View pointerEvents="none" style={styles.centerOverlay}>
        <View
          style={[
            styles.textWrap,
            {
              width: contentWidth,
            },
          ]}
        >
          <AppText
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={{
              color: colors.text,
              fontFamily: typography.title,
              fontSize: valueFontSize,
              lineHeight: valueFontSize,
              textAlign: 'center',
              includeFontPadding: false,
            }}
          >
            {value}
          </AppText>

          <AppText
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            variant="caption"
            style={{
              color: colors.textMuted,
              fontFamily: typography.body,
              fontSize: labelFontSize,
              lineHeight: labelFontSize + 2,
              textAlign: 'center',
              includeFontPadding: false,
              marginTop: 2,
            }}
          >
            {label}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});