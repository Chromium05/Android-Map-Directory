import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Distance } from '@/components/atoms';
import { Glyph, Icon } from '@/components/icons';
import { Font, Radius, Spacing } from '@/constants/theme';
import { CATEGORIES, UNITS } from '@/constants/units';
import { useTheme } from '@/hooks/use-theme';
import type { Unit } from '@/types/database';
import { formatDistance, getDistanceKm } from '@/utils/distance';

// ─── helpers ──────────────────────────────────────────────────────────────────

function filterUnits(query: string, units: Unit[]): Unit[] {
  const q = query.toLowerCase().trim();
  if (!q) return units.slice(0, 3);
  return units.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      (u.buildings?.name || '').toLowerCase().includes(q) ||
      u.short_name.toLowerCase().includes(q) ||
      (u.categories?.name || '').toLowerCase().includes(q),
  ).slice(0, 4);
}

function withAlpha(hex: string, alpha: number) {
  return hex + Math.round(alpha * 255).toString(16).padStart(2, '0');
}

// ─── shared sub-components ────────────────────────────────────────────────────

function PanelLabel({ children, right }: { children: string; right?: string }) {
  const theme = useTheme();
  return (
    <View style={s.labelRow}>
      <Text style={[s.labelText, { color: theme.ink3 }]}>{children}</Text>
      {right ? <Text style={[s.labelRight, { color: theme.routeInk }]}>{right}</Text> : null}
    </View>
  );
}

function RecentChip({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View style={[s.recentChip, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
      <Icon.search size={12} color={theme.ink3} />
      <Text style={[s.recentChipText, { color: theme.text }]}>{label}</Text>
    </View>
  );
}

function SuggestRow({ unit, distanceKm, last, onPress }: { unit: Unit; distanceKm: number; last: boolean; onPress: () => void }) {
  const theme = useTheme();
  const glyphName = unit.categories?.glyph || 'dept';
  const G = Glyph[glyphName];
  const { value: dist, unit: distUnit } = formatDistance(distanceKm);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && s.pressed}>
      <View style={[s.suggestRow, !last && { borderBottomWidth: 1, borderColor: theme.hairline }]}>
        <View style={[s.suggestGlyph, { backgroundColor: theme.routeTint, borderColor: withAlpha(theme.route, 0.18) }]}>
          <G size={19} color={theme.routeInk} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[s.suggestName, { color: theme.text }]} numberOfLines={1}>
            {unit.name}
          </Text>
          <View style={s.suggestMeta}>
            <Text style={[s.metaBuilding, { color: theme.text }]}>{unit.buildings?.name || ''}</Text>
            <View style={[s.tinyDot, { backgroundColor: theme.ink3 }]} />
            <Text style={[s.metaFloor, { color: theme.routeInk }]}>{unit.floor}</Text>
            <View style={[s.tinyDot, { backgroundColor: theme.ink3 }]} />
            <Text style={[s.metaCat, { color: theme.textSecondary }]}>{unit.categories?.name}</Text>
          </View>
        </View>
        <Distance value={dist} unit={distUnit} />
      </View>
    </Pressable>
  );
}

function FloatingMenu({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[s.floatingMenu, { backgroundColor: theme.background, borderColor: theme.hairline2 }]}>
      {children}
    </View>
  );
}

// ─── SearchOverlay ────────────────────────────────────────────────────────────
// Implements two states from home-search.jsx:
//   State A (query = ''): scrim + active field + recents + suggestions
//   State B (query ≠ ''): scrim + active field + live filtered results
//
// Rendered as a sibling to the ScrollView inside HomeScreen, NOT as a navigation
// push. HomeScreen owns searchOpen / query state.

export type SearchOverlayProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
  onOpenFilter: () => void;
  onSelectUnit: (id: number) => void;
  units: Unit[];
  userLat: number;
  userLng: number;
};

export function SearchOverlay({
  query,
  onQueryChange,
  onClose,
  onOpenFilter,
  onSelectUnit,
  units,
  userLat,
  userLng,
}: SearchOverlayProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const hasQuery = query.trim().length > 0;
  const results = filterUnits(query, units);
  const RECENTS = ['PAA TI', 'Lab Komputasi', 'Vokasi'];

  return (
    <View style={[StyleSheet.absoluteFill, s.overlayRoot]}>
      {/* Scrim — tap to dismiss */}
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,28,24,0.38)' }]}
        onPress={onClose}
      />

      {/* Floating panel — active field + dropdown menu */}
      <View style={[s.overlayPanel, { top: insets.top + Spacing.two }]}>
        {/* Active search field */}
        <View style={s.fieldRow}>
          <View style={[s.fieldWrap, { backgroundColor: theme.background, borderColor: theme.text }]}>
            <Icon.search size={18} color={hasQuery ? theme.text : theme.textSecondary} />
            <TextInput
              value={query}
              onChangeText={onQueryChange}
              placeholder="Cari unit, gedung, atau lantai"
              placeholderTextColor={theme.ink3}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              style={[s.fieldInput, { color: theme.text, fontFamily: Font.sans['600'] }]}
            />
            {hasQuery ? (
              <Pressable
                onPress={() => onQueryChange('')}
                hitSlop={8}
                style={[s.clearBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
                <Icon.x size={12} color={theme.textSecondary} />
              </Pressable>
            ) : (
              <>
                <View style={[s.vDivider, { backgroundColor: theme.hairline2 }]} />
                <Pressable
                  onPress={onOpenFilter}
                  hitSlop={8}
                  style={[s.slidersBtn, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
                  <Icon.sliders size={16} color={theme.textSecondary} />
                </Pressable>
              </>
            )}
          </View>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={[s.cancelText, { color: theme.text }]}>Batal</Text>
          </Pressable>
        </View>

        {/* Floating menu card */}
        <FloatingMenu>
          {hasQuery ? (
            // State B — live results
            <>
              <PanelLabel right={`${results.length} hasil`}>{`Hasil untuk "${query}"`}</PanelLabel>
              <View>
                {results.map((u, i) => (
                  <SuggestRow
                    key={u.id}
                    unit={u}
                    distanceKm={getDistanceKm(userLat, userLng, Number(u.lat), Number(u.lng))}
                    last={i === results.length - 1}
                    onPress={() => {
                      onClose();
                      onSelectUnit(u.id);
                    }}
                  />
                ))}
              </View>
              <Pressable
                style={({ pressed }) => [
                  s.viewMapBtn,
                  { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 },
                  pressed && s.pressed,
                ]}>
                <Icon.map size={15} color={theme.text} />
                <Text style={[s.viewMapText, { color: theme.text }]}>{`Lihat "${query}" di peta`}</Text>
              </Pressable>
            </>
          ) : (
            // State A — recents + suggestions
            <>
              <View style={s.menuSection}>
                <PanelLabel right="Hapus">Terakhir dicari</PanelLabel>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.recentsRow}>
                  {RECENTS.map((r) => (
                    <RecentChip key={r} label={r} />
                  ))}
                </ScrollView>
              </View>
              <View style={s.menuSection}>
                <PanelLabel>Saran untukmu</PanelLabel>
                <View>
                  {results.map((u, i) => (
                    <SuggestRow
                      key={u.id}
                      unit={u}
                      distanceKm={getDistanceKm(userLat, userLng, Number(u.lat), Number(u.lng))}
                      last={i === results.length - 1}
                      onPress={() => {
                        onClose();
                        onSelectUnit(u.id);
                      }}
                    />
                  ))}
                </View>
              </View>
            </>
          )}
        </FloatingMenu>
      </View>
    </View>
  );
}

// ─── FilterSheet ──────────────────────────────────────────────────────────────
// State C from home-search.jsx: bottom sheet that floats up over home content.
// Internal state for selected categories + quick filters.
// Calls onApply(category) when the CTA is pressed.

const QUICK_FILTERS = [
  { id: 'open_now', label: 'Buka sekarang' },
  { id: 'near', label: '< 300 m' },
  { id: 'lift', label: 'Ada lift' },
  { id: 'photo', label: 'Punya foto' },
] as const;

export type FilterSheetProps = {
  initialCategory: string;
  onClose: () => void;
  onApply: (category: string) => void;
};

export function FilterSheet({ initialCategory, onClose, onApply }: FilterSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [quickOn, setQuickOn] = useState<Set<string>>(new Set(['open_now']));

  const toggleQuick = (id: string) =>
    setQuickOn((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filteredCount = UNITS.filter((u) => {
    if (selectedCat !== 'all' && u.cat !== selectedCat) return false;
    if (quickOn.has('open_now') && u.status !== 'open') return false;
    if (quickOn.has('near') && !(u.distUnit === 'm' && parseFloat(u.dist) < 300)) return false;
    return true;
  }).length;

  const cats = CATEGORIES.slice(1);

  return (
    <View style={[StyleSheet.absoluteFill, s.overlayRoot]}>
      {/* Scrim */}
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,28,24,0.42)' }]}
        onPress={onClose}
      />

      {/* Sheet */}
      <View
        style={[
          s.sheet,
          { backgroundColor: theme.background, paddingBottom: insets.bottom + Spacing.four },
        ]}>
        <View style={[s.handle, { backgroundColor: theme.hairline2 }]} />

        <View style={s.sheetHeader}>
          <Text style={[s.sheetTitle, { color: theme.text }]}>Filter</Text>
          <Pressable
            onPress={() => {
              setSelectedCat('all');
              setQuickOn(new Set());
            }}>
            <Text style={[s.resetText, { color: theme.routeInk }]}>Reset</Text>
          </Pressable>
        </View>

        {/* Category chips */}
        <View style={s.filterSection}>
          <PanelLabel>Kategori</PanelLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filterChipsRow}>
            {cats.map((c) => {
              const G = Glyph[c.glyph];
              const on = selectedCat === c.id;
              return (
                <Pressable key={c.id} onPress={() => setSelectedCat(on ? 'all' : c.id)}>
                  <View
                    style={[
                      s.filterChip,
                      {
                        backgroundColor: on ? theme.text : theme.background,
                        borderColor: on ? theme.text : theme.hairline2,
                      },
                    ]}>
                    <G size={13} color={on ? theme.background : theme.text} />
                    <Text style={[s.filterChipText, { color: on ? theme.background : theme.text }]}>
                      {c.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Quick filters */}
        <View style={[s.filterSection, { marginTop: Spacing.two }]}>
          <PanelLabel>Cepat</PanelLabel>
          <View style={s.quickRow}>
            {QUICK_FILTERS.map((f) => {
              const on = quickOn.has(f.id);
              return (
                <Pressable key={f.id} onPress={() => toggleQuick(f.id)}>
                  <View
                    style={[
                      s.filterChip,
                      {
                        backgroundColor: on ? theme.routeTint : theme.background,
                        borderColor: on ? withAlpha(theme.route, 0.24) : theme.hairline2,
                      },
                    ]}>
                    {on && <Icon.check size={13} color={theme.routeInk} />}
                    <Text style={[s.filterChipText, { color: on ? theme.routeInk : theme.text }]}>
                      {f.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => {
            onApply(selectedCat);
            onClose();
          }}
          style={({ pressed }) => pressed && s.pressed}>
          <View style={[s.applyCta, { backgroundColor: theme.text }]}>
            <Text style={[s.applyCtaText, { color: theme.background }]}>
              {`Tampilkan ${filteredCount} unit`}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  pressed: { opacity: 0.7 },

  overlayRoot: { zIndex: 20, elevation: 20 },

  // Search overlay panel
  overlayPanel: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    gap: 12,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fieldWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    shadowColor: '#1c2520',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 4,
  },
  fieldInput: { flex: 1, fontSize: 14, padding: 0 },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vDivider: { width: 1, height: 20 },
  slidersBtn: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: 13, fontFamily: Font.sans['700'] },

  // Floating menu card
  floatingMenu: {
    borderRadius: 18,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
    shadowColor: '#141e19',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 24,
  },

  // Panel label
  labelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  labelText: { fontSize: 10, fontFamily: Font.mono['500'], letterSpacing: 1, textTransform: 'uppercase' },
  labelRight: { fontSize: 11, fontFamily: Font.sans['600'] },

  // Recent chips
  recentsRow: { gap: 8, paddingVertical: 4 },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  recentChipText: { fontSize: 12.5, fontFamily: Font.sans['600'] },

  // Suggest rows
  menuSection: { gap: 8 },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  suggestGlyph: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  suggestName: { fontSize: 13.5, fontFamily: Font.sans['700'], letterSpacing: -0.1 },
  suggestMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  metaBuilding: { fontSize: 11, fontFamily: Font.sans['600'] },
  tinyDot: { width: 3, height: 3, borderRadius: 999 },
  metaFloor: { fontSize: 11, fontFamily: Font.mono['600'], letterSpacing: 0.2 },
  metaCat: { fontSize: 11, fontFamily: Font.mono['400'] },

  // "View on map" row button
  viewMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
  },
  viewMapText: { fontSize: 12.5, fontFamily: Font.sans['700'] },

  // Filter sheet
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: Spacing.four,
    paddingTop: Spacing.two,
    shadowColor: '#141e19',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: Spacing.three,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
  },
  sheetTitle: { fontSize: 16, fontFamily: Font.sans['800'], letterSpacing: -0.3 },
  resetText: { fontSize: 12, fontFamily: Font.sans['600'] },
  filterSection: { gap: 8 },
  filterChipsRow: { gap: 8, paddingVertical: 4 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 12.5, fontFamily: Font.sans['600'] },
  applyCta: {
    marginTop: Spacing.four,
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#005a37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  applyCtaText: { fontSize: 14, fontFamily: Font.sans['700'] },
});
