import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function PetaScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: safeAreaInsets.top + Spacing.four }]}>
        <ThemedText type="titleM">Peta Kampus</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          N unit ditemukan
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.mapPlaceholder}>
        <ThemedText themeColor="ink3">MAP CANVAS PLACEHOLDER</ThemedText>
        <ThemedText type="small" themeColor="ink3">
          📍📍📍
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.bottomSheetPlaceholder}>
        <ThemedView style={styles.dragHandle} />
        <ThemedView style={styles.sheetContent}>
          <ThemedText type="monoTag" themeColor="textSecondary">
            DEPARTEMEN · 120 m
          </ThemedText>
          <ThemedText type="titleM">Dept. Teknik Informatika</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            G. TI | Lt. 3 ● Buka 08-16
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    borderBottomWidth: 1,
    borderColor: Colors.light.hairline,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  bottomSheetPlaceholder: {
    height: 180,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.hairline,
    marginBottom: BottomTabInset,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.hairline2,
    borderRadius: Radius.pill,
    alignSelf: 'center',
  },
  sheetContent: {
    gap: Spacing.one,
  },
});
