import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  // normalize scheme to 'light' or 'dark' (react-native may return null/undefined or values like 'no-preference')
  const normalizedScheme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[normalizedScheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <Label>Beranda</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="peta">
        <Label>Peta</Label>
        <Icon sf={{ default: 'map', selected: 'map.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="info">
        <Label>Info</Label>
        <Icon sf={{ default: 'info.circle', selected: 'info.circle.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
