import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChip, Distance, FloorBadge, PhotoSlot, StatusPill } from '@/components/atoms';
import { FilterSheet, SearchOverlay } from '@/components/home-search';
import { Glyph, Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { getCategories, getUnits } from '@/services/api';
import type { Category, Unit } from '@/types/database';
import { formatDistance, getDistanceKm } from '@/utils/distance';
import { openRoute } from '@/utils/navigation';

// Tapping the search bar body opens the search overlay.
// Tapping the sliders button opens the filter sheet directly.
function SearchBar({ onPress, onFilterPress }: { onPress: () => void; onFilterPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline }]}>
        <Icon.search size={18} color={theme.textSecondary} />
        <ThemedText type="body" themeColor="ink3" style={{ flex: 1 }}>
          Cari unit, gedung, atau lantai
        </ThemedText>
        <Pressable
          onPress={(e) => { e.stopPropagation(); onFilterPress(); }}
          hitSlop={8}
          style={[styles.searchSliders, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
          <Icon.sliders size={16} color={theme.textSecondary} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function StatusStrip({ error }: { error?: string }) {
  const theme = useTheme();
  const location = useLocation();

  if (error || location.error) {
    return (
      <View style={[styles.statusStrip, { backgroundColor: theme.closed + '14', borderColor: theme.closed + '33' }]}>
        <Icon.info size={16} color={theme.closed} />
        <View style={{ flex: 1 }}>
          <ThemedText type="caption" style={[styles.bold, { color: theme.closed }]}>
            Masalah GPS
          </ThemedText>
          <ThemedText type="monoMeta" themeColor="textSecondary">
            {error || location.error}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.statusStrip, { backgroundColor: theme.routeTint, borderColor: withAlpha(theme.route, 0.18) }]}>
      <Icon.locate size={16} color={theme.routeInk} />
      <View style={{ flex: 1 }}>
        <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
          Lokasi kamu
        </ThemedText>
        <ThemedText type="monoMeta" themeColor="textSecondary">
          {location.loading ? 'Mencari lokasi...' : 'GPS Aktif · Akurasi Baik'}
        </ThemedText>
      </View>
      {!location.loading && (
        <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
          Ubah
        </ThemedText>
      )}
    </View>
  );
}

function FeaturedCard({ unit, userLat, userLng, onPress }: { unit: Unit; userLat: number; userLng: number; onPress: () => void }) {
  const theme = useTheme();
  const glyphName = unit.categories?.glyph || 'dept';
  const G = Glyph[glyphName];
  const distanceKm = getDistanceKm(userLat, userLng, Number(unit.latitude), Number(unit.longitude));
  const { value: dist, unit: distUnit } = formatDistance(distanceKm);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.featured, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
        <View>
          <PhotoSlot height={120} radius={0} label={`foto · ${unit.buildings?.name.toLowerCase() || 'tempat'}`} />
          <View style={styles.catBadge}>
            <G size={12} color="#fff" />
            <ThemedText type="caption" style={[styles.catBadgeText]}>
              {unit.categories?.name}
            </ThemedText>
          </View>
          <View style={styles.featuredFloor}>
            <FloorBadge building={unit.buildings?.name || ''} floor={unit.floor} />
          </View>
        </View>
        <View style={styles.featuredBody}>
          <View style={styles.rowBetween}>
            <ThemedText type="titleM" style={{ flex: 1 }}>
              {unit.name}
            </ThemedText>
            <Distance value={dist} unit={distUnit} />
          </View>
          <View style={[styles.rowBetween, { marginTop: Spacing.two }]}>
            <View style={styles.inlineRow}>
              <StatusPill status={unit.status} />
              <ThemedText type="monoMeta" themeColor="textSecondary">
                {unit.open_hours}
              </ThemedText>
            </View>
            <Pressable 
              onPress={(e) => { e.stopPropagation(); openRoute(Number(unit.latitude), Number(unit.longitude)); }}
              style={[styles.routeChip, { backgroundColor: theme.text }]}>
              <ThemedText type="caption" style={[styles.bold, { color: theme.background }]}>
                Buka rute
              </ThemedText>
              <Icon.arrow size={12} color={theme.background} />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function UnitRow({ unit, userLat, userLng, last, onPress }: { unit: Unit; userLat: number; userLng: number; last: boolean; onPress: () => void }) {
  const theme = useTheme();
  const glyphName = unit.categories?.glyph || 'dept';
  const G = Glyph[glyphName];
  const distanceKm = getDistanceKm(userLat, userLng, Number(unit.latitude), Number(unit.longitude));
  const { value: dist, unit: distUnit } = formatDistance(distanceKm);

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
            <Distance value={dist} unit={distUnit} />
          </View>
          <View style={{ marginTop: Spacing.one }}>
            <FloorBadge building={unit.buildings?.name || ''} floor={unit.floor} compact />
          </View>
          <View style={[styles.rowBetween, { marginTop: Spacing.one }]}>
            <View style={styles.inlineRow}>
              <StatusPill status={unit.status} />
              <ThemedText type="monoMeta" themeColor="ink3">
                {unit.open_hours}
              </ThemedText>
            </View>
            <Pressable 
              onPress={(e) => { e.stopPropagation(); openRoute(Number(unit.latitude), Number(unit.longitude)); }}
              style={styles.inlineRowTight}>
              <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
                Rute
              </ThemedText>
              <Icon.chev size={11} color={theme.routeInk} />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const location = useLocation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, allUnits] = await Promise.all([getCategories(), getUnits()]);
      setCategories(cats);
      setUnits(allUnits);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => { setSearchOpen(false); setQuery(''); };
  const openFilter = () => { setSearchOpen(false); setQuery(''); setFilterOpen(true); };
  const closeFilter = () => setFilterOpen(false);

  const applyFilter = (category: string) => {
    if (category === 'all') {
      setActiveCategoryId('all');
    } else {
      const cat = categories.find(c => c.name === category);
      if (cat) setActiveCategoryId(cat.id);
    }
  };

  const sorted = [...units].sort((a, b) => {
    const distA = getDistanceKm(location.latitude, location.longitude, Number(a.latitude), Number(a.longitude));
    const distB = getDistanceKm(location.latitude, location.longitude, Number(b.latitude), Number(b.longitude));
    return distA - distB;
  });

  const visible = activeCategoryId === 'all'
    ? sorted
    : sorted.filter((u) => u.category_id === activeCategoryId);
  
  const featured = visible[0];
  const rest = visible.slice(1, 4);
  const go = (id: number) => router.push(`/unit/${id}`);

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.route} />
        <ThemedText type="caption" style={{ marginTop: Spacing.two }}>Memuat unit...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <Icon.info size={48} color={theme.closed} />
        <ThemedText type="titleM" style={{ marginTop: Spacing.two }}>{error}</ThemedText>
        <Pressable onPress={fetchInitialData} style={[styles.retryBtn, { backgroundColor: theme.route }]}>
          <ThemedText type="caption" style={[styles.bold, { color: '#fff' }]}>Coba Lagi</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        scrollEnabled={!searchOpen && !filterOpen}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.two,
          paddingBottom: BottomTabInset + Spacing.four,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.gutter}>
          <ThemedText type="monoTag" themeColor="textSecondary">
            Direktori · Kampus
          </ThemedText>
          <ThemedText type="display" style={{ marginTop: Spacing.one }}>
            {'Mau ke unit mana\nhari ini?'}
          </ThemedText>
        </View>

        {/* Search + status */}
        <View style={[styles.gutter, { gap: Spacing.three, marginTop: Spacing.three }]}>
          <SearchBar onPress={openSearch} onFilterPress={openFilter} />
          <StatusStrip />
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.chipRow, styles.gutter]}>
          <Pressable onPress={() => setActiveCategoryId('all')}>
            <CategoryChip label="Semua" glyph="all" active={activeCategoryId === 'all'} />
          </Pressable>
          {categories.map((c) => (
            <Pressable key={c.id} onPress={() => setActiveCategoryId(c.id)}>
              <CategoryChip label={c.name} glyph={c.glyph} active={c.id === activeCategoryId} />
            </Pressable>
          ))}
        </ScrollView>

        {/* List header */}
        <View style={[styles.gutter, styles.rowBetween, { marginTop: Spacing.one }]}>
          <ThemedText type="titleL">Terdekat dari kamu</ThemedText>
          <ThemedText type="monoMeta" themeColor="textSecondary">
            urut · jarak ↑
          </ThemedText>
        </View>

        {/* Unit list */}
        {featured ? (
          <View style={[styles.gutter, { marginTop: Spacing.three }]}>
            <FeaturedCard unit={featured} userLat={location.latitude} userLng={location.longitude} onPress={() => go(featured.id)} />
            <View style={{ marginTop: Spacing.two }}>
              {rest.map((u, i) => (
                <UnitRow key={u.id} unit={u} userLat={location.latitude} userLng={location.longitude} last={i === rest.length - 1} onPress={() => go(u.id)} />
              ))}
            </View>
          </View>
        ) : (
          <View style={[styles.gutter, styles.center, { marginTop: Spacing.eight }]}>
            <Icon.info size={32} color={theme.ink3} />
            <ThemedText type="body" themeColor="ink3" style={{ marginTop: Spacing.two }}>Belum ada unit di kategori ini.</ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Search overlay — absolute sibling, NOT a navigation push */}
      {searchOpen && (
        <SearchOverlay
          query={query}
          onQueryChange={setQuery}
          onClose={closeSearch}
          onOpenFilter={openFilter}
          onSelectUnit={(id) => { closeSearch(); go(id); }}
        />
      )}

      {/* Filter bottom sheet */}
      {filterOpen && (
        <FilterSheet
          initialCategory={activeCategoryId === 'all' ? 'all' : categories.find(c => c.id === activeCategoryId)?.name || 'all'}
          onClose={closeFilter}
          onApply={applyFilter}
        />
      )}
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
  center: { alignItems: 'center', justifyContent: 'center' },
  gutter: { paddingHorizontal: Spacing.four },
  bold: { fontWeight: '700' },
  pressed: { opacity: 0.7 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  inlineRowTight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
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
  retryBtn: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
});
