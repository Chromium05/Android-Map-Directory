// android-frame.tsx — Material 3 Android device frame
// Status bar · Top app bar · Scrollable content · Gesture nav · Keyboard.
// Based on Figma M3 spec. AndroidDevice wraps with phone chrome on web;
// on native it renders content directly (you're already inside the device).

import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

// Material 3 teal-green surface tokens (matches the design canvas palette)
const MD_C = {
  surface: '#f4fbf8',
  surfaceVariant: '#dae5e1',
  inverseOnSurface: '#ecf2ef',
  secondaryContainer: '#cde8e1',
  primaryFixedDim: '#83d5c6',
  onSurface: '#171d1b',
  onSurfaceVar: '#49454f',
  onPrimaryContainer: '#00201c',
  primary: '#006a60',
  frameBorder: 'rgba(116,119,117,0.5)',
} as const;

// ─────────────────────────────────────────────────────────────
// Status bar (time left · camera punch-hole center · icons right)
// ─────────────────────────────────────────────────────────────
export function AndroidStatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? '#fff' : MD_C.onSurface;
  return (
    <View style={styles.statusBar}>
      <View style={styles.statusLeft}>
        <Text style={[styles.statusTime, { color: c }]}>9:30</Text>
      </View>
      <View style={styles.punchHole} />
      <View style={styles.statusRight}>
        {/* wifi */}
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Path d="M8 13.3L.67 5.97a10.37 10.37 0 0114.66 0L8 13.3z" fill={c} />
        </Svg>
        {/* cell signal */}
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Path d="M14.67 14.67V1.33L1.33 14.67h13.34z" fill={c} />
        </Svg>
        {/* battery */}
        <Svg width={16} height={16} viewBox="0 0 16 16">
          <Rect x={3.75} y={2} width={8.5} height={13} rx={1.5} fill={c} />
          <Rect x={5.5} y={0.9} width={5} height={2} rx={0.5} fill={c} />
        </Svg>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Top app bar (Material 3 small / large)
// ─────────────────────────────────────────────────────────────
export function AndroidAppBar({
  title = 'Title',
  large = false,
}: {
  title?: string;
  large?: boolean;
}) {
  const iconDot = (
    <View style={styles.appBarIconSlot}>
      <View style={[styles.appBarIconDot, { backgroundColor: MD_C.onSurfaceVar }]} />
    </View>
  );
  return (
    <View style={[styles.appBar, { backgroundColor: MD_C.surface }]}>
      <View style={styles.appBarRow}>
        {iconDot}
        {!large && (
          <Text style={[styles.appBarTitle, { color: MD_C.onSurface }]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {large && <View style={{ flex: 1 }} />}
        {iconDot}
      </View>
      {large && (
        <Text style={[styles.appBarLargeTitle, { color: MD_C.onSurface }]}>{title}</Text>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// List item (Material 3)
// ─────────────────────────────────────────────────────────────
export function AndroidListItem({
  headline,
  supporting,
  leading,
}: {
  headline: string;
  supporting?: string;
  leading?: string;
}) {
  return (
    <View style={styles.listItem}>
      {leading !== undefined && (
        <View style={[styles.listLeading, { backgroundColor: MD_C.primary }]}>
          <Text style={styles.listLeadingText}>{leading}</Text>
        </View>
      )}
      <View style={styles.listContent}>
        <Text style={[styles.listHeadline, { color: MD_C.onSurface }]}>{headline}</Text>
        {supporting && (
          <Text style={[styles.listSupporting, { color: MD_C.onSurfaceVar }]}>{supporting}</Text>
        )}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Gesture nav bar (pill)
// ─────────────────────────────────────────────────────────────
export function AndroidNavBar({ dark = false }: { dark?: boolean }) {
  return (
    <View style={styles.navBar}>
      <View
        style={[styles.navPill, { backgroundColor: dark ? '#fff' : MD_C.onSurface, opacity: 0.4 }]}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Gboard keyboard (visual sim, no key press handling)
// ─────────────────────────────────────────────────────────────
export function AndroidKeyboard() {
  function KeyRow({
    keys,
    padH = 0,
  }: {
    keys: string[];
    padH?: number;
  }) {
    return (
      <View style={[styles.keyRow, padH ? { paddingHorizontal: padH } : null]}>
        {keys.map((k) => (
          <View key={k} style={[styles.key, { backgroundColor: MD_C.surface }]}>
            <Text style={[styles.keyLabel, { color: MD_C.onPrimaryContainer }]}>{k}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.keyboard, { backgroundColor: MD_C.inverseOnSurface }]}>
      <View style={styles.keyboardSpacer} />
      <View style={styles.keyboardRows}>
        <KeyRow keys={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']} />
        <KeyRow keys={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']} padH={20} />
        <View style={styles.keyRow}>
          <View style={[styles.key, styles.keySpecial, { backgroundColor: MD_C.surfaceVariant }]} />
          <View style={[styles.keyRow, { flex: 7 }]}>
            {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map((k) => (
              <View key={k} style={[styles.key, { backgroundColor: MD_C.surface }]}>
                <Text style={[styles.keyLabel, { color: MD_C.onPrimaryContainer }]}>{k}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.key, styles.keySpecial, { backgroundColor: MD_C.surfaceVariant }]} />
        </View>
        <View style={styles.keyRow}>
          <View
            style={[
              styles.key,
              styles.keySymbol,
              { backgroundColor: MD_C.secondaryContainer, borderRadius: 100 },
            ]}>
            <Text style={[styles.keyLabelSm, { color: MD_C.onPrimaryContainer }]}>?123</Text>
          </View>
          <View style={[styles.key, { backgroundColor: MD_C.surfaceVariant }]}>
            <Text style={[styles.keyLabel, { color: MD_C.onPrimaryContainer }]}>,</Text>
          </View>
          <View style={[styles.key, { flex: 3, backgroundColor: MD_C.surface }]} />
          <View style={[styles.key, { backgroundColor: MD_C.surfaceVariant }]}>
            <Text style={[styles.keyLabel, { color: MD_C.onPrimaryContainer }]}>.</Text>
          </View>
          <View
            style={[styles.key, styles.keySymbol, { backgroundColor: MD_C.primaryFixedDim, borderRadius: 100 }]}
          />
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Device frame — wraps everything with Android chrome.
// On web: renders a full phone-shaped frame with border + shadow.
// On native: transparent pass-through (you're already in the device).
// ─────────────────────────────────────────────────────────────
export function AndroidDevice({
  children,
  width = 412,
  height = 892,
  dark = false,
  title,
  large = false,
  keyboard = false,
}: {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  dark?: boolean;
  title?: string;
  large?: boolean;
  keyboard?: boolean;
}) {
  const isWeb = Platform.OS === 'web';
  return (
    <View
      style={[
        styles.device,
        isWeb && { width, height },
        { backgroundColor: dark ? '#1d1b20' : MD_C.surface },
        isWeb && styles.deviceWebFrame,
      ]}>
      <AndroidStatusBar dark={dark} />
      {title !== undefined && <AndroidAppBar title={title} large={large} />}
      <ScrollView style={styles.deviceContent} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {keyboard && <AndroidKeyboard />}
      <AndroidNavBar dark={dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Status bar
  statusBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statusLeft: { width: 128, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusTime: { fontSize: 14, fontWeight: '400', letterSpacing: 0.25, lineHeight: 20 },
  punchHole: {
    position: 'absolute',
    left: '50%' as unknown as number,
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: '#2e2e2e',
    transform: [{ translateX: -12 }],
  },
  statusRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },

  // App bar
  appBar: { paddingHorizontal: 4, paddingTop: 4 },
  appBarRow: { height: 56, flexDirection: 'row', alignItems: 'center', gap: 4 },
  appBarIconSlot: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarIconDot: { width: 22, height: 22, borderRadius: 11, opacity: 0.3 },
  appBarTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '400',
  },
  appBarLargeTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    fontSize: 28,
    fontWeight: '400',
  },

  // List item
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  listLeading: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  listLeadingText: { fontSize: 18, fontWeight: '500', color: '#fff' },
  listContent: { flex: 1 },
  listHeadline: { fontSize: 16, lineHeight: 24 },
  listSupporting: { fontSize: 14, lineHeight: 20 },

  // Nav bar
  navBar: { height: 24, alignItems: 'center', justifyContent: 'center' },
  navPill: { width: 108, height: 4, borderRadius: 2 },

  // Keyboard
  keyboard: { paddingHorizontal: 8, paddingBottom: 8 },
  keyboardSpacer: { height: 44 },
  keyboardRows: { flexDirection: 'column', gap: 12 },
  keyRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  key: {
    flex: 1,
    height: 46,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keySpecial: { flex: 1 },
  keySymbol: { flex: 0, minWidth: 58 },
  keyLabel: { fontSize: 21 },
  keyLabelSm: { fontSize: 14 },

  // Device frame
  device: {
    flex: 1,
    overflow: 'hidden',
  },
  deviceWebFrame: {
    borderRadius: 18,
    borderWidth: 8,
    borderColor: MD_C.frameBorder,
    // Web-only shadow via boxShadow (RN web supports this style property)
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 30px 80px rgba(0,0,0,0.25)' } as object)
      : {}),
  },
  deviceContent: { flex: 1 },
});
