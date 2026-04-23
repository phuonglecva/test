import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

export const breakpoints = {
  compactPhone: 360,
  regularPhone: 390,
  largePhone: 430,
  tablet: 600,
  wide: 900
} as const;

export const minTouchTarget = 44;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function scaleFontSize(size: number, width: number) {
  const maxScale = width >= breakpoints.tablet ? 1.14 : 1.06;
  const scale = clamp(width / breakpoints.regularPhone, 0.92, maxScale);

  return Math.round(size * scale);
}

export function createResponsiveLayout({
  width,
  height,
  insets
}: {
  width: number;
  height: number;
  insets: EdgeInsets;
}) {
  const shortestSide = Math.min(width, height);
  const isLandscape = width > height;
  const isCompact = width < breakpoints.compactPhone;
  const isTablet = shortestSide >= breakpoints.tablet;
  const isWide = width >= breakpoints.wide;
  const maxContentWidth = isTablet ? (isLandscape ? 1040 : 760) : undefined;
  const pagePadding = clamp(Math.round(width * 0.046), 16, isTablet ? 34 : 22);
  const cardPadding = clamp(Math.round(width * 0.04), 14, isTablet ? 24 : 18);
  const sectionGap = clamp(Math.round(height * 0.026), 18, 28);
  const gutter = clamp(Math.round(width * 0.028), 10, 18);
  const compactGutter = clamp(Math.round(width * 0.02), 8, 12);
  const tabBarHeight = isLandscape && !isTablet ? 66 : clamp(Math.round(height * 0.092), 76, 92);
  const tabBarBottom = Math.max(insets.bottom, 8) + 8;
  const bottomTabInset = tabBarHeight + tabBarBottom + pagePadding;
  const contentMaxWidth = maxContentWidth ?? width;
  const contentWidth = Math.min(width - pagePadding * 2, contentMaxWidth);
  const iconSize = clamp(Math.round(shortestSide * 0.12), 42, isTablet ? 58 : 50);
  const smallIconSize = clamp(Math.round(shortestSide * 0.095), 34, 44);

  return {
    width,
    height,
    shortestSide,
    isCompact,
    isLandscape,
    isTablet,
    isWide,
    maxContentWidth,
    pagePadding,
    cardPadding,
    sectionGap,
    gutter,
    compactGutter,
    tabBarHeight,
    tabBarBottom,
    bottomTabInset,
    contentWidth,
    iconSize,
    smallIconSize,
    minTouchTarget,
    safeTop: insets.top,
    safeBottom: insets.bottom
  };
}

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(
    () =>
      createResponsiveLayout({
        width,
        height,
        insets
      }),
    [height, insets, width]
  );
}
