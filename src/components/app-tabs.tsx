import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icons';
import { Colors, Font } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.route,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.hairline,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Font.sans['600'],
          fontSize: 11,
        },
        tabBarItemStyle: {
          marginHorizontal: 8,
          borderRadius: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            focused ? <Icon.homeFill size={24} color={color} /> : <Icon.home size={24} color={color} />
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


