import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function InfoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingTop: safeAreaInsets.top + Spacing.six,
        paddingHorizontal: Spacing.four,
        paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.four,
      }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Info Aplikasi</ThemedText>
        <ThemedText type="subtitle" themeColor="textSecondary">
          Tentang & Kategori
        </ThemedText>
        
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="defaultSemiBold">Direktori Kampus</ThemedText>
          <ThemedText type="small">Android Map Directory v1.0</ThemedText>
          <ThemedText type="default" style={{ marginTop: Spacing.two }}>
            Aplikasi direktori berbasis peta untuk memudahkan pencarian unit di kampus.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  card: {
    marginTop: Spacing.four,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
});
