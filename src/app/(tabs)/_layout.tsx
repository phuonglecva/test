import { Tabs } from 'expo-router';
import { Chrome, Dumbbell, House, LineChart, UserRound } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { colors } from '@/lib/theme';

function TabIcon({
  color,
  children
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color === colors.neon ? 'rgba(0,255,133,0.12)' : 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: color === colors.neon ? 'rgba(0,255,133,0.30)' : 'rgba(255,255,255,0.06)'
      }}
    >
      {children}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 14,
          height: 76,
          backgroundColor: 'rgba(15,15,15,0.92)',
          borderTopWidth: 0,
          borderRadius: 28,
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 12
        },
        tabBarActiveTintColor: colors.neon,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)'
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon color={color}>
              <House color={color} size={20} />
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon color={color}>
              <Chrome color={color} size={20} />
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon color={color}>
              <Dumbbell color={color} size={20} />
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon color={color}>
              <LineChart color={color} size={20} />
            </TabIcon>
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <TabIcon color={color}>
              <UserRound color={color} size={20} />
            </TabIcon>
          )
        }}
      />
    </Tabs>
  );
}
