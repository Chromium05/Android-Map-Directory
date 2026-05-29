import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChip, Distance, FloorBadge, PhotoSlot, StatusPill } from '@/components/atoms';
import { Glyph, Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { byDistance, CATEGORIES, UNITS, type Unit } from '@/constants/units';
import { useTheme } from '@/hooks/use-theme';

function SearchBar() {
  const theme = useTheme();
  return (
    <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline }]}>
      <Icon.search size={18} color={theme.textSecondary} />
      <ThemedText type="body" themeColor="ink3" style={{ flex: 1 }}>
        Cari unit, gedung, atau lantai
      </ThemedText>
      <View style={[styles.searchSliders, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
        <Icon.sliders size={16} color={theme.textSecondary} />
      </View>
    </View>
  );
}

function StatusStrip() {
  const theme = useTheme();
  return (
    <View style={[styles.statusStrip, { backgroundColor: theme.routeTint, borderColor: withAlpha(theme.route, 0.18) }]}>
      <Icon.locate size={16} color={theme.routeInk} />
      <View style={{ flex: 1 }}>
        <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
          Lokasi kamu
        </ThemedText>
        <ThemedText type="monoMeta" themeColor="textSecondary">
          Gedung Pusat · Lt. 1 · Lobi Utama
        </ThemedText>
      </View>
      <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
        Ubah
      </ThemedText>
    </View>
  );
}

function FeaturedCard({ unit, onPress }: { unit: Unit; onPress: () => void }) {
  const theme = useTheme();
  const G = Glyph[unit.glyph];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.featured, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
        <View>
          <PhotoSlot height={120} radius={0} label={`foto · ${unit.building.toLowerCase()}`} />
          <View style={styles.catBadge}>
            <G size={12} color="#fff" />
            <ThemedText type="caption" style={[styles.catBadgeText]}>
              {unit.cat}
            </ThemedText>
          </View>
          <View style={styles.featuredFloor}>
            <FloorBadge building={unit.building} floor={unit.floor} />
          </View>
        </View>
        <View style={styles.featuredBody}>
          <View style={styles.rowBetween}>
            <ThemedText type="titleM" style={{ flex: 1 }}>
              {unit.name}
            </ThemedText>
            <Distance value={unit.dist} unit={unit.distUnit} />
          </View>
          <View style={[styles.rowBetween, { marginTop: Spacing.two }]}>
            <View style={styles.inlineRow}>
              <StatusPill status={unit.status} />
              <ThemedText type="monoMeta" themeColor="textSecondary">
                {unit.hours}
              </ThemedText>
            </View>
            <View style={[styles.routeChip, { backgroundColor: theme.text }]}>
              <ThemedText type="caption" style={[styles.bold, { color: theme.background }]}>
                Buka rute
              </ThemedText>
              <Icon.arrow size={12} color={theme.background} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function UnitRow({ unit, last, onPress }: { unit: Unit; last: boolean; onPress: () => void }) {
  const theme = useTheme();
  const G = Glyph[unit.glyph];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.row, !last && { borderBottomWidth: 1, borderColor: theme.hairline }]}>
        <View style={[styles.rowGlyph, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline }]}>
          <G size={26} color={theme.routeInk} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.rowBetween}>
            <ThemedText type="titleM" numberOfLines={1} style={{ flex: 1 }}>
              {unit.name}
            </ThemedText>
            <Distance value={unit.dist} unit={unit.distUnit} />
          </View>
          <View style={{ marginTop: Spacing.one }}>
            <FloorBadge building={unit.building} floor={unit.floor} compact />
          </View>
          <View style={[styles.rowBetween, { marginTop: Spacing.one }]}>
            <View style={styles.inlineRow}>
              <StatusPill status={unit.status} />
              <ThemedText type="monoMeta" themeColor="ink3">
                {unit.hours}
              </ThemedText>
            </View>
            <View style={styles.inlineRowTight}>
              <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
                Rute
              </ThemedText>
              <Icon.chev size={11} color={theme.routeInk} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const sorted = [...UNITS].sort(byDistance);
  const featured = sorted[0];
  const rest = sorted.slice(1, 4);
  const go = (id: number) => router.push(`/unit/${id}`);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.two,
          paddingBottom: BottomTabInset + Spacing.four,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, styles.gutter]}>
          <View style={{ flex: 1 }}>
            <ThemedText type="monoTag" themeColor="textSecondary">
              Direktori · Kampus
            </ThemedText>
            <ThemedText type="display" style={{ marginTop: Spacing.one }}>
              Mau ke unit mana hari ini?
            </ThemedText>
          </View>
          <View style={[styles.avatar, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
            <ThemedText type="defaultSemiBold">R</ThemedText>
          </View>
        </View>

        {/* Body */}
        <View style={[styles.gutter, { gap: Spacing.three, marginTop: Spacing.three }]}>
          <SearchBar />
          <StatusStrip />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.chipRow, styles.gutter]}>
          {CATEGORIES.map((c) => (
            <CategoryChip key={c.id} label={c.label} glyph={c.glyph} active={c.id === 'Departemen'} />
          ))}
        </ScrollView>

        <View style={[styles.gutter, styles.rowBetween, { marginTop: Spacing.one }]}>
          <ThemedText type="titleL">Terdekat dari kamu</ThemedText>
          <ThemedText type="monoMeta" themeColor="textSecondary">
            urut · jarak ↑
          </ThemedText>
        </View>

        <View style={[styles.gutter, { marginTop: Spacing.three }]}>
          <FeaturedCard unit={featured} onPress={() => go(featured.id)} />
          <View style={{ marginTop: Spacing.two }}>
            {rest.map((u, i) => (
              <UnitRow key={u.id} unit={u} last={i === rest.length - 1} onPress={() => go(u.id)} />
            ))}
          </View>
        </View>
      </ScrollView>
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
  gutter: { paddingHorizontal: Spacing.four },
  bold: { fontWeight: '700' },
  pressed: { opacity: 0.7 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  inlineRowTight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    height: 48,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  searchSliders: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  chipRow: { gap: Spacing.two, marginTop: Spacing.three },
  featured: { borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  catBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20,25,22,0.78)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  catBadgeText: { color: '#fff', fontWeight: '600' },
  featuredFloor: { position: 'absolute', bottom: 10, right: 10 },
  featuredBody: { padding: Spacing.three, paddingTop: Spacing.three },
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  row: { flexDirection: 'row', gap: Spacing.three, paddingVertical: Spacing.three },
  rowGlyph: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
