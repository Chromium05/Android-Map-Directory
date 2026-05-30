// campus-plan.tsx — Static SVG campus map with interactive pins
// Used as the web map and native fallback (when expo-maps is unavailable).
// Background: 380×600 plan. Pins, user dot, callout overlaid as RN Views.

import React, { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Path,
  Pattern,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import { Glyph } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { UNITS } from '@/constants/units';
import { useTheme } from '@/hooks/use-theme';

// Design canvas dimensions
const PW = 380;
const PH = 600;
// User's position on the map (Gedung Pusat lobby, matches design)
const USER_X = 186;
const USER_Y = 290;

// Map background palette — approximated from the oklch values in the design
const MC = {
  bg: '#f5f1e6',
  green: '#dff0da',
  greenDk: '#c4e4bc',
  road: '#faf8f4',
  roadEdge: '#e0d9cf',
  block: '#ece8de',
  blockEdge: '#d9d3c7',
  blockAct: '#e4ddd0',
  label: '#5a6e60',
  labelAct: '#254830',
} as const;

// ─────────────────────────────────────────────────────────────
// Public props (mirrors CampusMapProps subset so campus-map
// can pass its own props through without conversion)
// ─────────────────────────────────────────────────────────────
export type CampusPlanProps = {
  /** IDs of units that should render as normal (non-dim) pins */
  visibleIds: number[];
  /** ID of the currently-selected unit */
  selectedId?: number;
  onPinPress?: (id: number) => void;
  style?: ViewStyle;
};

// ─────────────────────────────────────────────────────────────
// Static background — buildings, roads, greenery, compass
// ─────────────────────────────────────────────────────────────
function BackgroundMap() {
  return (
    <>
      <Defs>
        <Pattern id="mpGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <Path d="M40 0H0V40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
        </Pattern>
      </Defs>
      <Rect width={PW} height={PH} fill="url(#mpGrid)" />

      {/* Greenery */}
      <Rect x="14" y="48" width="60" height="74" rx="6" fill={MC.green} />
      <Rect x="270" y="40" width="98" height="60" rx="6" fill={MC.green} />
      <Rect x="14" y="450" width="100" height="130" rx="6" fill={MC.green} />
      <Rect x="240" y="460" width="130" height="120" rx="6" fill={MC.green} />
      <Circle cx="190" cy="300" r="36" fill={MC.green} />
      <Circle cx="190" cy="300" r="22" fill={MC.greenDk} opacity="0.6" />

      {/* Roads — main loop */}
      <Path d="M-10 165 H390" stroke={MC.road} strokeWidth="22" fill="none" />
      <Path d="M-10 165 H390" stroke={MC.roadEdge} strokeWidth="1" fill="none" />
      <Path d="M-10 410 H390" stroke={MC.road} strokeWidth="22" fill="none" />
      <Path d="M-10 410 H390" stroke={MC.roadEdge} strokeWidth="1" fill="none" />
      <Path d="M150 -10 V610" stroke={MC.road} strokeWidth="18" fill="none" />
      <Path d="M150 -10 V610" stroke={MC.roadEdge} strokeWidth="1" fill="none" />
      <Path d="M232 -10 V610" stroke={MC.road} strokeWidth="14" fill="none" />
      <Path d="M232 -10 V610" stroke={MC.roadEdge} strokeWidth="1" fill="none" />

      {/* Pedestrian dashed paths */}
      <Path
        d="M190 165 L190 300 L232 300"
        stroke={MC.roadEdge}
        strokeWidth="1.5"
        strokeDasharray="3 4"
        fill="none"
      />
      <Path
        d="M75 165 L75 410"
        stroke={MC.roadEdge}
        strokeWidth="1.5"
        strokeDasharray="3 4"
        fill="none"
      />

      {/* FK */}
      <Rect x="34" y="178" width="76" height="56" rx="3" fill={MC.block} stroke={MC.blockEdge} />
      <SvgText x="72" y="210" textAnchor="middle" fontSize={9} fontWeight="600" fill={MC.label}>
        FK
      </SvgText>

      {/* FKM */}
      <Rect x="80" y="120" width="60" height="44" rx="3" fill={MC.block} stroke={MC.blockEdge} />
      <SvgText x="110" y="146" textAnchor="middle" fontSize={9} fontWeight="600" fill={MC.label}>
        FKM
      </SvgText>

      {/* Pusat */}
      <Rect x="158" y="240" width="56" height="50" rx="3" fill={MC.block} stroke={MC.blockEdge} />
      <SvgText x="186" y="268" textAnchor="middle" fontSize={9} fontWeight="600" fill={MC.label}>
        PUSAT
      </SvgText>

      {/* GED. TI — active building */}
      <Rect
        x="234"
        y="180"
        width="74"
        height="80"
        rx="3"
        fill={MC.blockAct}
        stroke={MC.roadEdge}
      />
      <SvgText
        x="271"
        y="224"
        textAnchor="middle"
        fontSize={9}
        fontWeight="700"
        fill={MC.labelAct}>
        GED. TI
      </SvgText>

      {/* Sipil */}
      <Rect x="280" y="270" width="74" height="44" rx="3" fill={MC.block} stroke={MC.blockEdge} />
      <SvgText x="317" y="295" textAnchor="middle" fontSize={9} fontWeight="600" fill={MC.label}>
        SIPIL
      </SvgText>

      {/* Mesin */}
      <Rect x="280" y="324" width="74" height="44" rx="3" fill={MC.block} stroke={MC.blockEdge} />
      <SvgText x="317" y="349" textAnchor="middle" fontSize={9} fontWeight="600" fill={MC.label}>
        MESIN
      </SvgText>

      {/* Vokasi */}
      <Rect x="148" y="340" width="80" height="60" rx="3" fill={MC.block} stroke={MC.blockEdge} />
      <SvgText x="188" y="373" textAnchor="middle" fontSize={9} fontWeight="600" fill={MC.label}>
        VOKASI
      </SvgText>

      {/* Compass */}
      <G transform="translate(340, 540)">
        <Circle r="14" fill="white" stroke={MC.roadEdge} />
        <Path d="M0 -8 L4 6 L0 3 L-4 6 Z" fill={MC.labelAct} />
        <SvgText x="0" y="-18" textAnchor="middle" fontSize={8} fontWeight="700" fill={MC.label}>
          N
        </SvgText>
      </G>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// User location pulsing dot
// ─────────────────────────────────────────────────────────────
function UserDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <View style={[styles.userDotWrap, { left: x - 30, top: y - 30 }]} pointerEvents="none">
      <View style={[styles.userDotPulse, { backgroundColor: color + '38' }]} />
      <View style={[styles.userDotCore, { backgroundColor: color }]} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Dim pin — small grey dot for units outside the active category
// ─────────────────────────────────────────────────────────────
function DimPin({
  x,
  y,
  onPress,
}: {
  x: number;
  y: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.dimPin, { left: x - 6, top: y - 6 }]}>
      <View
        style={[
          styles.dimDot,
          { backgroundColor: theme.background, borderColor: theme.ink3 },
        ]}
      />
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// Normal pin — green droplet with white circle + glyph
// ─────────────────────────────────────────────────────────────
function NormalPin({
  u,
  x,
  y,
  s,
  onPress,
}: {
  u: (typeof UNITS)[0];
  x: number;
  y: number;
  s: number; // map scale
  onPress: () => void;
}) {
  const theme = useTheme();
  const GlyphIcon = Glyph[u.glyph];
  const pw = Math.round(32 * s);
  const ph = Math.round(40 * s);
  const glyphSz = Math.max(9, Math.round(11 * s));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pinWrap, { left: x - pw / 2, top: y - ph, width: pw, height: ph }]}>
      <Svg width={pw} height={ph} viewBox="0 0 32 40">
        <Path
          d="M16 1c8 0 14 6 14 14 0 6-4 11-14 24C6 26 2 21 2 15 2 7 8 1 16 1Z"
          fill={theme.route}
          stroke="white"
          strokeWidth="2"
        />
        <Circle cx="16" cy="14" r="8" fill="white" />
      </Svg>
      <View
        style={[
          styles.pinGlyph,
          {
            left: pw / 2 - glyphSz / 2,
            top: Math.round(14 * s) - glyphSz / 2,
          },
        ]}>
        <GlyphIcon size={glyphSz} color={theme.routeInk} />
      </View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// Selected pin — larger dark droplet with white circle + glyph
// ─────────────────────────────────────────────────────────────
function SelectedPin({
  u,
  x,
  y,
  s,
  onPress,
}: {
  u: (typeof UNITS)[0];
  x: number;
  y: number;
  s: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  const GlyphIcon = Glyph[u.glyph];
  const pw = Math.round(46 * s);
  const ph = Math.round(56 * s);
  const glyphSz = Math.max(12, Math.round(16 * s));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pinWrap, { left: x - pw / 2, top: y - ph, width: pw, height: ph, zIndex: 3 }]}>
      <Svg width={pw} height={ph} viewBox="0 0 46 56">
        <Path
          d="M23 1c11 0 20 8.5 20 19.5 0 8-6 16-20 33-14-17-20-25-20-33C3 9.5 12 1 23 1Z"
          fill={theme.text}
          stroke="white"
          strokeWidth="2"
        />
        <Circle cx="23" cy="20" r="13" fill={theme.background} />
      </Svg>
      <View
        style={[
          styles.pinGlyph,
          {
            left: pw / 2 - glyphSz / 2,
            top: Math.round(20 * s) - glyphSz / 2,
          },
        ]}>
        <GlyphIcon size={glyphSz} color={theme.text} />
      </View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────
// Callout bubble — tooltip above the selected pin
// ─────────────────────────────────────────────────────────────
function Callout({
  u,
  x,
  y,
  pinH,
}: {
  u: (typeof UNITS)[0];
  x: number;
  y: number;
  pinH: number; // selected pin height in screen px
}) {
  const theme = useTheme();
  return (
    // bottom of callout (excluding tail) sits ~10px above pin top
    <View
      style={[
        styles.callout,
        {
          backgroundColor: theme.text,
          left: x - 80,
          top: y - pinH - 62,
          zIndex: 4,
        },
      ]}
      pointerEvents="none">
      <View
        style={[
          styles.calloutIcon,
          { backgroundColor: theme.route + '47', borderRadius: 8 },
        ]}>
        {React.createElement(Glyph[u.glyph], { size: 14, color: theme.route })}
      </View>
      <View>
        <ThemedText
          type="titleM"
          style={{ fontSize: 12, color: theme.background, letterSpacing: -0.1 }}>
          {u.short}
        </ThemedText>
        <ThemedText
          type="monoMeta"
          style={{ fontSize: 10, color: theme.background, opacity: 0.75 }}>
          {u.building} · {u.floor}
        </ThemedText>
      </View>
      {/* Tail */}
      <View
        style={[
          styles.calloutTail,
          { backgroundColor: theme.text },
        ]}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// CampusPlan — root component
// ─────────────────────────────────────────────────────────────
export default function CampusPlan({
  visibleIds,
  selectedId,
  onPinPress,
  style,
}: CampusPlanProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  }, []);

  const { w, h } = size;
  // slice: scale to fill container, clipping the overflow
  const s = w > 0 && h > 0 ? Math.max(w / PW, h / PH) : 1;
  const offX = (w - PW * s) / 2;
  const offY = (h - PH * s) / 2;
  const sx = (x: number) => offX + x * s;
  const sy = (y: number) => offY + y * s;

  const visSet = new Set(visibleIds);
  const selId = selectedId ?? visibleIds[0] ?? UNITS[0].id;
  const selectedUnit = UNITS.find((u) => u.id === selId) ?? UNITS[0];
  const dimmed = UNITS.filter((u) => !visSet.has(u.id));
  const normalPins = UNITS.filter((u) => visSet.has(u.id) && u.id !== selId);

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <Svg
        style={StyleSheet.absoluteFillObject}
        viewBox={`0 0 ${PW} ${PH}`}
        preserveAspectRatio="xMidYMid slice"
        width={w || PW}
        height={h || PH}>
        <BackgroundMap />
      </Svg>

      {w > 0 && (
        <>
          <UserDot x={sx(USER_X)} y={sy(USER_Y)} color="#1ba775" />

          {dimmed.map((u) => (
            <DimPin
              key={u.id}
              x={sx(u.coord.x)}
              y={sy(u.coord.y)}
              onPress={() => onPinPress?.(u.id)}
            />
          ))}

          {normalPins.map((u) => (
            <NormalPin
              key={u.id}
              u={u}
              x={sx(u.coord.x)}
              y={sy(u.coord.y)}
              s={s}
              onPress={() => onPinPress?.(u.id)}
            />
          ))}

          <Callout
            u={selectedUnit}
            x={sx(selectedUnit.coord.x)}
            y={sy(selectedUnit.coord.y)}
            pinH={56 * s}
          />
          <SelectedPin
            u={selectedUnit}
            x={sx(selectedUnit.coord.x)}
            y={sy(selectedUnit.coord.y)}
            s={s}
            onPress={() => onPinPress?.(selectedUnit.id)}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },

  userDotWrap: { position: 'absolute', width: 60, height: 60 },
  userDotPulse: { position: 'absolute', width: 60, height: 60, borderRadius: 30 },
  userDotCore: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    left: 21,
    top: 21,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#005a37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },

  dimPin: { position: 'absolute', width: 12, height: 12, zIndex: 1 },
  dimDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5 },

  pinWrap: { position: 'absolute', zIndex: 2 },
  pinGlyph: { position: 'absolute' },

  callout: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    width: 160,
    shadowColor: '#141e19',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  calloutIcon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  calloutTail: {
    position: 'absolute',
    width: 10,
    height: 10,
    bottom: -5,
    left: 75,
    transform: [{ rotate: '45deg' }],
  },
});
