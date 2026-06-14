import { Tabs } from 'expo-router';
import React from 'react';

import { Icon } from '@/components/icons';
import { Colors, Font } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.hairline,
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Font.sans['600'],
          fontSize: 11,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Icon.homeFill size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="peta"
        options={{
          title: 'Peta',
          tabBarIcon: ({ color, focused }) => (
            <Icon.map size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color, focused }) => (
            <Icon.info size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
