import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph, Icon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getCategories, getUnits } from '@/services/api';
import type { Category, Unit } from '@/types/database';

function BrandCard() {
  const theme = useTheme();
  return (
    <View style={[styles.brand, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
      <View style={[styles.brandTop, { backgroundColor: theme.routeTint }]}>
        <View style={[styles.brandLogo, { backgroundColor: theme.text }]}>
          <Icon.pinFill size={26} color={theme.route} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText type="monoTag" themeColor="textSecondary" style={{ letterSpacing: 1.2 }}>
            Direktori · Kampus
          </ThemedText>
          <ThemedText type="display" style={{ fontSize: 18, marginTop: 2 }}>
            Android Map Directory
          </ThemedText>
        </View>
        <View style={[styles.version, { backgroundColor: theme.text }]}>
          <ThemedText type="monoMeta" style={{ color: theme.background, fontWeight: '700' }}>
            v1.0
          </ThemedText>
        </View>
      </View>
      <View style={[styles.brandBody, { borderTopWidth: 1, borderColor: theme.hairline }]}>
        <ThemedText type="body" themeColor="textSecondary" style={{ lineHeight: 20 }}>
          Direktori berbasis peta untuk menemukan unit kampus — departemen, PAA, kemahasiswaan, vokasi, kesehatan, dan lab —
          lengkap dengan gedung, lantai, jam layanan, dan rute langsung.
        </ThemedText>
      </View>
    </View>
  );
}

function StatCard({ value, unit, label }: { value: number; unit: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
      <ThemedText type="monoTag" themeColor="ink3" style={{ letterSpacing: 1.2 }}>
        {label}
      </ThemedText>
      <View style={styles.statBody}>
        <ThemedText type="display" style={{ fontSize: 26, lineHeight: 26 }}>
          {value}
        </ThemedText>
        <ThemedText type="monoMeta" themeColor="textSecondary" style={{ marginBottom: 2 }}>
          {unit}
        </ThemedText>
      </View>
    </View>
  );
}

function CategoryRow({ category, count, last }: { category: Category; count: number; last?: boolean }) {
  const theme = useTheme();
  const G = Glyph[category.glyph];
  return (
    <View style={[styles.catRow, !last && { borderBottomWidth: 1, borderColor: theme.hairline }]}>
      <View style={[styles.catIcon, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
        <G size={20} color={theme.routeInk} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.rowBetween}>
          <ThemedText type="caption" style={styles.bold}>
            {category.name}
          </ThemedText>
          <ThemedText type="monoMeta" themeColor="textSecondary" style={styles.semibold}>
            {String(count).padStart(2, '0')} unit
          </ThemedText>
        </View>
        <ThemedText type="body" themeColor="textSecondary" style={{ fontSize: 12, marginTop: 3, lineHeight: 17 }}>
          {category.description}
        </ThemedText>
      </View>
      <View style={{ marginTop: 12 }}>
        <Icon.chev size={14} color={theme.ink3} />
      </View>
    </View>
  );
}

function ActionRow({ label, sub, glyph = 'info', mono, last }: { label: string; sub?: string; glyph?: string; mono?: boolean; last?: boolean }) {
  const theme = useTheme();
  const I = Icon[glyph as keyof typeof Icon] || Icon.info;
  return (
    <View style={[styles.actionRow, !last && { borderBottomWidth: 1, borderColor: theme.hairline }]}>
      <View style={[styles.actionIcon, { backgroundColor: theme.backgroundElement }]}>
        <I size={15} color={theme.text} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="caption" style={styles.bold}>
          {label}
        </ThemedText>
        {sub && (
          <ThemedText type={mono ? 'monoMeta' : 'caption'} themeColor="ink3" style={{ marginTop: 1 }}>
            {sub}
          </ThemedText>
        )}
      </View>
      <Icon.chev size={14} color={theme.ink3} />
    </View>
  );
}

function DataHealth({ onRefresh }: { onRefresh: () => void }) {
  const theme = useTheme();
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <View style={[styles.health, { backgroundColor: theme.routeTint, borderColor: withAlpha(theme.route, 0.18) }]}>
      <View style={[styles.healthCheck, { backgroundColor: theme.route }]}>
        <ThemedText style={{ color: '#fff', fontSize: 12, fontWeight: '800' }}>✓</ThemedText>
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
          Data sinkron
        </ThemedText>
        <ThemedText type="monoMeta" themeColor="textSecondary">
          terakhir diperbarui · {timeStr} hari ini
        </ThemedText>
      </View>
      <Pressable onPress={onRefresh}>
        <ThemedText type="caption" themeColor="routeInk" style={styles.bold}>
          Segarkan
        </ThemedText>
      </Pressable>
    </View>
  );
}

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message || 'Gagal memuat info aplikasi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.route} />
        <ThemedText type="caption" style={{ marginTop: Spacing.two }}>Memuat info...</ThemedText>
      </ThemedView>
    );
  }

  const buildingsCount = new Set(units.map((u) => u.building_id)).size;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.one }]}>
        <View style={{ flex: 1 }}>
          <ThemedText type="monoTag" themeColor="textSecondary" style={{ letterSpacing: 1.5 }}>
            Info · Aplikasi
          </ThemedText>
          <ThemedText type="display" style={{ fontSize: 22, marginTop: 4 }}>
            Tentang & Kategori
          </ThemedText>
        </View>
        <View style={[styles.headerBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.hairline2 }]}>
          <Icon.search size={15} color={theme.text} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.four }} showsVerticalScrollIndicator={false}>
        <View style={[styles.gutter, { gap: Spacing.four }]}>
          <BrandCard />

          <View style={styles.statGrid}>
            <StatCard value={units.length} unit="unit" label="Total" />
            <StatCard value={buildingsCount} unit="gedung" label="Gedung" />
            <StatCard value={categories.length} unit="kat." label="Kategori" />
          </View>

          <DataHealth onRefresh={fetchInitialData} />

          <View>
            <View style={[styles.rowBetween, { paddingHorizontal: 2, marginBottom: 6 }]}>
              <ThemedText type="caption" style={styles.extrabold}>
                Kategori unit
              </ThemedText>
              <ThemedText type="monoMeta" themeColor="ink3">
                {categories.length} kategori
              </ThemedText>
            </View>
            <View style={[styles.catWrap, { backgroundColor: theme.background, borderColor: theme.hairline }]}>
              {categories.map((c, i) => (
                <CategoryRow key={c.id} category={c} count={units.filter((u) => u.category_id === c.id).length} last={i === categories.length - 1} />
              ))}
            </View>
          </View>

          <View>
            <ThemedText type="caption" style={[styles.extrabold, { paddingHorizontal: 2, marginBottom: 6 }]}>
              Lainnya
            </ThemedText>
            <View style={[styles.catWrap, { backgroundColor: theme.background, borderColor: theme.hairline, overflow: 'hidden' }]}>
              <ActionRow label="Bantuan & FAQ" sub="Cara pakai, izin GPS, masalah umum" glyph="info" />
              <ActionRow label="Berikan masukan" sub="Kirim saran atau laporkan data salah" glyph="star" />
              <ActionRow label="Sumber data" sub="BAA & Pusat Sistem Informasi" glyph="pin" />
              <ActionRow label="Versi aplikasi" sub="1.0.0 · build 2026.05.17" glyph="sliders" mono last />
            </View>
          </View>

          <ThemedText type="monoMeta" themeColor="ink3" style={styles.credit}>
            {'Proyek Mata Kuliah Cloud Computing\nReact Native · Node.js · Supabase · Cloud'}
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
  center: { alignItems: 'center', justifyContent: 'center' },
  gutter: { paddingHorizontal: Spacing.four },
  bold: { fontWeight: '700' },
  semibold: { fontWeight: '600' },
  extrabold: { fontWeight: '800' },
  rowBetween: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  brandTop: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  brandLogo: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  brandBody: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.four },
  statGrid: { flexDirection: 'row', gap: Spacing.two },
  stat: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  statBody: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  health: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  healthCheck: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catWrap: { borderRadius: 14, borderWidth: 1, paddingHorizontal: Spacing.four },
  catRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  catIcon: {
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
    paddingVertical: Spacing.four,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  credit: { textAlign: 'center', marginTop: Spacing.two, lineHeight: 16 },
  retryBtn: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
});
