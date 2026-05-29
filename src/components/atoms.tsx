import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Glyph, Icon } from '@/components/icons';
import { Font, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GlyphName, UnitStatus } from '@/constants/units';

// ─────────────────────────────────────────────────────────────
// Shared atoms — ported from the design's atoms.jsx.
// ─────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<UnitStatus, string> = {
  open: 'Buka',
  closed: 'Tutup',
  soon: 'Tutup 30m',
};

export function StatusPill({ status, label }: { status: UnitStatus; label?: string }) {
  const theme = useTheme();
  const color =
    status === 'open' ? theme.open : status === 'closed' ? theme.closed : theme.warning;
  return (
    <View style={styles.pillRow}>
      <View
        style={[
          styles.dot,
          { backgroundColor: color },
          status === 'open' && { shadowColor: color },
          status === 'open' && styles.dotGlow,
        ]}
      />
      <Text style={[styles.pillText, { color }]}>{label ?? STATUS_LABEL[status]}</Text>
    </View>
  );
}

export function Distance({ value, unit }: { value: string; unit: string }) {
  const theme = useTheme();
  return (
    <Text style={{ fontFamily: Font.mono['400'], fontSize: 12, color: theme.textSecondary }}>
      <Text style={{ fontFamily: Font.mono['600'], color: theme.text }}>{value}</Text>
      <Text style={{ opacity: 0.7 }}> {unit}</Text>
    </Text>
  );
}

export function FloorBadge({
  building,
  floor,
  compact = false,
}: {
  building: string;
  floor: string;
  compact?: boolean;
}) {
  const theme = useTheme();
  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Icon.pin size={11} color={theme.routeInk} />
        <Text style={[styles.compactBuilding, { color: theme.text }]}>{building}</Text>
        <View style={[styles.tinyDot, { backgroundColor: theme.ink3 }]} />
        <Text style={[styles.compactFloor, { color: theme.routeInk }]}>{floor}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.badge, { borderColor: theme.hairline2 }]}>
      <View style={[styles.badgeBuilding, { backgroundColor: theme.backgroundElement }]}>
        <Icon.pin size={11} color={theme.routeInk} />
        <Text style={[styles.badgeBuildingText, { color: theme.text }]}>{building}</Text>
      </View>
      <View style={[styles.badgeFloor, { backgroundColor: theme.text }]}>
        <Text style={[styles.badgeFloorText, { color: theme.background }]}>{floor}</Text>
      </View>
    </View>
  );
}

export function PhotoSlot({
  height = 120,
  radius = Radius.md,
  label = 'foto tempat',
  style,
}: {
  height?: number;
  radius?: number;
  label?: string;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.photo,
        {
          height,
          borderRadius: radius,
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.hairline,
        },
        style,
      ]}>
      <Text style={[styles.photoLabel, { color: theme.ink3 }]}>{label}</Text>
    </View>
  );
}

export function CategoryChip({
  label,
  glyph,
  active = false,
  compact = false,
}: {
  label: string;
  glyph: GlyphName;
  active?: boolean;
  compact?: boolean;
}) {
  const theme = useTheme();
  const G = Glyph[glyph];
  return (
    <View
      style={[
        styles.chip,
        compact && styles.chipCompact,
        {
          backgroundColor: active ? theme.text : theme.background,
          borderColor: active ? theme.text : theme.hairline2,
        },
      ]}>
      <G size={compact ? 12 : 14} color={active ? theme.background : theme.text} />
      <Text
        style={[
          styles.chipText,
          { color: active ? theme.background : theme.text, fontSize: compact ? 12 : 13 },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 999 },
  dotGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 2,
  },
  pillText: { fontSize: 11, fontFamily: Font.sans['600'], letterSpacing: 0.1 },
  compactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  compactBuilding: { fontSize: 11, fontFamily: Font.sans['600'] },
  tinyDot: { width: 3, height: 3, borderRadius: 999 },
  compactFloor: { fontSize: 11, fontFamily: Font.mono['600'], letterSpacing: 0.2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  badgeBuilding: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6 },
  badgeBuildingText: { fontSize: 11, fontFamily: Font.sans['600'] },
  badgeFloor: { justifyContent: 'center', paddingHorizontal: 9, paddingVertical: 6 },
  badgeFloorText: { fontSize: 11, fontFamily: Font.mono['700'], letterSpacing: 0.3 },
  photo: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  photoLabel: {
    fontFamily: Font.mono['500'],
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipCompact: { height: 30, paddingHorizontal: 10, gap: 5 },
  chipText: { fontFamily: Font.sans['600'] },
});
