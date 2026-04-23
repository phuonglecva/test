import { Tabs } from 'expo-router';
import { BookOpen, Dumbbell, House, LineChart, UserRound } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useResponsiveLayout } from '@/lib/responsive';
import { colors, shadows } from '@/lib/theme';

type TabIconProps = {
  color: string;
  focused: boolean;
  children: (color: string) => ReactNode;
};

function TabIcon({ color, focused, children }: TabIconProps) {
  const layout = useResponsiveLayout();
  const size = layout.isLandscape && !layout.isTablet ? 34 : 38;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? colors.neonSoft : 'transparent',
        borderWidth: focused ? 1 : 0,
        borderColor: 'rgba(0,255,133,0.28)'
      }}
    >
      {children(color)}
    </View>
  );
}

export default function TabsLayout() {
  const layout = useResponsiveLayout();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          left: layout.pagePadding,
          right: layout.pagePadding,
          bottom: layout.tabBarBottom,
          height: layout.tabBarHeight,
          backgroundColor: 'rgba(9, 12, 10, 0.96)',
          borderTopWidth: 0,
          borderRadius: 28,
          paddingHorizontal: layout.compactGutter,
          paddingTop: layout.compactGutter,
          paddingBottom: layout.compactGutter,
          ...shadows.glass
        },
        tabBarItemStyle: {
          borderRadius: 22
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          marginTop: 0
        },
        tabBarActiveTintColor: colors.neon,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.48)'
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused}>
              {(iconColor) => <House color={iconColor} size={20} strokeWidth={2.4} />}
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused}>
              {(iconColor) => <BookOpen color={iconColor} size={20} strokeWidth={2.4} />}
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="train/index"
        options={{
          title: 'Train',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused}>
              {(iconColor) => <Dumbbell color={iconColor} size={20} strokeWidth={2.4} />}
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="progress/index"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused}>
              {(iconColor) => <LineChart color={iconColor} size={20} strokeWidth={2.4} />}
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused}>
              {(iconColor) => <UserRound color={iconColor} size={20} strokeWidth={2.4} />}
            </TabIcon>
          )
        }}
      />
    </Tabs>
  );
}
