import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph, Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { CATEGORIES, CATEGORY_DESC, UNITS, type Category } from '@/constants/units';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/hooks/use-theme';

function BrandCard() {
  const theme = useTheme();
  return (
    <View style={[styles.card, { borderColor: theme.hairline }]}>
      <View style={[styles.brandHead, { backgroundColor: theme.routeTint }]}>
        <View style={[styles.brandTile, { backgroundColor: theme.text }]}>
          <Icon.pinFill size={26} color={theme.route} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="monoTag" themeColor="textSecondary">
            Direktori · Kampus
          </ThemedText>
          <ThemedText type="titleL" style={{ marginTop: 2 }}>
            Android Map Directory
          </ThemedText>
        </View>
        <View style={[styles.versionTag, { backgroundColor: theme.text }]}>
          <ThemedText type="monoMeta" style={{ color: theme.background, fontSize: 10 }}>
            v1.0
          </ThemedText>
        </View>
      </View>
      <View style={[styles.brandBody, { borderColor: theme.hairline }]}>
        <ThemedText type="body" themeColor="textSecondary">
          Direktori berbasis peta untuk menemukan unit kampus — departemen, PAA, kemahasiswaan,
          vokasi, kesehatan, dan lab — lengkap dengan gedung, lantai, jam layanan, dan rute langsung.
        </ThemedText>
      </View>
    </View>
  );
}

function StatCard({ value, unit, label }: { value: number; unit: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
      <ThemedText type="monoMeta" themeColor="ink3" style={styles.statLabel}>
        {label}
      </ThemedText>
      <View style={styles.statValueRow}>
        <ThemedText type="display" style={{ fontSize: 26 }}>
          {value}
        </ThemedText>
        <ThemedText type="monoMeta" themeColor="textSecondary">
          {unit}
        </ThemedText>
      </View>
    </View>
  );
}

function DataHealth() {
  const theme = useTheme();
  return (
    <View style={[styles.dataHealth, { backgroundColor: theme.routeTint, borderColor: withAlpha(theme.route, 0.18) }]}>
      <View style={[styles.checkCircle, { backgroundColor: theme.route }]}>
        <Icon.check size={16} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
          Data sinkron
        </ThemedText>
        <ThemedText type="monoMeta" themeColor="textSecondary">
          terakhir diperbarui · 09:14 hari ini
        </ThemedText>
      </View>
      <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
        Segarkan
      </ThemedText>
    </View>
  );
}

function CategoryRow({ c, count, last }: { c: Category; count: number; last: boolean }) {
  const theme = useTheme();
  const G = Glyph[c.glyph];
  return (
    <View style={[styles.catRow, !last && { borderBottomWidth: 1, borderColor: theme.hairline }]}>
      <View style={[styles.catGlyph, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
        <G size={20} color={theme.routeInk} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.rowBetween}>
          <ThemedText type="titleM">{c.label}</ThemedText>
          <ThemedText type="monoMeta" themeColor="textSecondary">
            {String(count).padStart(2, '0')} unit
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="textSecondary" style={{ marginTop: 3 }}>
          {CATEGORY_DESC[c.id] ?? '—'}
        </ThemedText>
      </View>
      <View style={{ marginTop: 12 }}>
        <Icon.chev size={14} color={theme.ink3} />
      </View>
    </View>
  );
}

function ActionRow({
  label,
  sub,
  icon,
  mono,
  last,
  onPress,
}: {
  label: string;
  sub?: string;
  icon: string;
  mono?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const I = Icon[icon];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.actionRow, !last && { borderBottomWidth: 1, borderColor: theme.hairline }]}>
        <View style={[styles.actionIcon, { backgroundColor: theme.backgroundElement }]}>
          <I size={15} color={theme.text} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="caption" style={styles.bold}>
            {label}
          </ThemedText>
          {sub ? (
            <ThemedText
              type={mono ? 'monoMeta' : 'caption'}
              themeColor="ink3"
              style={{ fontSize: 11, marginTop: 1 }}>
              {sub}
            </ThemedText>
          ) : null}
        </View>
        <Icon.chev size={14} color={theme.ink3} />
      </View>
    </Pressable>
  );
}

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { signOut } = useAuth();

  const counts: Record<string, number> = {};
  UNITS.forEach((u) => {
    counts[u.cat] = (counts[u.cat] ?? 0) + 1;
  });
  const buildings = new Set(UNITS.map((u) => u.building)).size;
  const cats = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.two,
          paddingBottom: BottomTabInset + Spacing.four,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.gutter, styles.headerRow]}>
          <View style={{ flex: 1 }}>
            <ThemedText type="monoTag" themeColor="textSecondary">
              Info · Aplikasi
            </ThemedText>
            <ThemedText type="titleL" style={{ fontSize: 22, marginTop: Spacing.one }}>
              Tentang & Kategori
            </ThemedText>
          </View>
          <View style={[styles.headerBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
            <Icon.search size={15} color={theme.text} />
          </View>
        </View>

        <View style={[styles.gutter, { gap: Spacing.three, marginTop: Spacing.three }]}>
          <BrandCard />

          <View style={styles.statRow}>
            <StatCard value={UNITS.length} unit="unit" label="Total" />
            <StatCard value={buildings} unit="gedung" label="Gedung" />
            <StatCard value={cats.length} unit="kat." label="Kategori" />
          </View>

          <DataHealth />

          <View>
            <View style={[styles.rowBetween, { marginBottom: Spacing.two, marginHorizontal: 2 }]}>
              <ThemedText type="titleM">Kategori unit</ThemedText>
              <ThemedText type="monoMeta" themeColor="ink3">
                {cats.length} kategori
              </ThemedText>
            </View>
            <View style={[styles.group, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
              {cats.map((c, i) => (
                <CategoryRow key={c.id} c={c} count={counts[c.id] ?? 0} last={i === cats.length - 1} />
              ))}
            </View>
          </View>

          <View>
            <ThemedText type="titleM" style={{ marginBottom: Spacing.two, marginHorizontal: 2 }}>
              Lainnya
            </ThemedText>
            <View
              style={[styles.group, styles.groupClip, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
              <ActionRow label="Keluar" sub="Hapus sesi & kembali ke login" icon="pinFill" onPress={signOut} />
              <ActionRow label="Bantuan & FAQ" sub="Cara pakai, izin GPS, masalah umum" icon="info" />
              <ActionRow label="Berikan masukan" sub="Kirim saran atau laporkan data salah" icon="star" />
              <ActionRow label="Sumber data" sub="BAA & Pusat Sistem Informasi" icon="pin" />
              <ActionRow label="Versi aplikasi" sub="1.0.0 · build 2026.05.17" icon="sliders" mono last />
            </View>
          </View>

          <ThemedText type="monoMeta" themeColor="ink3" style={styles.footer}>
            Proyek Mata Kuliah Cloud Computing{'\n'}React Native · Node.js · MySQL · Cloud
          </ThemedText>
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.three },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  brandHead: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 18, paddingHorizontal: 18, paddingBottom: 16 },
  brandTile: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  brandBody: { paddingTop: 12, paddingHorizontal: 18, paddingBottom: Spacing.four, borderTopWidth: 1 },
  statRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: { flex: 1, paddingVertical: 14, paddingHorizontal: 12, borderRadius: Radius.md, borderWidth: 1, gap: 4 },
  statLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  dataHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  checkCircle: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  group: { borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.four },
  groupClip: { paddingHorizontal: 0, overflow: 'hidden' },
  catRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three, paddingVertical: 14 },
  catGlyph: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
  },
  actionIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  footer: { textAlign: 'center', fontSize: 10, lineHeight: 16, marginTop: Spacing.one },
});
