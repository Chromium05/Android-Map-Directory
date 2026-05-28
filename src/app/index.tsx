import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: safeAreaInsets.top + Spacing.four,
          paddingHorizontal: Spacing.four,
          paddingBottom: BottomTabInset + Spacing.four,
        }}>
        <ThemedView style={styles.header}>
          <ThemedText type="monoTag" themeColor="textSecondary">
            DIREKTORI · KAMPUS
          </ThemedText>
          <ThemedText type="display" style={styles.title}>
            Mau ke unit mana hari ini?
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.searchBar}>
          <ThemedText themeColor="ink3">🔍 Cari unit, gedung, atau lantai</ThemedText>
        </ThemedView>

        <ThemedView
          style={[styles.statusStrip, { backgroundColor: Colors.light.routeTint }]}>
          <ThemedText type="caption" themeColor="routeInk">
            📍 Lokasi kamu
          </ThemedText>
          <ThemedText type="caption" themeColor="route" style={{ fontWeight: '700' }}>
            [Ubah]
          </ThemedText>
        </ThemedView>

        <ThemedText type="titleL" style={{ marginTop: Spacing.six }}>
          Terdekat dari kamu
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.featuredCard}>
          <ThemedView style={styles.placeholderPhoto}>
            <ThemedText type="monoMeta" themeColor="ink3">
              PHOTO PLACEHOLDER
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.cardContent}>
            <ThemedText type="monoTag" themeColor="textSecondary">
              DEPARTEMEN · GEDUNG TI
            </ThemedText>
            <ThemedText type="titleM">Kantin Pusat A</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              ● Buka 07–17 · 120m
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.six,
  },
  title: {
    maxWidth: 240,
  },
  searchBar: {
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.hairline,
  },
  statusStrip: {
    marginTop: Spacing.three,
    height: 34,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
  },
  featuredCard: {
    marginTop: Spacing.four,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.hairline,
  },
  placeholderPhoto: {
    height: 120,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: Spacing.four,
    gap: Spacing.one,
  },
});
