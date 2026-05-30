import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChip, Distance, FloorBadge, StatusPill } from '@/components/atoms';
import CampusMap from '@/components/campus-map';
import { Glyph, Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { CAMPUS_CENTER, CATEGORIES, UNITS, unitGeo } from '@/constants/units';
import { useTheme } from '@/hooks/use-theme';

function HeaderBtn({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.headerBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
      {children}
    </View>
  );
}

function FloatingActions() {
  const theme = useTheme();
  const btn = (child: React.ReactNode) => (
    <View style={[styles.fab, { backgroundColor: theme.background, borderColor: theme.hairline2 }]}>{child}</View>
  );
  return (
    <View style={styles.fabColumn} pointerEvents="box-none">
      {btn(<Icon.locate size={18} color={theme.routeInk} />)}
      {btn(<Icon.plus size={18} color={theme.text} />)}
      {btn(<Icon.minus size={18} color={theme.text} />)}
    </View>
  );
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const [activeCat, setActiveCat] = useState('Departemen');
  const visible = useMemo(
    () => (activeCat === 'all' ? UNITS : UNITS.filter((u) => u.cat === activeCat)),
    [activeCat]
  );
  const [selectedId, setSelectedId] = useState<number>(1);
  const selected = visible.find((u) => u.id === selectedId) ?? visible[0] ?? UNITS[0];

  const markers = useMemo(
    () =>
      visible.map((u) => ({
        id: String(u.id),
        title: u.short,
        ...unitGeo(u.coord),
      })),
    [visible]
  );

  const SelGlyph = Glyph[selected.glyph];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <HeaderBtn>
          <Icon.map size={16} color={theme.text} />
        </HeaderBtn>
        <View style={{ flex: 1 }}>
          <ThemedText type="monoTag" themeColor="textSecondary" style={{ letterSpacing: 1.2 }}>
            Peta · Kampus
          </ThemedText>
          <ThemedText type="titleM" style={{ fontSize: 16 }}>
            {visible.length} unit ditampilkan
          </ThemedText>
        </View>
        <HeaderBtn>
          <Icon.search size={16} color={theme.text} />
        </HeaderBtn>
      </View>

      {/* Map */}
      <View style={[styles.mapArea, { borderColor: theme.hairline }]}>
        <CampusMap
          style={StyleSheet.absoluteFillObject as any}
          markers={markers}
          center={CAMPUS_CENTER}
          zoom={16}
          selectedId={String(selectedId)}
          onMarkerClick={(id) => setSelectedId(Number(id))}
        />

        {/* Category chips overlay */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}>
          {CATEGORIES.slice(0, 6).map((c) => (
            <Pressable key={c.id} onPress={() => setActiveCat(c.id)}>
              <CategoryChip label={c.label} glyph={c.glyph} active={c.id === activeCat} compact />
            </Pressable>
          ))}
        </ScrollView>

        <FloatingActions />

        {/* Bottom sheet */}
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.background, borderColor: theme.hairline, paddingBottom: BottomTabInset + Spacing.three },
          ]}>
          <View style={[styles.handle, { backgroundColor: theme.hairline2 }]} />
          <View style={styles.sheetTop}>
            <View style={[styles.sheetGlyph, { backgroundColor: theme.routeTint, borderColor: withAlpha(theme.route, 0.18) }]}>
              <SelGlyph size={24} color={theme.routeInk} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.rowBetween}>
                <ThemedText type="monoTag" themeColor="ink3" style={{ letterSpacing: 0.8 }}>
                  {selected.cat}
                </ThemedText>
                <Distance value={selected.dist} unit={selected.distUnit} />
              </View>
              <ThemedText type="display" style={{ fontSize: 16, marginTop: 2 }}>
                {selected.name}
              </ThemedText>
              <View style={styles.sheetMeta}>
                <FloorBadge building={selected.building} floor={selected.floor} />
                <StatusPill status={selected.status} />
                <ThemedText type="monoMeta" themeColor="textSecondary">
                  {selected.hours}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.sheetButtons}>
            <Pressable
              onPress={() => router.push(`/unit/${selected.id}`)}
              style={({ pressed }) => [
                styles.sheetBtn,
                { backgroundColor: theme.background, borderColor: theme.hairline2, borderWidth: 1 },
                pressed && styles.pressed,
              ]}>
              <Icon.info size={15} color={theme.text} />
              <ThemedText type="caption" style={styles.bold}>
                Detail
              </ThemedText>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.sheetBtn, styles.sheetBtnPrimary, { backgroundColor: theme.route }, pressed && styles.pressed]}>
              <Icon.map size={15} color="#fff" />
              <ThemedText type="caption" style={[styles.bold, { color: '#fff' }]}>
                Buka Rute
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

function withAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bold: { fontWeight: '700' },
  pressed: { opacity: 0.7 },
  rowBetween: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: Spacing.two },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapArea: { flex: 1, borderTopWidth: 1, position: 'relative', overflow: 'hidden' },
  chipScroll: { position: 'absolute', top: Spacing.three, left: 0, right: 0 },
  chipRow: { gap: 6, paddingHorizontal: Spacing.three },
  fabColumn: { position: 'absolute', right: Spacing.three, top: 56, gap: Spacing.two },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#141e19',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  handle: { width: 40, height: 4, borderRadius: 999, alignSelf: 'center', marginBottom: Spacing.three },
  sheetTop: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  sheetGlyph: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.two, flexWrap: 'wrap' },
  sheetButtons: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  sheetBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  sheetBtnPrimary: { flex: 1.4 },
});
