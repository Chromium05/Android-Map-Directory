import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChip, Distance, FloorBadge, StatusPill } from '@/components/atoms';
import CampusMap from '@/components/campus-map';
import { Glyph, Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { CAMPUS_CENTER } from '@/constants/units';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { getCategories, getUnits } from '@/services/api';
import type { Category, Unit } from '@/types/database';
import { formatDistance, getDistanceKm } from '@/utils/distance';
import { formatHoursRange } from '@/utils/time';
import { openRoute } from '@/utils/navigation';

function HeaderBtn({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.headerBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
      {children}
    </View>
  );
}

function FloatingActions({ onLocate, onZoomIn, onZoomOut }: { onLocate: () => void, onZoomIn: () => void, onZoomOut: () => void }) {
  const theme = useTheme();
  
  const Fab = ({ children, onPress }: { children: React.ReactNode; onPress: () => void }) => (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab, 
        { backgroundColor: theme.background, borderColor: theme.hairline2 },
        pressed && styles.pressed
      ]}>
      {children}
    </Pressable>
  );

  return (
    <View style={styles.fabColumn} pointerEvents="box-none">
      <Fab onPress={onLocate}>
        <Icon.locate size={18} color={theme.routeInk} />
      </Fab>
      <Fab onPress={onZoomIn}>
        <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>+</ThemedText>
      </Fab>
      <Fab onPress={onZoomOut}>
        <ThemedText style={{ fontSize: 18, fontWeight: '700' }}>-</ThemedText>
      </Fab>
    </View>
  );
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const location = useLocation();
  const params = useLocalSearchParams<{ focusUnitId?: string }>();


  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCat, setActiveCat] = useState('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mapZoom, setMapZoom] = useState(16);
  const [mapCenter, setMapCenter] = useState(CAMPUS_CENTER);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!params.focusUnitId || units.length === 0) return;
    const target = units.find((u) => String(u.id) === params.focusUnitId);
    if (target) {
      setActiveCat('all');
      setSelectedId(target.id);
      setMapCenter({ latitude: Number(target.lat), longitude: Number(target.lng) });
      setMapZoom(18);
    }
  }, [params.focusUnitId, units]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, allUnits] = await Promise.all([getCategories(), getUnits()]);
      setCategories(cats);
      setUnits(allUnits);
      if (allUnits.length > 0) setSelectedId(allUnits[0].id);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data peta');
    } finally {
      setLoading(false);
    }
  };

  const visible = useMemo(
    () => (activeCat === 'all' ? units : units.filter((u) => u.categories?.name === activeCat)),
    [activeCat, units]
  );
  
  const selected = useMemo(
    () => units.find((u) => u.id === selectedId) || units[0],
    [selectedId, units]
  );

  const markers = useMemo(
    () =>
      visible.map((u) => ({
        id: String(u.id),
        title: u.name,
        subtitle: `${u.buildings?.name || ''} · ${u.floor}`,
        latitude: Number(u.lat),
        longitude: Number(u.lng),
        glyph: u.categories?.glyph || 'dept',
      })),
    [visible]
  );

  const handleLocate = () => {
    if (location.granted) {
      setMapCenter({ latitude: location.latitude, longitude: location.longitude });
    } else {
      setMapCenter(CAMPUS_CENTER);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.route} />
        <ThemedText type="caption" style={{ marginTop: Spacing.two }}>Memuat peta...</ThemedText>
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

  const SelGlyph = Glyph[selected?.categories?.glyph || 'dept'];
  const distanceKm = selected ? getDistanceKm(location.latitude, location.longitude, Number(selected.lat), Number(selected.lng)) : 0;
  const { value: dist, unit: distUnit } = formatDistance(distanceKm);

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
          center={mapCenter}
          userLocation={location.granted ? { latitude: location.latitude, longitude: location.longitude, heading: location.heading } : undefined}
          zoom={mapZoom}
          selectedId={String(selectedId)}
          onMarkerClick={(id) => setSelectedId(Number(id))}
        />

        {/* Category chips overlay */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}>
          <Pressable onPress={() => setActiveCat('all')}>
            <CategoryChip label="Semua" glyph="all" active={activeCat === 'all'} compact />
          </Pressable>
          {categories.map((c) => (
            <Pressable key={c.id} onPress={() => setActiveCat(c.name)}>
              <CategoryChip label={c.name} glyph={c.glyph} active={c.name === activeCat} compact />
            </Pressable>
          ))}
        </ScrollView>

        <FloatingActions 
          onLocate={handleLocate}
          onZoomIn={() => setMapZoom(z => Math.min(z + 1, 19))}
          onZoomOut={() => setMapZoom(z => Math.max(z - 1, 10))}
        />

        {/* Bottom sheet */}
        {selected && (
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
                    {selected.categories?.name}
                  </ThemedText>
                  <Distance value={dist} unit={distUnit}/>
                </View>
                <ThemedText type="display" style={{ fontSize: 16, marginTop: 2 }}>
                  {selected.name}
                </ThemedText>
                <View style={styles.sheetMeta}>
                  <FloorBadge building={selected.buildings?.name || ''} floor={selected.floor} />
                  <StatusPill status={selected.status} />
                  <ThemedText type="monoMeta" themeColor="textSecondary">
                    {formatHoursRange(selected.open_hours, selected.close_hours)}
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
              <Pressable 
                onPress={() => openRoute(Number(selected.lat), Number(selected.lng))}
                style={({ pressed }) => [styles.sheetBtn, styles.sheetBtnPrimary, { backgroundColor: theme.route }, pressed && styles.pressed]}>
                <Icon.map size={15} color="#fff" />
                <ThemedText type="caption" style={[styles.bold, { color: '#fff' }]}>
                  Buka Rute
                </ThemedText>
              </Pressable>
            </View>
          </View>
        )}
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
  center: { alignItems: 'center', justifyContent: 'center' },
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
  retryBtn: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
});
